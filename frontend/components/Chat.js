import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Chat({groupChats}) {
  useEffect(() => {
    console.log(groupChats)
  }, []);

  return (
    <View>
      {groupChats != undefined ? groupChats.map(chat => (
        <Text key={chat.id}>{chat.name}</Text>
      )):
      <></>}
    </View>
  );
}
