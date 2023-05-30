import React, { useEffect, useState } from 'react';
import '../Playlists/Playlists.css';
import Review from './Review';

export default function DisplayReviews(props){
    const [playlistReviews, setPlaylistReviews] = useState([]); // All reviews associated with a playlist
    const [adminUpdated, setAdminUpdated] = useState(false); // field to check if the admin updated a review's value's

    useEffect(() => {
        // If the user is admin then query all the reviews, hidden or not, associated with a public list
        if(props.isAdmin){
            fetch(`/api/admin/reviews/${props.listId}`)
            .then((res) => {
                if(res.ok){
                    return res.json();
                }
                throw new Error("Request Failed")
            }, networkError => console.log(networkError.message)
            ).then((data) => {
                setPlaylistReviews(data);
            }).catch(error => {
                console.log(error)
            });
        }
        // Otherwise only query all the reviews not hidden, associated with a public list
        else{
            fetch(`/api/open/reviews/${props.listId}`)
            .then((res) => {
                if(res.ok){
                    return res.json();
                }
                throw new Error("Request Failed")
            }, networkError => console.log(networkError.message)
            ).then((data) => {
                setPlaylistReviews(data);
            }).catch(error => {
                console.log(error)
            });
        }
    }, [adminUpdated]);

    // Used to trigger the useEffect to execute again and refresh the lsit of reviews for when a review is edited by the admin
    const toggleAdminUpdated = () => {
        setAdminUpdated((prev) => !prev);
    }

    return (
        <div id="public-playlist-reviews">
            <span id="reviews-header">Reviews</span>
            {
                playlistReviews.map((review) => { 
                    return (
                        <Review key={review.review_id} review={review} toggleAdminUpdated={toggleAdminUpdated} isAdmin={props.isAdmin}/>
                    )
                })
            }
        </div>
    );
}