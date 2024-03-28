import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import WebSocket from 'react-native-websocket';

const Chat = ({ serverUrl }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim()) {
      // Here you'd send the message to the server, e.g., using Axios for HTTP requests
      // But since we're using WebSockets, you can emit directly to the WebSocket server
      ws.send(message);
      setMessage('');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, index) => (
          <Text key={index} style={{ margin: 10 }}>
            {msg}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10 }}
        onChangeText={text => setMessage(text)}
        value={message}
        placeholder="Type a message"
      />
      <Button onPress={sendMessage} title="Send" />
      <WebSocket
        ref={ref => { ws = ref }}
        url={serverUrl}
        onOpen={() => console.log('WebSocket Open')}
        onMessage={e => {
          setMessages(prev => [...prev, e.data]);
        }}
        onError={console.log}
        onClose={console.log}
        reconnect // Will try to reconnect on all closes
      />
    </View>
  );
};

export default Chat;
