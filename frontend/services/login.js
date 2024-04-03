import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getAuth, db } from "../services/firebase";
import { ref, set } from "firebase/database";


const auth = getAuth();

const logIn = async (email, password) => {
  console.log("login: ", email, password)
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    console.log("logIn", user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });

};

const addUserToDb = async (uid, displayName) => {
  set(ref(db, "users/" + uid), {
    is_admin: false,
    name: displayName
  });
}

const signUp = async (email, password) => {
  console.log(email, password)
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
    addUserToDb(user.uid, user.displayName)
    
    console.log("signUp", user)
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

export { logIn, signUp, logOut };
