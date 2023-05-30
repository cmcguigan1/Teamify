import React, {useState, useEffect} from 'react';
import '../Playlists/Playlists.css';

export default function AddRatingButton(props){
    const [addingRating, setAddingRating] = useState(false); // flag if rating is being added
    const [rating, setRating] = useState(0.0); // rating input field value
    const [comment, setComment] = useState(""); // comment input field value

    // Event handlers for inputs when creating a rating
    const onClick = (e) => {
        setAddingRating(true);
    };

    const onRatingChange = (e) => {
        setRating(e.target.value);
    }
    const onCommentChange = (e) => {
        setComment(e.target.value);
    }
    
    const onSubmit = (e) => {
        // Client side input validation
        if(!comment || !rating){
            e.preventDefault();
        }
        let noWeirdCharacters = /^[^<>;:*]*$/.test(comment);
        if(!noWeirdCharacters || comment.length > 255){
            alert("Comment contains invalid characters or is longer than 255 characters");
            return;
        }
        if(rating < 0 || rating > 5){
            alert("Rating must be between 0 and 5");
            return;
        }

        if(!window.confirm("Are you sure you want to add this review?")){
            return;
        }

        // creating a new rating object
        let newRating = {
            list_id: props.listId,
            rating: rating,
            comment: comment
        }

        // POSTing the new review object to the database
        fetch(`/api/secure/reviews/${props.userId}`, {
            method: 'POST',
            body: JSON.stringify(newRating),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setAddingRating(false); // Toggle the adding a new rating flag
            e.preventDefault();
        }).catch(error => {
            console.log(error)
        });
        
    };

    return (
        <div id="adding-rating-container">
            { addingRating && 
                <div>
                    <label>Rating: </label>
                    <input onChange={onRatingChange} type="number" step="0.1" min="0" max="5" name="rating" required/>
                    <label>Comment: </label>
                    <input onChange={onCommentChange} type="text" maxLength="255" name="comment" required/>
                    <button type="button" onClick={onSubmit}>Save</button>
                </div>
            }
            { !addingRating && <button onClick={onClick} type="button" id="add-rating-btn">Add Rating</button> }
        </div>
    )
}