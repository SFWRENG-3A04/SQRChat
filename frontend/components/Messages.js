import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import Reactions from './Reactions';

export default function Messages({ messages, currentUserUid, users }) {
  const [isReactionsVisible, setIsReactionsVisible] = useState(false);
  const [reactionPos, setReactionPos] = useState({ x: 0, y: 0 });
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const messageRefs = useRef({}).current;
  const [scaleAnimations, setScaleAnimations] = useState([]);

  useEffect(() => {
    // Reset refs and animations when messages change
    const animations = (messages || []).map(() => new Animated.Value(1));
    setScaleAnimations(animations);
  }, [messages]);

  const getSenderName = (uid) => {
    const user = users.find(user => user.uid === uid);
    return user && user.displayName ? user.displayName : 'Unknown';
  };

  const animateBubble = (index, toValue) => {
    Animated.timing(scaleAnimations[index], {
      toValue,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPress = (index) => {
    setSelectedMessageIndex(index);
    animateBubble(index, 1.1); // Slightly enlarges the bubble
    messageRefs[index].current.measure((fx, fy, width, height, px, py) => {
      const isCurrentUser = messages[index].senderUid === currentUserUid;
      const xPosition = isCurrentUser ? Dimensions.get('window').width - 300 : 10;
      setReactionPos({
        x: xPosition,
        y: py - 50,
      });
      setIsReactionsVisible(true);
    });
  };

  useEffect(() => {
    if (!isReactionsVisible && selectedMessageIndex !== null) {
      animateBubble(selectedMessageIndex, 1); // Reset to original size when modal is hidden
    }
  }, [isReactionsVisible]);

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
      {messages && messages.map((message, index) => (
        <TouchableWithoutFeedback
          key={index}
          onLongPress={() => handleLongPress(index)}
        >
          <View ref={messageRefs[index]} style={styles.messageContainer}>
            <Animated.View
              style={[
                styles.messageBubble,
                { transform: [{ scale: scaleAnimations[index] ? scaleAnimations[index] : 1 }] }, // if smt breaks, prob this line
                message.senderUid === currentUserUid ? styles.rightBubble : styles.leftBubble,
              ]}
            >
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
          <View style={styles.fullScreenOverlay}>
            <View style={[styles.reactionsContainer, { top: reactionPos.y, left: reactionPos.x }]}>
              <Reactions onSelect={handleSelectReaction} onUnsend={handleUnsend} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 0,
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
  fullScreenOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  reactionsContainer: {
    position: 'absolute',
  },
});
