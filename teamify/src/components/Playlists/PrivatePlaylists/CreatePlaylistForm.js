import React, { useEffect, useState } from 'react';
import '../Playlists.css';

export default function CreatePlaylistForm(props){
    const [name, setName] = useState("");
    const [description, setDecription] = useState("");
    const [visibility, setVisibility] = useState("private");

    const handleSubmit = (e) => {
        // CLient side input validation of the new playlist's fields
        let noWeirdCharacters_name = /^[^<>;:*]*$/.test(name);
        let noWeirdCharacters_description = /^[^<>;:*]*$/.test(description);
        if(!noWeirdCharacters_name || !noWeirdCharacters_description || name.length > 255 || description.length > 255){
            e.preventDefault();
        }
        let visibility_num = visibility === "private" ? 0 : 1;
        // Creating the new obejct to be sent in fetch call
        let newPlaylistObj = {
            name: name,
            description: description,
            visibility: visibility_num
        };

        // Calling CreatePlaylistButton's onSubmit function that will POST the object to DB
        props.onSubmit(e, newPlaylistObj);
    };

    // Handler for name input 
    const onNameInputChange = (e) => {
        setName(e.target.value);
    };

    // Handler for description input
    const onDescriptionInputChange = (e) => {
        setDecription(e.target.value);
    };

    // Handler for radio button input
    const onRadioInputChange = (e) => {
        console.log(e.target.value);
        if(e.target.value === "private"){
            setVisibility("private");
        }
        else{
            setVisibility("public");
        }
    };

    return (
        <div>
            <div>
                <input type="text" onChange={onNameInputChange} name="name" placeholder="Playlist Name" required/>
            </div>
            <div>
                <input type="text" onChange={onDescriptionInputChange} name="description" placeholder="Description"/>
            </div>
            <div>
                <label>Private</label>
                <input id="private" type="radio" onChange={onRadioInputChange} name="visibility" value="private" defaultChecked/>
                <label>Public</label>
                <input id="public" type="radio" onChange={onRadioInputChange} name="visibility" value="public"/>
            </div>
            <input type="button" onClick={handleSubmit} value="Save"/>
        </div>
    );
}