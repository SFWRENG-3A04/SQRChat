import React from 'react';
import { StyleSheet, View, Button } from 'react-native';


export default function Home({user, uid, db, logOut}) {

  return (
    <View style={styles.container}>
      <Button title={'LogOut'} onPress={logOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})