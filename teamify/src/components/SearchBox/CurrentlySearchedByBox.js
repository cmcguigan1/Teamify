import React, {useState, useEffect} from 'react';
import './SearchBox.css';

// Currently searched by filters for searching tracks
export default function CurrentlySearchedByBox(props){

    // handle a click to delete a searched criteria
    const handleClick = (e) => {
        let selectedSpanId = e.target.id;
        let criteriaToClear = "";
        if(selectedSpanId === "artist-searched"){
            criteriaToClear = "artist";
        }
        else if(selectedSpanId === "album-searched"){
            criteriaToClear = "album";
        }
        else if(selectedSpanId === "track-searched"){
            criteriaToClear = "track";
        }
        else{
            criteriaToClear = "genre";
        }

        // parent event handler to clear the criteria 
        props.removeSearchCriteria(e, criteriaToClear);

    };

    return (
        <div id="currently-serached-criterias">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            <div>Artist: {props.searchCriteria.artist}<span id="artist-searched" className="material-symbols-outlined" onClick={handleClick}>close</span></div>
            <div>Album: {props.searchCriteria.album}<span id="album-searched" className="material-symbols-outlined" onClick={handleClick}>close</span></div>
            <div>Track: {props.searchCriteria.track}<span id="track-searched" className="material-symbols-outlined" onClick={handleClick}>close</span></div>
            <div>Genre: {props.searchCriteria.genre}<span id="genre-searched" className="material-symbols-outlined" onClick={handleClick}>close</span></div>
            <button type="button" onClick={props.handleSearchClick}>Search</button>
        </div>
    );
}