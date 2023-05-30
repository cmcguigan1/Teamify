import React, { useEffect, useState } from 'react';
import '../App.css';
import PublicPlaylistContainer from './Playlists/PublicPlaylists/PublicPlaylistContainer';
import DisplayTracks from './Tracks/DisplayTracks';
import DisplaySearchBoxContainer from './SearchBox/DisplaySearchBoxContainer';
import DisplayAdmin from './Admin/DisplayAdmin';
import DisplayUsersReviews from './Reviews/DisplayUsersReviews';

// Parent component to manage what is displayed on right side
export default function RightSide(props){

    return (
        <div id="right-side">
            {
                props.changeDisplayTo.type === "PublicPlaylists" &&
                <PublicPlaylistContainer isAdmin={props.isAdmin} userId={props.userId}/>
            }
            {
                props.changeDisplayTo.type === "PrivatePlaylist" &&
                <DisplayTracks toggleUpdateLeft={props.toggleUpdateLeft} listId={props.changeDisplayTo.playlist_id} changeRightDisplay={props.changeRightDisplay}/>
            }
            {
                props.changeDisplayTo.type === "SearchTracks" &&
                <DisplaySearchBoxContainer userId={props.userId} changePendingTracks={props.changePendingTracks}/>
            }
            {
                props.changeDisplayTo.type === "Admin" &&
                <DisplayAdmin />
            }
            {
                props.changeDisplayTo.type === "UsersReviews" &&
                <DisplayUsersReviews userId={props.userId}/>
            }
            {
                props.changeDisplayTo.type === "" || !props.changeDisplayTo.type && 
                <div id="about-blurb">Welcome to Teamify, the internet’s braziest music streaming platform. Make playlists for your favourite songs, search through thousands of tracks, see what others are listening to with the top 10 public playlists and leave your own ratings and comments on them! Happy Streaming!</div>
            }
        </div>
    );
}