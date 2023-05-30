import React, {useState, useEffect} from 'react';
import '../Playlists.css';

// Add tracks to playlist popup that appears on left bar when user has tracks pending to be added to a list
export default function AddToPlaylsitForm(props){
    const [usersPlaylists, setUsersPlaylists] = useState([]); // all the user's playlists 
    const [playlistChosen, setPlaylistChosen] = useState(""); // playlist chosen to add tracks to

    // Get all playlists associated with a user's id
    useEffect(() => {
        fetch(`/api/secure/playlists/${props.userId}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setUsersPlaylists(data);  // update the user's playlists state
            setPlaylistChosen(data[0].list_id); // make the first playlist the default list to add to
        }).catch(error => {
            console.log(error)
        });
    },[]);

    // Set the playlist to add to state when the option is selected from the dropdown
    const handlePlaylistChosen = (e) => {
        setPlaylistChosen(e.target.value);
    };

    // Add the pending tracks to the chosen playlist
    const handleSubmit = (e) => {
        fetch(`/api/secure/playlists/${playlistChosen}/${props.pendingTracks}`, {
            method: 'PUT'
        }).then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            props.changePendingTracks("clear"); // clear the list of pending tracks
            e.preventDefault();
        }).catch(error => {
            console.log(error)
        });
    };

    return (
        <div id="add-tracks-to-playlist-form">
            <h2>Add Tracks to Playlist</h2>
            <select onChange={handlePlaylistChosen} name="playlist">
            {
                usersPlaylists.map((playlist) => {
                    return(
                        <option key={playlist.list_id} value={playlist.list_id}>{playlist.list_name}</option>
                    );
                })
            }
            </select>
            <button type="button" onClick={handleSubmit} id="save-tracks-to-list">Save</button>
        </div>
    );
}