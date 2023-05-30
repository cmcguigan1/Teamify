import React, {useState, useEffect} from 'react';
import './Reviews.css';

// Button on left bar to display the user's reviews
export default function DisplayUsersReviewsButton(props) {

    // Event handler to set the right display
    const handleClick = (e) => {
        let obj = {
            type: "UsersReviews",
            playlist_id: null
        }
        // Calling changeRightDisplay defined in App.js to update right side screen
        props.changeRightDisplay(obj);
    }

    return(
        <button id="display-users-reviews-btn" onClick={handleClick}>Your Reviews</button>
    );
}