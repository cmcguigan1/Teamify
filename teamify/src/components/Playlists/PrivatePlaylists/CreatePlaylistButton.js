import React, { useEffect, useState } from 'react';
import '../Playlists.css';
import CreatePlaylistForm from './CreatePlaylistForm';

export default function CreatePlaylistButton(props){
    const [creatingPlaylist, setCreatingPlaylist] = useState(false); // flag for if the user is currently creating a playlsit
    const [numberOfPlaylists, setNumberOfPlaylists] = useState(0); // the number of playlists a user has

    // Check number of playlists the user has saved
    useEffect(() => {
        fetch(`/api/secure/playlistCount/${props.userId}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setNumberOfPlaylists(data[0].numOfPlaylists);
        }).catch(error => {
            console.log(error)
        });
    }, [props.updateLeft]);

    // Handling the add to playlists button
    const handleClick = (e) => {
        if(e.target.innerText === "+ Playlist"){
            // Checks to see if the user isn't already creating a playlist, and if so, doesn't allow them to make one
            if(!creatingPlaylist){
                setCreatingPlaylist(true);
            }
        }
    }

    // On submit function passed to the CreatingPlaylsitForm component. Fetch call to create the playlist in the DB
    const handleSubmit = (e, data) => {
        fetch(`/api/secure/playlists/${props.userId}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setCreatingPlaylist(false);
            setNumberOfPlaylists((prev) => prev + 1);
            props.onSubmit(e);
        }).catch(error => {
            console.log(error)
        });
    };

    return (
        <div>
            { creatingPlaylist &&
                <CreatePlaylistForm onSubmit={handleSubmit}/>
            }
            { numberOfPlaylists < 20 ? <button id="add-playlist-btn" onClick={handleClick} type="button">+ Playlist</button> : <button id="add-playlist-btn" type="button">+ Playlist</button> }
        </div>
    );
}