import React, { useEffect, useState } from 'react';
import '../Playlists.css';
import PrivatePlaylist from './PrivatePlaylist';
import CreatePlaylistButton from './CreatePlaylistButton';

// Container in left bar that displays all the user's playlists
export default function PrivatePlaylistContainer(props){
    const [listOfUsersPlaylists, setListOfUsersPlaylists] = useState([]); // list of the user's playlists
    const [createNewPlaylist, setCreateNewPlaylist] = useState(false); // check if the user is currently creating a new playlist

    // Gets all playlists associated with the user's id. Called when a new playlist is created (createNewPlaylsit state) or when the updateLeft state is changed
    useEffect(() => {
        fetch(`/api/secure/playlists/${props.userId}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setListOfUsersPlaylists(data); // set the listOFUsersPlaylists state
        }).catch(error => {
            console.log(error)
        });
    }, [createNewPlaylist, props.updateLeft]);

    // Event handler to trigger the useEffect when a new playlist is created
    const handleSubmit = (e) => {
        setCreateNewPlaylist((prev) => !prev);
    };

    return (
        <div id="users-playlists-results">
            <h2>Playlists</h2>
            {
                listOfUsersPlaylists.map((list) => { 
                    return (
                        <PrivatePlaylist changeRightDisplay={props.changeRightDisplay} key={list.list_id} list={list}/>
                    )
                })
            }
            <CreatePlaylistButton updateLeft={props.updateLeft} onSubmit={handleSubmit} userId={props.userId}/>
        </div>
    );
}