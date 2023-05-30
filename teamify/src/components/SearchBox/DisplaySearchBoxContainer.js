import React, { useEffect, useState } from 'react';
import Track from '../Tracks/Track';
import './SearchBox.css';
import SearchForm from './SearchForm';
import CurrentlySearchedByBox from './CurrentlySearchedByBox';

// Search box and the result tracks from search container displayed on right
export default function DisplaySearchBoxContainer(props){
    const [tracks, setTracks] = useState([]); // tracks to display
    const [searchCriteria, setSearchCriteria] = useState({artist: "", album: "", track: "", genre: ""}); // Currently searched criteria

    // Get all tracks that match the combination of the search criteria
    const handleSearchClick = () => {
        fetch(`/api/open/tracks/search/all?` + new URLSearchParams({
            artistBy: searchCriteria.artist,
            albumBy: searchCriteria.album,
            trackBy: searchCriteria.track,
            genreBy: searchCriteria.genre
        })).then((res) => {
            if(res.ok){
                return res.json();
            }
            if(res.status == 404){
                setTracks([]);
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setTracks(data); // set the list of tracks
        }).catch(error => {
            console.log(error)
        });
    }; 

    // event handler to add a search criteria when added from the input field in SearchForm
    const addSearchCriteria = (e, searchBy, value) => {
        setSearchCriteria((prev) => ({
            ...prev,
            [searchBy]: value
        }));
        
        e.preventDefault();
    };

    // event handler to remve a serach criteria (when deleted from the CurrentlySearchedByBox)
    const removeSearchCriteria = (e, searchBy) => {
        setSearchCriteria((prev) => ({
            ...prev,
            [searchBy]: ""
        }));
        
        e.preventDefault();
    }

    return (
        <div id="search-box-container">
            <div id="search-box-input-fields">
                <SearchForm addSearchCriteria={addSearchCriteria}/>
                <CurrentlySearchedByBox handleSearchClick={handleSearchClick} removeSearchCriteria={removeSearchCriteria} searchCriteria={searchCriteria}/>
            </div>
            <h2 className="display-tracks-header">Results</h2>
            <div id="search-results">
                { props.userId &&
                    <div id="display-tracks-table-header-searchBox">
                        <span></span>
                        <span>Youtube Search</span>
                        <span>Track</span>
                        <span>Artist</span>
                    </div>
                }
                { !props.userId &&
                    <div id="display-tracks-table-header">
                        <span>Youtube Search</span>
                        <span>Track</span>
                        <span>Artist</span>
                    </div>
                }
                {
                    tracks.map((track) => { 
                        return (
                            <Track fromSearchBox={true} userId={props.userId} changePendingTracks={props.changePendingTracks} key={track.track_id} track={track}/>
                        )
                    })
                }
            </div>
        </div>
    );
};