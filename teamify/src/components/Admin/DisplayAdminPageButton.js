import React, {useState, useEffect} from 'react';
import './Admin.css';

// Button on left bar to pull up the admin management page on the righ side
export default function DisplayAdminPageButton(props){

    const handleClick = (e) => {
        // Create an object and send it to changeRightDisplay function defined in App.js 
        let obj = {
            type: "Admin",
            playlist_id: null
        }
        props.changeRightDisplay(obj);
    }
    
    return (
        <button id="display-admin-functionalities-btn" onClick={handleClick}>Admin</button>
    );
}