import React, {useState, useEffect} from 'react';
import './Admin.css';
import ReviewAdminView from './ReviewAdminView';
import ReviewAdminViewHeader from './ReviewAdminViewHeader';

export default function AdminUpdateReviews(){
    const [reviews, setReviews] = useState([]); // all reviews in the database
    const [selectedBtn, setSelectedBtn] = useState("all"); // filter btn selected
    const [adminUpdated, setAdminUpdated] = useState(false); // field to check if the admin updated a review's value's

    // Get the reviews based on a filter specified by the selectedBtn state
    useEffect(() => {
        fetch(`/api/admin/filterReviews/${selectedBtn}`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setReviews(data); //set the reviews State
        }).catch(error => {
            console.log(error)
        });
    }, [selectedBtn, adminUpdated]);

    // Used to trigger the useEffect to execute again and refresh the lsit of reviews for when a review is edited by the admin
    const toggleAdminUpdated = () => {
        setAdminUpdated((prev) => !prev);
    };

    // Handle when one of the filter buttons is clicked
    const handleFilterButtonClick = (e) => {
        if(e.target.id === "pending-requests-btn"){
            setSelectedBtn("requests");
        }
        else if(e.target.id === "pending-notices-btn"){
            setSelectedBtn("notices");
        }   
        else if(e.target.id === "pending-disputes-btn"){
            setSelectedBtn("disputes");
        }
        else {
            setSelectedBtn("all");
        }
    };

    return (
        <div id="admin-reviews">
            <h2>Reviews</h2>
            <div id="filter-reviews-btns">
                <button type="button" className="filter-reviews-btn" id="all-reviews-btn" onClick={handleFilterButtonClick}>View All Reviews</button>
                <button type="button" className="filter-reviews-btn" id="pending-requests-btn" onClick={handleFilterButtonClick}>Pending Requests Reviews</button>
                <button type="button" className="filter-reviews-btn" id="pending-notices-btn"onClick={handleFilterButtonClick}>Pending Notices Reviews</button>
                <button type="button" className="filter-reviews-btn" id="pending-disputes-btn" onClick={handleFilterButtonClick}>Pending Disputes Reviews</button>
            </div>
            <ReviewAdminViewHeader type={selectedBtn} />
            <div id="admin-view-review-results">
            {
                reviews.map((review) => {
                    return (
                        <ReviewAdminView key={review.review_id} type={selectedBtn} review={review} toggleAdminUpdated={toggleAdminUpdated} isAdmin={1}/>
                    )
                })
            }
            </div>
        </div>
    );
}