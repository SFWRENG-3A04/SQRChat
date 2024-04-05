import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Modal
} from 'react-native';
import Reactions from './Reactions';

export default function Messages({ messages, currentUserUid, users }) {
  const [isReactionsVisible, setIsReactionsVisible] = useState(false);
  const [reactionPos, setReactionPos] = useState({ x: 0, y: 0 });
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const messageRefs = useRef({}).current;

  useEffect(() => {
    // Reset refs when messages change
    messages.forEach((_, index) => {
      messageRefs[index] = messageRefs[index] || React.createRef();
    });
  }, [messages]);

  const getSenderName = (uid) => {
    const user = users.find(user => user.uid === uid);
    return user ? user.displayName : 'Unknown';
  };

  const handleLongPress = (index) => {
    setSelectedMessageIndex(index);
    messageRefs[index].current.measure((fx, fy, width, height, px, py) => {
      const isCurrentUser = messages[index].senderUid === currentUserUid;
      // Adjusting xPosition based on the sender
      const xPosition = isCurrentUser ? Dimensions.get('window').width - 300 : 10; // Adjust as needed
      setReactionPos({
        x: xPosition,
        y: py-50, // Positioned above the message bubble
      });
      setIsReactionsVisible(true);
    });
  };

  const handleSelectReaction = (reaction) => {
    console.log(`Selected reaction ${reaction} for message index ${selectedMessageIndex}`);
    setIsReactionsVisible(false);
  };

  const handleUnsend = () => {
    console.log(`Unsend message index ${selectedMessageIndex}`);
    setIsReactionsVisible(false);
  };

  const dismissReactions = () => {
    setIsReactionsVisible(false);
  };

  return (
    <View>
      {messages.map((message, index) => (
        <TouchableWithoutFeedback
          key={index}
          onLongPress={() => handleLongPress(index)}
        >
          <View ref={messageRefs[index]} style={styles.messageContainer}>
            <Animated.View
              style={[
                styles.messageBubble,
                message.senderUid === currentUserUid ? styles.rightBubble : styles.leftBubble,
              ]}>
              <Text style={styles.senderName}>{getSenderName(message.senderUid)}</Text>
              <Text style={styles.messageText}>{message.text}</Text>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      ))}
      <Modal
        transparent={true}
        visible={isReactionsVisible}
        animationType="none"
        onRequestClose={dismissReactions}
      >
        <TouchableWithoutFeedback onPress={dismissReactions}>
          <View style={[styles.modalOverlay, { top: reactionPos.y, left: reactionPos.x }]}>
            <Reactions onSelect={handleSelectReaction} onUnsend={handleUnsend} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 0, // Ensures there's space for the ref to correctly position
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 4,
    maxWidth: '80%',
  },
  rightBubble: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  leftBubble: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageText: {
    color: 'black',
  },
  modalOverlay: {
    position: 'absolute',
    // Adjustments may be needed based on modal content size
    // This is an initial position, it will be overwritten by state
  },
});
