import React, {useState, useEffect} from 'react';
import './Admin.css';
import '../Reviews/Reviews.css';
import ReviewAdminForm from './ReviewAdminForm';

export default function ReviewAdminView(props){
    const [adminEdit, setAdminEdit] = useState(false); // flag if the admin edited the review

    // toggle the flag the admin edited the review
    const toggleAdminEdit = () => {
        setAdminEdit((prev) => !prev);
    }

    // send a notice for a request
    const handleSendNoticeClick = () => {
        // creating the object to send
        let obj = {
            review_id: props.review.review_id
        };

        // PUT request to update the database
        fetch(`/api/open/sendNotice/reviews`, {
            method: 'PUT',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            props.toggleAdminUpdated();
        }).catch(error => {
            console.log(error)
        });
    };
    

    return (
        <div className={props.type === "all" ? "all-grid" : props.type === "requests" ? "requests-grid" : props.type === "notices" ? "notices-grid" : "disputes-grid"}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
            <div>{props.review.user_name}</div>
            <div>{props.review.rating}</div>
            <div>{props.review.comment}</div>
            { props.type === "requests" && <div>{(props.review.date_request_received)}</div> }
            { props.type === "requests" && <div>{props.review.report_message}</div> }      
            { props.type === "requests" && props.review.date_notice_sent && <div>{(props.review.date_notice_sent)}</div> }
            { props.type === "requests" && !props.review.date_notice_sent && <button type="button" className="send-notice-btn" onClick={handleSendNoticeClick}>Send Notice</button> }
            { props.type === "notices" && <div>{props.review.date_notice_sent}</div> }
            { props.type === "disputes" && <div>{props.review.date_request_received}</div> }
            { props.type === "disputes" && <div>{props.review.report_message}</div> }
            { adminEdit && <ReviewAdminForm reviewId={props.review.review_id} hidden={props.review.hidden} active={props.review.isActive} userId={props.review.user_id} toggleAdminUpdated={props.toggleAdminUpdated} toggleAdminEdit={toggleAdminEdit}/> }
            { !adminEdit &&  
                <div className='admin-review'>
                    <div>{props.review.hidden === 0 ? "Not Hidden" : "Hidden"}</div>
                    <div><span className="material-symbols-outlined" onClick={toggleAdminEdit}>edit</span></div>
                </div>
            }
        </div>
    );
}