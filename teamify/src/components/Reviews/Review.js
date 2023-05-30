import React, {useState} from 'react';
import '../Playlists/Playlists.css';
import './Reviews.css';
import ReviewAdminForm from '../Admin/ReviewAdminForm';
import DisputeOrReportReviewForm from './DisputeOrReportReviewForm';

// Display a review and it's information (who made it, value and description and ability to hide a review if user is admin)
export default function Review(props){
    const [adminEdit, setAdminEdit] = useState(false); // flag if the admin edited the review
    const [displayDisputeForm, setDisplayDisputeForm] = useState(false); // flag for displaying a dispute message
    const [displayReportForm, setDisplayReportForm] = useState(false);

    // toggle the flag the admin edited the review
    const toggleAdminEdit = () => {
        setAdminEdit((prev) => !prev);
    }
    
    // event handler to display a message to user that their review has been reported. Offer option to dispute
    const errorClickHandler = (e) => {
        setDisplayDisputeForm(true);
    }

    // change the display dispute form to false and update the review when the dispute form is submitted
    const handleDisputeSubmit = (reasoning) => {
        // Creating the request body object
        let updateReviewObj = {
            review_id: props.review.review_id,
            dispute_message: reasoning
        }
        // PUT request to update the review in the DB with new dispute message and logging date of request
        fetch('/api/secure/reviews', {
            method: 'PUT',
            body: JSON.stringify(updateReviewObj),
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setDisplayDisputeForm(false);
            // trigger the DisplayUsersReviews useEffect to re-render and update reviews fields to reflect submission
            props.toggleUpdateReviews(); 
        }).catch(error => {
            console.log(error)
        });
    };

    // handle when the report button is clicked for a review
    const handleReportClick = (e) => {
        setDisplayReportForm(true);
    };

    // change the display report form to false and update the review when the report form is submitted
    const handleReportSubmit = (reasoning) => {
        // Creating the request body object
        let updateReviewObj = {
            review_id: props.review.review_id,
            report_message: reasoning
        }
        // PUT request to update the review in the DB with new report message and logging date of request
        fetch('/api/open/reviews', {
            method: 'PUT',
            body: JSON.stringify(updateReviewObj),
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setDisplayReportForm(false);
            // trigger the DisplayUsersReviews useEffect to re-render and update reviews fields to reflect submission
            props.toggleUpdateReviews(); 
        }).catch(error => {
            console.log(error)
        });
    };

    return (
        <div className="review">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
        { !props.isAdmin && !props.fromDisplayUsersReviews &&
            <div className="review-not-admin">
                <div><span>User: </span>{props.review.user_name}</div>
                <div><span>Rating: </span>{String(props.review.rating) + "/5"}</div>
                <div><span>Comment: </span>{props.review.comment}</div>
                {!displayReportForm && <div><span className="material-symbols-outlined" onClick={handleReportClick}>report</span></div> }
                {displayReportForm &&  <DisputeOrReportReviewForm type="report" handleReportSubmit={handleReportSubmit}/>}
            </div>
        }
        { props.fromDisplayUsersReviews && 
            <div className="review-not-admin-from-displayusersreviews">
                <div><span>Rating: </span>{String(props.review.rating) + "/5"}</div>
                <div><span>Comment: </span>{props.review.comment}</div>
                { props.review.date_notice_sent && !props.review.date_dispute_received && !displayDisputeForm &&
                    <div><span className="material-symbols-outlined error-icon" onClick={errorClickHandler}>notification_important</span></div>
                }
                { displayDisputeForm &&
                    <DisputeOrReportReviewForm type="dispute" handleDisputeSubmit={handleDisputeSubmit} />
                }
                { props.review.date_notice_sent && props.review.date_dispute_received && !displayDisputeForm &&
                    <div><span className="material-symbols-outlined error-icon">exclamation</span></div>
                }
            </div>
        }
        { props.isAdmin === 1 &&
            <div className="review-admin">
                <div><span>User: </span>{props.review.user_name}</div>
                <div><span>Rating: </span>{String(props.review.rating) + "/5"}</div>
                <div><span>Comment: </span>{props.review.comment}</div>
                { adminEdit && <ReviewAdminForm reviewId={props.review.review_id} hidden={props.review.hidden} active={props.review.isActive} userId={props.review.user_id} toggleAdminUpdated={props.toggleAdminUpdated} toggleAdminEdit={toggleAdminEdit}/> }
                { !adminEdit &&  
                    <div className='admin-review'>
                        <div><span>Visibility: </span>{props.review.hidden === 0 ? "Not Hidden" : "Hidden"}</div>
                        <div><span className="material-symbols-outlined" onClick={toggleAdminEdit}>edit</span></div>
                    </div>
                }
            </div>
        }
        </div>
    );
}