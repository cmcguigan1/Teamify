import React, { useEffect, useState } from 'react';
import '../Playlists.css';
import DisplayPlaylistTracks from './DisplayPlaylistTracks';
import DisplayReviews from '../../Reviews/DisplayReviews';

export default function PublicPlaylist(props) {
    // Fields about the playlist
    const [name, setName] = useState("");
    const [creator, setCreator] = useState("");
    const [totalPlayTime, setTotalPlayTime] = useState(0.0);
    const [numberOfTracks, setNumberOfTracks] = useState(0);
    const [averageRating, setAverageRating] = useState(0.0);
    const [lastModified, setLastModified] = useState(null);
    const [displayTracks, setDisplayTracks] = useState(false);

    // Get specific details about the playlist
    useEffect(() => {
        fetch(`/api/open/playlistDetails/specific/${props.id}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setName(data[0].list_name);
            setCreator(data[0].user_name);
            setTotalPlayTime(data[0].duration.toFixed(2));
            setNumberOfTracks(data[0].numOftracks);
            setAverageRating(data[0].averageRating);
            setLastModified(data[0].last_modified);
        }).catch(error => {
            console.log(error)
        });
    }, []);

    // Event handler to display tracks and additional info about playlist when public playlist is clicked
    const handleClick = (e) => {
        setDisplayTracks((prev) => !prev);
    };

    return (
        <div className="public-playlist">
            <div className="public-playlist-details" onClick={handleClick}>
                <div><span className="bold">Name: </span>{name}</div>
                <div><span className="bold">Creator: </span>{creator}</div>
                <div><span className="bold">Playtime: </span>{totalPlayTime}</div>
                <div><span className="bold"># Tracks: </span>{numberOfTracks}</div>
                <div><span className="bold">Rating: </span>{averageRating ? String(averageRating) + "/5" : 'None'}</div>
                <div><span className="bold">Last Modified: </span>{lastModified}</div>
            </div>
            {displayTracks &&
                <div>
                    <DisplayPlaylistTracks userId={props.userId} listId={props.id}/>
                    <DisplayReviews isAdmin={props.isAdmin} listId={props.id} />
                </div>
            }
            
        </div>
    );
    
}