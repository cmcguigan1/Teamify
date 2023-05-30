import React, {useState, useEffect} from 'react';
import '../Playlists/Playlists.css';

export default function DisplaySearchBoxButton(props) {
    // button on left bar to pull up th esearch by tracks box on right side
    const handleClick = (e) => {
        let obj = {
            type: "SearchTracks",
            playlist_id: null
        }
        // update the right side display to display the serach box
        props.changeRightDisplay(obj);
    }

    return(
        <button id="display-search-tracks-btn" onClick={handleClick}>Search Tracks</button>
    );
}