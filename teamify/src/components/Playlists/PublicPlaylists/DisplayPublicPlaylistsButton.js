import React, {useState, useEffect} from 'react';
import '../Playlists.css';

// Button on left bar to display the top 10 public playlists on the right
export default function DisplayPublicPlaylistsButton(props) {

    // Event handler to set the right display
    const handleClick = (e) => {
        let obj = {
            type: "PublicPlaylists",
            playlist_id: null
        }
        // Calling changeRightDisplay defined in App.js to update right side screen
        props.changeRightDisplay(obj);
    }

    return(
        <button id="display-public-playlists-btn" onClick={handleClick}>Display Public Playlists</button>
    );
}