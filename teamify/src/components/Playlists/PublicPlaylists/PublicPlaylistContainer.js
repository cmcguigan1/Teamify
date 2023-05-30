import { propNames } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import '../Playlists.css';
import PublicPlaylist from './PublicPlaylist';

export default function PublicPlaylistContainer(props){
    const [listOfTopTen, setListOfTopTen] = useState([]); // list of 10 most recently modified playlists

    // Getting to 10 most recetnly modified playlsits
    useEffect(() => {
        fetch(`/api/open/playlists`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            let listOfIds = []
            for(let playlist of data){
                listOfIds.push(playlist.list_id);
            }
            setListOfTopTen(listOfIds);
        }).catch(error => {
            console.log(error)
        });
    }, []);

    return (
        <div>
            <div id="public-playlists-header">Top 10 Public Playlists</div>
            <div id="public-playlists-results">
                {
                    listOfTopTen.map((listId) => { 
                        return (
                            <PublicPlaylist isAdmin={props.isAdmin} userId={props.userId} key={listId} id={listId}/>
                        )
                    })
                }
            </div>
        </div>
    );
}