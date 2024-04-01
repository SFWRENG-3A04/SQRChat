import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  onAuthStateChanged,
} from "firebase/auth";
import { ref, set, onValue } from "firebase/database";
import Login from '../components/Login';
import { app, db, getAuth } from "../services/firebase";
import { logIn, logOut, signUp } from '../services/login';

export default function LandingScreen({ setLoggedIn }) {
  const [user, setUser] = useState(null);
  const [uid, setUID] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(userAuth);
        setUID(userAuth.uid);
        setLoggedIn(true);

        onValue(ref(db, "users/" + userAuth.uid), (snapshot) => {
          if (!snapshot.exists()) {
            set(ref(db, "users/" + userAuth.uid), {
              name: userAuth.displayName,
            });
          }
        });
      } else {
        // User is signed out
        setLoggedIn(false);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Login user={user} uid={uid} db={db} logIn={logIn} signUp={signUp} />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
});
