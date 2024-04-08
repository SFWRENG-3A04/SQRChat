import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { getAuth, db } from "../services/firebase";
import { ref, set } from "firebase/database";
import axios from "axios";
import { backendEndpoint } from "../common/constants";


const auth = getAuth();

const logIn = async (email, password) => {
  console.log("login: ", email, password)
  signInWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const accessToken = await user.getIdToken(false); // forceRefresh = false
    const refreshToken = user.refreshToken;
    sendKeyToBackend(user.uid, accessToken, refreshToken);
    // ...
    console.log("logIn", user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });

};

const sendKeyToBackend = async (userId, accessToken, refreshToken) => {
  axios
    .post(`http://${backendEndpoint}/register_key/${userId}`, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    })
    .then(() => {
      // do nothing
    })
    .catch((error) => {
      console.error("Error sending key to KDC:", error);
    });
};

const addUserToDb = async (uid, displayName) => {
  set(ref(db, "users/" + uid), {
    is_admin: false,
    name: displayName
  });
}

const signUp = async (email, password, displayName) => {
  console.log(email, password);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      updateProfile(user, {
        displayName: displayName
      }).then(() => {
        addUserToDb(user.uid, user.displayName);
        console.log("signUp", user);
      }).catch((error) => {
        console.log("Error updating user profile:", error);
      });
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
