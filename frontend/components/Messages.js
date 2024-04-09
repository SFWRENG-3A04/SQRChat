import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import Reactions from "./Reactions";
import { ChatContext } from "../context/ChatContext";
import { update } from "firebase/database";
import { db, ref } from "../services/firebase";

export default function Messages({ messages, currentUserUid, users }) {
  const { selectedChat } = useContext(ChatContext);

  const [isReactionsVisible, setIsReactionsVisible] = useState(false);
  const [reactionPos, setReactionPos] = useState({ x: 0, y: 0 });
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const messageRefs = useRef([]);
  const [scaleAnimations, setScaleAnimations] = useState([]);

  useEffect(() => {
    // Reset refs and animations when messages change
    const animations = (messages || []).map(() => new Animated.Value(1));
    setScaleAnimations(animations);
  }, [messages]);

  const getSenderName = (uid) => {
    const user = users.find((user) => user.uid === uid);
    return user && user.displayName ? user.displayName : "Unknown";
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
    animateBubble(index, 1.1);
    if (messageRefs.current[index]) {
      messageRefs.current[index].measure((fx, fy, width, height, px, py) => {
        const isCurrentUser = messages[index].senderUid === currentUserUid;
        const xPosition = isCurrentUser
          ? Dimensions.get("window").width - 300
          : 10;
        setReactionPos({
          x: xPosition,
          y: py + height,
        });
        setIsReactionsVisible(true);
      });
    }
  };

  useEffect(() => {
    if (!isReactionsVisible && selectedMessageIndex !== null) {
      animateBubble(selectedMessageIndex, 1);
    }
  }, [isReactionsVisible]);

  const handleSelectReaction = (reaction) => {
    console.log(selectedChat);
    const updatedReactions = {
      ...selectedChat.messages[selectedMessageIndex].reactions,
    };

    if (
      updatedReactions[reaction] &&
      updatedReactions[reaction].includes(currentUserUid)
    ) {
      updatedReactions[reaction] = updatedReactions[reaction].filter(
        (uid) => uid !== currentUserUid
      );
      if (updatedReactions[reaction].length === 0) {
        delete updatedReactions[reaction];
      }
    } else {
      updatedReactions[reaction] = [];
      updatedReactions[reaction].push(currentUserUid);
    }

    const updatedChat = {
      ...selectedChat,
      messages: selectedChat.messages.map((message, index) => {
        if (index === selectedMessageIndex) {
          return {
            ...message,
            reactions: { ...updatedReactions },
          };
        }
        return message;
      }),
    };

    update(ref(db, `chats/${selectedChat.chatId}`), updatedChat)
      .then(() => {
        console.log(
          `React to message ${selectedMessageIndex} with ${reaction}`
        );
      })
      .catch((error) => {
        console.error("Error updating chat details:", error);
      });

    setIsReactionsVisible(false);
  };

  const handleUnsend = () => {
    if (selectedMessageIndex !== null) {
      const updatedMessages = [...selectedChat.messages];
      updatedMessages.splice(selectedMessageIndex, 1);

      const updatedChat = {
        ...selectedChat,
        messages: updatedMessages,
      };

      update(ref(db, `chats/${selectedChat.chatId}`), updatedChat)
        .then(() => {
          console.log(
            `Unsent a message ${selectedMessageIndex} in ${selectedChat.chatId}`
          );
        })
        .catch((error) => {
          console.error("Error updating chat details:", error);
        });
    }
    setIsReactionsVisible(false);
  };

  const dismissReactions = () => {
    setIsReactionsVisible(false);
  };

  return (
    <View>
      <Text style={styles.startOfChat}>Start of chat</Text>
      {messages &&
        messages.map((message, index) => (
          <TouchableWithoutFeedback
            key={index}
            onLongPress={() => handleLongPress(index)}
          >
            <View
              ref={(ref) => (messageRefs.current[index] = ref)}
              style={styles.messageContainer}
            >
              <Animated.View
                style={[
                  styles.messageBubble,
                  {
                    transform: [
                      {
                        scale: scaleAnimations[index]
                          ? scaleAnimations[index]
                          : 1,
                      },
                    ],
                  },
                  message.senderUid === currentUserUid
                    ? styles.rightBubble
                    : styles.leftBubble,
                ]}
              >
                <Text style={styles.senderName}>
                  {getSenderName(message.senderUid)}
                </Text>
                <Text style={styles.messageText}>{message.text}</Text>
                <View style={{ flexDirection: "row" }}>
                  {message.reactions &&
                    Object.entries(message.reactions).map(
                      ([reaction, users]) => (
                        <TouchableWithoutFeedback
                          key={reaction}
                          onPress={() => handleSelectReaction(reaction)}
                        >
                          <View style={styles.reactionContainer}>
                            <Text
                              style={styles.reactionText}
                            >{`${reaction} ${users.length}`}</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )
                    )}
                </View>
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
            <View
              style={[
                styles.reactionsContainer,
                { top: reactionPos.y - 115, left: reactionPos.x },
              ]}
            >
              <Reactions
                onSelect={handleSelectReaction}
                onUnsend={handleUnsend}
                isOwner={
                  messages[selectedMessageIndex] &&
                  messages[selectedMessageIndex].senderUid === currentUserUid
                }
              />
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
    padding: 8,
    borderRadius: 20,
    marginVertical: 4,
    maxWidth: "80%",
  },
  rightBubble: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  leftBubble: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  messageText: {
    color: "black",
    marginBottom: 5,
  },
  fullScreenOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  reactionsContainer: {
    position: "absolute",
  },
  reactionContainer: {
    backgroundColor: "gainsboro", // Background color for the emote
    width: 45,
    borderRadius: 20, // Border radius to make it oval
    padding: 5,
    marginBottom: 5, // Margin between emotes
    marginRight: 5,
  },
  reactionText: {
    fontSize: 14, // Adjust text size as needed
  },
  startOfChat: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    color: "#708090",
  },
});
