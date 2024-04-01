import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { app, db, getAuth } from "../services/firebase";
import { ref, set, onValue } from "firebase/database";
import Login from '../components/Login';
import Home from '../components/Home';

export default function LandingScreen({navigation}) {
  const [user, setUser] = useState(null);
  const [uid, setUID] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);
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

  const logIn = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

  };

  const signUp = async (email, password) => {
    console.log(email, password)
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };

  const logOut = async (e) => {
    await signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log(error)
    });
  };

  return (
    <View style={styles.container}>
      {loggedIn == null ? null : !loggedIn ? (
        <Login user={user} uid={uid} db={db} logIn={logIn} signUp={signUp} />
      ) : (
        <Home user={user} uid={uid} db={db} logOut={logOut} />
      )}
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
