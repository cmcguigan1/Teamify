import React, {useState, useEffect} from 'react';
import './Login.css';

// Displays the deactivated page if the user is not active
export default function DeactivatedUserPage(){
    return (
        <div id="deactivated-page-div">
            <p>Your account is Deactivated. Please contact the site administrator for more information</p>
        </div>
    );
};