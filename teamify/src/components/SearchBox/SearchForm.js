import React, {useState, useEffect} from 'react';
import './SearchBox.css';

// Form in search box to add a search criteria
export default function SearchForm(props){
    const [selectedButton, setSelectedButton] = useState("artist"); // button selected to search by
    const [searchInput, setSearchInput] = useState(""); // input field to add a search criteria

    // event handler for when a search by button is clicked
    const handleClick = (e) => {
        setSelectedButton(e.target.innerHTML.toLowerCase());
    }

    // event handler for when the input field is changed
    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSubmit = (e) => {
        // Client side input validation
        if(!searchInput){
            return;
        }
        let noWeirdCharacters = /^[^<>;:*]*$/.test(searchInput);
        if(!noWeirdCharacters || searchInput.length > 255){
            e.preventDefault();
        }

        // Call method in DesiplaySeachBoxContainer to add the search criteria
        props.addSearchCriteria(e, selectedButton, searchInput);
    };

    return (
        <div id="search-by-form">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            {selectedButton === "artist" ? <button className="selected" id="artist-criteria" type="button" onClick={handleClick}>Artist</button> : <button id="artist-criteria" type="button" onClick={handleClick}>Artist</button>}
            {selectedButton === "album" ? <button className="selected" id="album-criteria" type="button" onClick={handleClick}>Album</button> : <button id="album-criteria" type="button" onClick={handleClick}>Album</button>}
            {selectedButton === "track" ? <button className="selected" id="track-criteria" type="button" onClick={handleClick}>Track</button> : <button id="track-criteria" type="button" onClick={handleClick}>Track</button>}
            {selectedButton === "genre" ? <button className="selected" id="genre-criteria" type="button" onClick={handleClick}>Genre</button> : <button id="genre-criteria" type="button" onClick={handleClick}>Genre</button>}
            <input type="text" maxLength="255" name="searchBar" onChange={handleInputChange}/>
            <button type="button" onClick={handleSubmit} id="add-search-criteria-btn"><span className="material-symbols-outlined">add</span></button>
        </div>
    );
};