import React, { useEffect, useState } from 'react';
import '../Playlists.css';

export default function PrivatePlaylist(props) {
    const [name, setName] = useState(props.list.list_name); // Playlist name
    const [description, setDescription] = useState(props.list.list_description ? props.list.list_description : ""); // Playlist's description
    const [visibility, setVisibility] = useState(props.list.list_visibility); // Playlist's visibility
    const [listOfTracks, setListOfTracks] = useState([]); // Tracks in playlist

    // Get the tracks associated with a playlist's id
    useEffect(() => {
        fetch(`/api/open/playlists/${props.list.list_id}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setListOfTracks(data);
        }).catch(error => {
            console.log(error)
        });
    }, []);

    // Update the name, description and visibility fields when the playlist object is updated in parent component (PrivatePlaylistContainer)
    useEffect(() => {
        setName(props.list.list_name);
        setDescription(props.list.list_description);
        setVisibility(props.list.list_visibility);
    },[props.list]);

    // Event handler for when the playlist is selected from the list on left bar
    const handleClick = (e) => {
        let obj = {
            type: "PrivatePlaylist",
            playlist_id: props.list.list_id
        };
        // Call App.js's changeRightDisplay method to update the view on right side
        props.changeRightDisplay(obj);
    };

    return (
        <div className="private-playlist" onClick={handleClick}>
            <span className="playlist-name">{name}</span>
            <span>{description}</span>
            <span>{visibility === 0 ? "Private" : "Public"}</span>
        </div>
    );

}