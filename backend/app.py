from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from PIL import Image
from io import BytesIO
from firebase_admin import credentials, auth, initialize_app, db
from flask_socketio import SocketIO, join_room, send, emit
import hashlib

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

cred = credentials.Certificate("./secrets/serviceAccountKey.json")
firebase = initialize_app(cred, {
  'databaseURL': 'https://sqrchat-e7443-default-rtdb.firebaseio.com/'
})

@app.route('/ping/<int:id>', methods=['GET'])
def ping_pong(id):
  return 'pong ' + str(id+1)

@socketio.on('joinRoom')
def handle_join_room(data):
  print("data, ", data)
  userId = data['userId']
  room = data['room']
  join_room(room)
  print(f"User {userId} joined room {room}")

  try:
    participants_ref = db.reference(f"chats/{room}/participants").get()

    if participants_ref:
      access_tokens = []

      for participant_uid in participants_ref:
        user_keys_ref = db.reference(f'keys/{participant_uid}').get()
        if user_keys_ref and 'accessToken' in user_keys_ref:
          access_tokens.append(user_keys_ref['accessToken'])

      if access_tokens:
        session_key = generate_session_key_sha256(access_tokens)
        emit('sessionKey', {'key': session_key}, room=room)  # Emit to the whole room
      else:
        print("No access tokens found for participants in the room.")
    else:
      print(f"No participants found for room {room}")
  except Exception as e:
    print(f"Error retrieving participants for room {room}: {str(e)}")

@socketio.on('sendMessage')
def handle_send_message(message):
  room = message['chatId']
  send(message, room=room)
  print(f"Message sent to room {room}: {message}")

@app.route('/get_user_list', methods=['GET'])
def getUserList():
  users = auth.list_users()
  userDict = []
  for user in users.iterate_all():
    userDict.append({ "uid": user.uid, "displayName": user.display_name, "email": user.email, "photoUrl": user.photo_url })
  return userDict

@app.route('/delete_user/<string:id>', methods=['DELETE'])
def deleteUser(id):
  user_delete = auth.delete_user(id)
  return jsonify({'message': 'User deleted successfully'}), 200

@app.route('/upload', methods=['POST'])
def upload_image():
  data = request.json
  if 'image' not in data:
    return jsonify({'message': 'No Image Received'}), 400
  image_data = data['image'].split(",")[1]  # Remove the prefix "data:image/jpeg;base64,"
  image = Image.open(BytesIO(base64.b64decode(image_data)))
  image.save('received_image.jpeg')  # Save or process the image
  return jsonify({'message': 'Image received successfully'}), 200

@app.route('/register_key/<userId>', methods=['POST'])
def delete_user(userId):
  request_data = request.get_json()
  accessToken = request_data.get('accessToken')
  refreshToken = request_data.get('refreshToken')

  if not accessToken or not refreshToken:
    return jsonify({"error": "access or refresh token is missing"}), 400

  try:
    db.reference(f'keys/{userId}').set({
      'accessToken': accessToken,
      'refreshToken': refreshToken,
    })
    return jsonify({"success": True}), 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500

def generate_session_key_sha256(access_tokens):
  combined_tokens = ":".join(access_tokens)
  session_key = hashlib.sha256(combined_tokens.encode()).hexdigest()
  return session_key

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=80, debug=False)
