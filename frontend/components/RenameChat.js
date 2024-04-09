import React, { useState } from 'react';
import { Modal, TextInput, Button, View, StyleSheet } from 'react-native';

const RenameChat = ({ isVisible, onSubmit, onCancel }) => {
 const [newChatName, setNewChatName] = useState('');

 return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setNewChatName}
          value={newChatName}
          placeholder="Enter new chat name"
        />
        <View style={styles.buttonContainer}>
          <Button  style={styles.button}title="Cancel" onPress={onCancel} />
          <Button  style={styles.button}title="Rename" onPress={() => onSubmit(newChatName)} />
        </View>
      </View>
    </Modal>
 );
};

const styles = StyleSheet.create({
 modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height:50,
 },
 input: {
    width: '80%',
    borderColor: '#6FBAFF',
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    borderRadius:15
 },
 buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
 },
 button:{
    backgroundColor:'#6FBAFF'
 }
});export default RenameChat;

