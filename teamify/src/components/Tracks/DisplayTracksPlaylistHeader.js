import React, {useState, useEffect} from 'react';
import './Tracks.css';
import UpdatePlaylistsForm from '../Playlists/PrivatePlaylists/UpdatePlaylistsForm';

// Display the header of a private playlsit on right side when private playlist is clicked
export default function DisplayTracksPlaylistHeader(props){
    // Playlist fields
    const [playlistData, setPlaylistData] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState(0);
    const [displayEditForm, setDisplayEditForm] = useState(false); // flag if the playlist's fields are being edited

    // Get specific info about a playlist i.e. total playtime, number of tracks...ect
    useEffect(() => {
        fetch(`/api/open/playlistDetails/specific/${props.listId}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setPlaylistData(data[0]);
            setName(data[0].list_name);
            setDescription(data[0].list_description);
            setVisibility(data[0].list_visibility);
        }).catch(error => {
            console.log(error)
        });
    }, [props.listId]);

    // Deleting a playlist
    const handleDeleteClick = (e) => {
        if(window.confirm("Are you sure you want to delete this playlist?") == false){
            return;
        }
        // DELETE fetch call with the list id
        fetch(`/api/secure/playlists/${props.listId}`, {
            method: 'DELETE'
        })
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            // change right display to be a blank screen 
            let obj = {
                type: "",
                playlist_id: null
            }
            // calling App.js's method to change right display
            props.changeRightDisplay(obj);
            // update the list of private playlist's on left (to display the removed playlist change)
            props.toggleUpdateLeft();
        }).catch(error => {
            console.log(error)
        });
    }

    // toggle that a playlist fields are being edited
    const handleEditClick = () => {
        setDisplayEditForm((prev) => !prev);
    }

    return (
        <div id="display-tracks-header-container">
        { !displayEditForm && 
            <div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
                <div id="top-row">
                    <div><span className="display-tracks-header">Playlist: </span>{name}</div>
                    <div><span className="display-tracks-header">Visibility: </span>{visibility === 0 ? "Private" : "Public"}</div>
                    <div><span className="display-tracks-header">Number of Tracks: </span>{playlistData.numOftracks ? playlistData.numOftracks : 0}</div>
                    <div><span className="display-tracks-header">Total Playtime: </span>{playlistData.duration ? String(playlistData.duration.toFixed(2)).replace(".",":") : "0:0"}</div>
                </div>
                <div id="bottom-row">
                    <div><span className="display-tracks-header">Description: </span>{description}</div>
                    <div id="edit-icons">
                        <span onClick={handleEditClick} className="material-symbols-outlined">edit</span>
                        <span onClick={handleDeleteClick} className="material-symbols-outlined">delete</span>
                    </div>
                </div>
            </div>
        }
        {
            displayEditForm && <UpdatePlaylistsForm toggleUpdateLeft={props.toggleUpdateLeft} listId={props.listId} name={name} visibility={visibility} description={description} handleSubmit={handleEditClick}/>
        }
        </div>
    );
}