import React, {useState, useEffect} from 'react';
import Review from './Review';
import './Reviews.css';

export default function DisplayUsersReviews(props){
    const [reviews, setReviews] = useState([]); // reviews made by the user
    const [updateReviews, setUpdateReviews] = useState(false); // trigger for re-rendering the useEffect when dispute is submitted

    // Get all reviews made by the user
    useEffect(() => {
        fetch(`/api/secure/reviews/${props.userId}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setReviews(data); //set the users State
        }).catch(error => {
            console.log(error)
        });
    },[props.userId, updateReviews])

    // Refresh the reviews fields by triggering the useEffect to re-render
    const toggleUpdateReviews = () => {
        setUpdateReviews((prev) => !prev);
    };

    return (
        <div id="display-users-reviews-container">
            <h2>Your Reviews</h2>
            <div id="users-reviews-header">
                <div><span className="material-symbols-outlined error-icon">notification_important</span> = This review has been flagged. Click the icon next to the review to submit a dispute.</div>
                <div><span className="material-symbols-outlined error-icon">exclamation</span> = Dispute request has been sent and is currently under review</div>
            </div>
            {
                reviews.map((review) => {
                    return (
                        <Review key={review.review_id} toggleUpdateReviews={toggleUpdateReviews} review={review} fromDisplayUsersReviews={true}/>
                    )
                })
            }
        </div>
    );
}