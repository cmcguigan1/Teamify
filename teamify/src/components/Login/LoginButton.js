import { propNames } from '@chakra-ui/react';
import React, {useState, useEffect} from 'react';
import './Login.css';

//Firebase logout btn
import { logout } from "../../firebase-config";

export default function LoginButton(props){
    // update logginIn state in App.js if the user clicks the Login button
    const handleClick = (e) => {
        props.toggleLoggingIn(true);
    };

    // handle the click of logout btn
    const handleLogoutClick = () => {
        window.location.reload();
        logout(props.signingOut);
    };

    // Display a login button if the user is signed in (userId is not underfined) otherwise display logout button
    return (
        <div id="login-btn-container">
        { props.userId &&
            <button id="login-btn" onClick={handleLogoutClick}>Logout</button>
        }
        { !props.userId &&
            <button id="login-btn" onClick={handleClick}>Login</button>
        }
        </div>
    );
}