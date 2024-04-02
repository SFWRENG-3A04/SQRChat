from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from PIL import Image
from io import BytesIO
from firebase_admin import credentials, auth, initialize_app

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("./secrets/serviceAccountKey.json")
firebase = initialize_app(cred)

@app.route('/ping/<int:id>', methods=['GET'])
def ping_pong(id):
  return 'pong ' + str(id+1)

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

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)
