import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
import Login from '../components/Login';
import Home from '../components/Home';

// firebase/auth signInWithPopup doesn't work on RN, need to follow this:
// https://react-native-google-signin.github.io/docs/setting-up/expo
// https://react-native-google-signin.github.io/docs/setting-up/get-config-file
// update: this is a lot, you need to setup RN on ios and android and configure it
// instead we will just store email and password

const firebaseConfig = {
  apiKey: "AIzaSyCTNx0cnXkVMjHmIcCBqPnGdAKd5UooaDM",
  authDomain: "sqrchat-e7443.firebaseapp.com",
  projectId: "sqrchat-e7443",
  storageBucket: "sqrchat-e7443.appspot.com",
  messagingSenderId: "837380904816",
  appId: "1:837380904816:web:896c896216a33c158b61b5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

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
