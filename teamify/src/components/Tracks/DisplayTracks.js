import React, { useEffect, useState } from 'react';
import './Tracks.css';
import Track from './Track';
import DisplayTracksPlaylistHeader from './DisplayTracksPlaylistHeader';

// Display the tracks in a private playlist container on right
export default function DisplayTracks(props) {
    const [tracks, setTracks] = useState([]); // tracks in the private playlist
    const [updatePlaylistTracks, setUpdatePlaylistTracks] = useState(false); // flag for if a track is deleted and the playlsit tracks need to be rerendered

    // Get tracks in the playlist. Called when the list id changes (meaning a different private playlist was clicked)
    useEffect(() => {
        fetch(`/api/open/playlists/${props.listId}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setTracks(data); // set the tracks to display
        }).catch(error => {
            console.log(error)
        });
    }, [props.listId, updatePlaylistTracks]);

    // function to toggle the state to trigger the useEffect to re-render and refrehs tracks to display
    const toggleUpdatePlaylistTracks = () => {
        setUpdatePlaylistTracks((prev) => !prev);
    };

    return (
        <div id="display-tracks">
            <DisplayTracksPlaylistHeader toggleUpdateLeft={props.toggleUpdateLeft} changeRightDisplay={props.changeRightDisplay} listId={props.listId}/>
            <div id="display-tracks-container">
                <div id="display-tracks-table-header-privateplaylist">
                    <span></span>
                    <span>Youtube Search</span>
                    <span>Track</span>
                    <span>Artist</span>
                </div>
                {
                    tracks.map((track) => { 
                        return (
                            <Track toggleUpdatePlaylistTracks={toggleUpdatePlaylistTracks} fromPrivatePlaylists={true} listId={props.listId} key={track.track_id} track={track}/>
                        )
                    })
                }
            </div>
        </div>
    );
}