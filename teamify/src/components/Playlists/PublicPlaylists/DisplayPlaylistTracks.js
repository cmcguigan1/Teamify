import React, { useEffect, useState } from 'react';
import '../Playlists.css';
import '../../Tracks/Tracks.css';
import Track from '../../Tracks/Track';
import AddRatingButton from '../../Reviews/AddRatingButton';

// Displays underneath the public playlist when it is clicked, displays tracks and info on public playlist
export default function DisplayPlaylistTracks(props) {
    const [description, setDescription] = useState(""); // description of the playlist
    const [listOfTracks, setListOfTracks] = useState([]); // list of tracks in the plyalist
    
    // Get the playlist's tracks and setting the states
    useEffect(() => {
        fetch(`/api/open/playlists/${props.listId}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setDescription(data[0].list_description);
            setListOfTracks(data);
        }).catch(error => {
            console.log(error)
        });
    }, []);

    return (
        <div className="playlist-tracks">
            <div className="playlist-header public-playlist-header">
                <div>{description}</div>
                {props.userId && <AddRatingButton userId={props.userId} listId={props.listId}/>}
            </div>
            <div id="display-tracks-container">
                <div id="display-tracks-table-header">
                    <span>Youtube Search</span>
                    <span>Track</span>
                    <span>Artist</span>
                </div>
                {
                    listOfTracks.map((track) => {
                        return (
                            <Track key={track.track_id} track={track}/>
                        )
                    })
                }
            </div>
        </div>
    );
}