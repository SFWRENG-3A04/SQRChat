const chats = {
  "groupChats": [
    {
      "chatId": "groupChat1",
      "participants": ["1", "2", "3"],
      "lastUpdated": 1712035800,
      "messages": [
        {
          "senderUid": "1",
          "text": "Hey everyone, glad we could all join this chat!"
        },
        {
          "senderUid": "2",
          "text": "Excited to be here! What's the plan?"
        },
        {
          "senderUid": "3",
          "text": "Looking forward to catching up with you both."
        }
      ]
    }
  ],
  "directMessages": [
    {
      "chatId": "dmChat1",
      "participants": ["1", "2"],
      "lastUpdated": 1710921600,
      "messages": [
        {
          "senderUid": "1",
          "text": "Hey Jane, how's the project going?"
        },
        {
          "senderUid": "2",
          "text": "Hi John! It's going well, thanks for asking. How about yours?"
        },
        {
          "senderUid": "1",
          "text": "Pretty smooth, might need your input soon though."
        }
      ]
    },
    {
      "chatId": "dmChat2",
      "participants": ["2", "3"],
      "lastUpdated": 1711936800,
      "messages": [
        {
          "senderUid": "2",
          "text": "Alex, got a minute to discuss the new designs?"
        },
        {
          "senderUid": "3",
          "text": "Sure, Jane! I was actually going to ask you about that. What do you think?"
        },
        {
          "senderUid": "2",
          "text": "I have a few ideas, will send over some sketches."
        }
      ]
    }
  ]
}

export { chats };