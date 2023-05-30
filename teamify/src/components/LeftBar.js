import React, { useEffect, useState } from 'react';
import '../App.css';
import PrivatePlaylistContainer from './Playlists/PrivatePlaylists/PrivatePlaylistContainer';
import DisplayPublicPlaylistsButton from './Playlists/PublicPlaylists/DisplayPublicPlaylistsButton';
import DisplaySearchBoxButton from './SearchBox/DisplaySearchBoxButton';
import DisplayAdminPageButton from './Admin/DisplayAdminPageButton';
import AddToPlaylsitForm from './Playlists/PrivatePlaylists/AddToPlaylistForm';
import DisplayUsersReviewsButton from './Reviews/DisplayUsersReviewsButton';

// Larger parent component to manage display on left side
export default function LeftBar(props){

    return (
        <div id="left-bar">
            {props.userId && <PrivatePlaylistContainer updateLeft={props.updateLeft} changeRightDisplay={props.changeRightDisplay} userId={props.userId}/>}
            {props.pendingTracks.length != 0 && <AddToPlaylsitForm pendingTracks={props.pendingTracks} changePendingTracks={props.changePendingTracks} userId={props.userId}/>}
            <div>
                {props.userId && <DisplayUsersReviewsButton changeRightDisplay={props.changeRightDisplay}/>}
                <DisplayPublicPlaylistsButton changeRightDisplay={props.changeRightDisplay}/>
                <DisplaySearchBoxButton changeRightDisplay={props.changeRightDisplay} />
                {props.isAdmin === 1 && <DisplayAdminPageButton changeRightDisplay={props.changeRightDisplay} />}
            </div>
        </div>
    );
}