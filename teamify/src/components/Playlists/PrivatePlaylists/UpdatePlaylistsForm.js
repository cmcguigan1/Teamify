import React, {useState, useEffect} from 'react';
import '../../Tracks/Tracks.css';


export default function UpdatePlaylistsForm(props){
    const [name, setName] = useState(props.name);
    const [description, setDescription] = useState(props.description);
    const [visibility, setVisiblity] = useState(props.visibility);
    
    const handleSubmit = (e) => {
        // Checks to see if the name has a value (required field)
        if(!name){
            alert("Please input a playlist name");
            return;
        }
        // gets the length of the description
        let descriptionLength = 0;
        if(description){
            descriptionLength = description.length;
        }
        // Client side input validation
        let noWeirdCharacters_name = /^[^<>;:*]*$/.test(name);
        let noWeirdCharacters_description = /^[^<>;:*]*$/.test(description);
        if(!noWeirdCharacters_name || !noWeirdCharacters_description || name.length > 255 || descriptionLength > 255){
            e.preventDefault();
        }
        let visibility_num = visibility === "private" ? 0 : 1;
        let description_text = (description ? description : "");
        // Creating a new playlsit object
        let newPlaylistObj = {
            name: name,
            description: description_text,
            visibility: visibility_num
        };
        // PUT request to update the playlsit's fields
        fetch(`/api/secure/playlists/${props.listId}`, {
            method: 'PUT',
            body: JSON.stringify(newPlaylistObj),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            props.handleSubmit();
            props.toggleUpdateLeft();
        }).catch(error => {
            console.log(error)
        });
    }

    // Event handlers for the input fields onChange events
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleVisibilityChange = (e) => {
        setVisiblity(e.target.value);
    };

    return (
        <div id="display-tracks-header-container">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            <div id="top-row">
                <div>  
                    <label className="display-tracks-header">Playlist: </label>
                    <input type="text" name="name" onChange={handleNameChange} defaultValue={props.name} maxLength="255" required/>
                </div>
                { 
                    props.visibility === 0 &&
                    <div>
                        <label className="display-tracks-header">Private</label>
                        <input id="private" type="radio" onChange={handleVisibilityChange} name="visibility" value="private" defaultChecked/>
                        <label className="display-tracks-header">Public</label>
                        <input id="public" type="radio" onChange={handleVisibilityChange} name="visibility" value="public"/>
                    </div>
                }
                {
                    props.visibility === 1 &&
                    <div>
                        <label className="display-tracks-header">Private</label>
                        <input id="private" type="radio" onChange={handleVisibilityChange} name="visibility" value="private"/>
                        <label className="display-tracks-header">Public</label>
                        <input id="public" type="radio" onChange={handleVisibilityChange} name="visibility" value="public" defaultChecked/>
                    </div>
                }
            </div>
            <div id="bottom-row">
                <div>
                    <label className="display-tracks-header">Description: </label>
                    <input type="text" name="description" onChange={handleDescriptionChange} defaultValue={props.description} maxLength="255"/>
                </div>
                <div id="edit-icons">
                    <button id="update-playlist-info-save-btn" type="button" onClick={handleSubmit}><span className="material-symbols-outlined">save</span></button>
                </div>
            </div>
        </div>
    );
}