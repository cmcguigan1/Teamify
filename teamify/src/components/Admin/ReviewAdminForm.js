import React, {useState, useEffect} from 'react';
import './Admin.css';

// Form for hidding/unhidding a review on a public playlist or activating/deactivating the user that made the review
export default function ReviewAdminForm(props){
    const [deactivated, setDeactivated] = useState(props.active); //if the user is deactivated or not
    const [hidden, setHidden] = useState(props.hidden); //if the user's review is hidden or not

    // Update a review or user's credentials 
    const handleSubmit = (e) => {

        //getting the value of both radio buttons sets
        let active = e.target.elements.user.value;
        let hidden = e.target.elements.review.value;

        // Creating the review object with id and value of hidden (either 0 or 1)
        let reviewData = {
            review_id: props.reviewId,
            hidden: hidden
        }
        // Creating the user object with id and value of admin (either 0 or 1)
        let userData = {
            user_id: props.userId,
            isActive: active
        }

        // Checks if the activity of user is different from when component was first rendered, update the DB if so
        if(active != props.active){
            fetch(`/api/admin/users`, {
                method: 'PUT',
                body: JSON.stringify(userData),
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => {
                if(res.ok){
                    return res.json();
                }
                throw new Error("Request Failed")
            }, networkError => console.log(networkError.message)
            ).then((data) => {
                
            }).catch(error => {
                console.log(error)
            });
        }
        // Checks if the hidden field of review is different from when component was first rendered, update the DB if so
        if(hidden != props.hidden){
            fetch(`/api/admin/reviews`, {
                method: 'PUT',
                body: JSON.stringify(reviewData),
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => {
                if(res.ok){
                    return res.json();
                }
                throw new Error("Request Failed")
            }, networkError => console.log(networkError.message)
            ).then((data) => {
                
            }).catch(error => {
                console.log(error)
            });
        }
        props.toggleAdminEdit(); // update the adminEdit field in Review component to remove ReviewAdminForm component
        props.toggleAdminUpdated(); // update the adminUpdate state in DisplayReviews component
        e.preventDefault(); //stop form submission
    }

    // if statements ensure the radio buttons are selected by default if the user is deactivated or is admin
    return (
        <form className="admin-review-form" onSubmit={handleSubmit}>
            { props.active == 0 ?
                <div>
                    <label>Active</label>
                    <input type="radio" name="user" value="0" defaultChecked/>
                    <label>Deactivate</label>
                    <input type="radio" name="user" value="1"/>
                </div>
                :
                <div>
                    <label>Active</label>
                    <input type="radio" name="user" value="0"/>
                    <label>Deactivate</label>
                    <input type="radio" name="user" value="1" defaultChecked/>
                </div>
            }
            { props.hidden == 0 ?
                <div>
                    <label>Hidden</label>
                    <input type="radio" name="review" value="1"/>
                    <label>Not Hidden</label>
                    <input type="radio" name="review" value="0" defaultChecked/>
                </div>
                :
                <div>
                    <label>Hidden</label>
                    <input type="radio" name="review" value="1" defaultChecked/>
                    <label>Not Hidden</label>
                    <input type="radio" name="review" value="0"/>
                </div>
            }
            <button type="submit" className='save-admin-changes-btn'><span className="material-symbols-outlined">save</span></button>
        </form>
    );
}