import { initializeApp } from "firebase/app";

//firebase method imports 
import { GoogleAuthProvider,
        getAuth, 
        signInWithPopup, 
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        sendPasswordResetEmail,
        signOut,
        sendEmailVerification
        //onAuthStateChanged
      } from "firebase/auth"; 

import {
        getFirestore,
        query,
        getDocs,
        collection,
        where,
        addDoc,
      } from "firebase/firestore";



//configure the local details of our firebase database
const firebaseConfig = {
    apiKey: "AIzaSyBQWKD74i2THSpHoLllQ_d5kKGBnFGrk74",
    authDomain: "lab4-84edf.firebaseapp.com",
    projectId: "lab4-84edf",
    storageBucket: "lab4-84edf.appspot.com",
    messagingSenderId: "85521199671",
    appId: "1:85521199671:web:3b8a3c157feb314dd9c5b2",
    measurementId: "G-K48XT8KS5B"
  };
//initialize firebase app and Auth and store to a const variables
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);


  const db = getFirestore(app);

  const googleProvider = new GoogleAuthProvider()

//signinwithgoogle method allows users to sign in using Google as a 3rd party
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      //check if the given google user id is in the database matching an existing user
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      //displau given error
      console.error(err);
      alert(err.message);
    }
  };

//loginwithemailandpassword allows for sign in using an email and password fields
  const logInWithEmailAndPassword = async (email, password) => {
    try {
      //attempt sign in with given email and password
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      //display error if error occurs
      console.error(err);
      alert(err.message);
    }
  };



//registerWithEmailAndPassword method allows to create a user account using a name, email and password
  const registerWithEmailAndPassword = async (name, email, password) => {
    
    try {
      //use the pre-defined createUserWithEmailAndPassword method in firebase to take in a new account
    
      const res = await createUserWithEmailAndPassword(auth, email, password);
     
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });

      
      //handle errors that occur in creating a new account
    } catch (err) {
      //prints any errors with creating the account
      console.error(err);
      alert(err.message);
    }
  };



//sendPasswordReset method sends an email link to the specified user email to reset their password
  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
      //catches any errors that occur in sending the email and prints them
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

 



 
  //sends email verification to check that the email
  const sendEmailVerif = async (user) => {
    try {
      await sendEmailVerification(user);
      alert("email verification link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  } 

//logout function to sign the user
  const logout = (signingOut) => {
    signingOut();
    signOut(auth);
  };

  



  export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    sendEmailVerif
  };


