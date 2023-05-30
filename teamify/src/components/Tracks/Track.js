import React, { useEffect, useState } from 'react';
import './Tracks.css';


export default function Track(props) {
    // All information about a track
    const [title, setTitle] = useState(props.track.track_title);
    const [artist, setArtist] = useState(props.track.artist_name);
    const [album, setAlbum] = useState(props.track.album_title);
    const [trackDateCreated, setTrackDateCreated] = useState(props.track.track_date_created);
    const [trackDateRecorded, setTrackDateRecorded] = useState(props.track.track_date_recorded);
    const [trackDuration, setTrackDuration] = useState(props.track.track_duration);
    const [trackNumber, setTrackNumber] = useState(props.track.track_number);
    const [trackGenres, setTrackGenres] = useState(props.track.track_genres);
    const [displayAllInfo, setDisplayAllInfo] = useState(false);

    // Toggle to display all additional info on a track when clicked
    const handleClick = (e) => {
        setDisplayAllInfo((prev) => !prev);
    };

    // Open a new browser tab with a youtube search of track title and artist
    const youtubeSearch = (e) => {
        window.open("https://www.youtube.com/results?search_query=" + title + "+" + artist);
    };

    // adding a track to a playlist event handler
    const addTracksToListClick = (e) => {
        props.changePendingTracks(props.track.track_id);
    }

    // deleting a track from a private playlist
    const removeFromPlaylistClick = () => {
        if(!window.confirm("Are you sure you want to delete this track?")){
            return;
        }
        // DELETE fetch call to delete the track from the list
        fetch(`/api/secure/playlists/deleteTrack/${props.listId}/${props.track.track_id}`, {
            method: 'DELETE'
        })
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            // update the list of tracks in the private playlist (trigger parent's useEffect)
            props.toggleUpdatePlaylistTracks();
        }).catch(error => {
            console.log(error)
        });
    };

    return (
        <div className="track">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            { props.fromSearchBox && props.userId &&
                <div onClick={handleClick} className="track-basic-info-searchBox">
                    <span><span onClick={addTracksToListClick} className="material-symbols-outlined">add</span></span>
                    <span><span onClick={youtubeSearch} className="material-symbols-outlined">smart_display</span></span>
                    <span>{title}</span>
                    <span className="artist-basic-info">{artist}</span>
                </div>
            }
            { props.fromSearchBox && !props.userId &&
                <div onClick={handleClick} className="track-basic-info">
                    <span><span onClick={youtubeSearch} className="material-symbols-outlined">smart_display</span></span>
                    <span>{title}</span>
                    <span className="artist-basic-info">{artist}</span>
                </div>
            }
            { !props.fromSearchBox && props.fromPrivatePlaylists && 
                <div onClick={handleClick} className="track-basic-info-privateplaylist">
                    <span><span onClick={removeFromPlaylistClick} className="material-symbols-outlined">delete</span></span>
                    <span><span onClick={youtubeSearch} className="material-symbols-outlined">smart_display</span></span>
                    <span>{title}</span>
                    <span className="artist-basic-info">{artist}</span>
                </div>
            }
            { !props.fromSearchBox && !props.fromPrivatePlaylists &&
                <div onClick={handleClick} className="track-basic-info">
                    <span><span onClick={youtubeSearch} className="material-symbols-outlined">smart_display</span></span>
                    <span>{title}</span>
                    <span className="artist-basic-info">{artist}</span>
                </div>
            }
            { displayAllInfo &&
            <div className="track-additional-info">
                <div><span>Album: </span>{album}</div>
                <div><span>Track Date Created: </span>{trackDateCreated}</div>
                <div><span>Track Date Recorded: </span>{trackDateRecorded}</div>
                <div><span>Track Duration: </span>{String(trackDuration).replace(".",":")}</div>
                <div><span>Track Number: </span>{trackNumber}</div>
                <div><span>Track Genres: </span>{trackGenres}</div>
            </div>
            }
        </div>
    );
}