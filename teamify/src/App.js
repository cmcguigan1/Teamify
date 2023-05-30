import './App.css';
import React, { useEffect, useState } from 'react';
import LeftBar from './components/LeftBar';
import RightSide from './components/RightSide';
import LoginButton from './components/Login/LoginButton';
import DeactivatedUserPage from './components/Login/DeactivatedUserPage';

//FIREBASE IMPORTS
import SignInPage from "./components/Login/signInBars";
import { auth, getAuth, onAuthStateChanged } from './firebase-config';
import { logout } from "./firebase-config";

// Main component
function App() {
  const [rightDisplay, setRightDisplay] = useState({}); //what is displayed on right side
  const [updateLeft, setUpdateLeft] = useState(false); //whether the left bar needs to be updated based on a change in right side user's interactions
  const [pendingTracks, setPendingTracks] = useState([]); //tracks pending to be added to a playlsit
  const [userId, setUserId] = useState(null); //the user's id (will be undefined in the user is not signed in). Used for checking purposes on what to display in childen components
  const [isAdmin, setIsAdmin] = useState(0); //the user is admin or not
  const [isActive, setIsActive] = useState(0); //the user is active or not
  const [loggingIn, setLoggingIn] = useState(false); //the user is currently logging in and login form is displayed
  const [email, setEmail] = useState(""); //email of the user (set when the login form is filled and submitted succesfully)

  // Get the user data based on the email inputted 
  useEffect(() => {
    fetch(`/api/secure/users/${email}`)
    .then((res) => {
      if(res.ok){
          return res.json();
      }
      throw new Error("Request Failed")
    }, networkError => console.log(networkError.message)
    ).then((data) => {
        setUserId(data[0].user_id);
        setIsAdmin(data[0].isAdmin);
        setIsActive(data[0].isActive);
        if(data[0].isActive === 1){
          logout(() => { setLoggingIn(false)});
        }
    }).catch(error => {
        console.log(error)
    });
  },[email]);
  

  // update what to display in the right component
  const changeRightDisplay = (changeDisplayTo) => {
    setRightDisplay(changeDisplayTo);
  };

  // flag that the useEffects in left bar need to be ran based on user interaction in right side
  const toggleUpdateLeft = () => {
    setUpdateLeft((prev) => !prev);
  };

  // set the user's email field when log in is complete
  const signedInEmail = (user_email) => {
    setEmail(user_email);
  };

  // flad if the user is currently signing in then display the login form
  const toggleLoggingIn = (value) => {
    setLoggingIn(value);
  };
  
  // remove the login form component after sign in is complete
  const signingOut = () => {
    setLoggingIn(false);
  };

  // add a track id to the list of pending tracks or clear the list
  const changePendingTracks = (trackId) => {
    if(trackId == "clear"){
      setPendingTracks([]);
    }
    else{
      if(!pendingTracks.includes(trackId)){
        setPendingTracks((prev) => [...prev, trackId]);
      }
    }
  };

  return (
    <div className="App">
      <div id="teamify-banner">
        <div id="spacer-div"></div>
        <p>Teamify</p>
        <LoginButton userId={userId} signingOut={signingOut} toggleLoggingIn={toggleLoggingIn}/>
      </div>
      { loggingIn &&
        <div className="App" backgroundcolor='black'>
          <SignInPage toggleLoggingIn={toggleLoggingIn} signedInEmail={signedInEmail}></SignInPage>
        </div> 
      }
      { !loggingIn && isActive === 0 &&
        <div id="app-content">
          <LeftBar updateLeft={updateLeft} pendingTracks={pendingTracks} changePendingTracks={changePendingTracks} changeRightDisplay={changeRightDisplay} isAdmin={isAdmin} userId={userId}/>
          <RightSide isAdmin={isAdmin} toggleUpdateLeft={toggleUpdateLeft} changePendingTracks={changePendingTracks} changeDisplayTo={rightDisplay} changeRightDisplay={changeRightDisplay} userId={userId}/>
      </div>
      }
      { !loggingIn && isActive === 1 &&
        <DeactivatedUserPage />
      }
    </div>
  );

}


export default App;