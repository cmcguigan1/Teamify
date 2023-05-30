import React, {useState, useEffect} from 'react';
import './Admin.css';

// Component header for the table 
export default function ReviewAdminViewHeader(props){
    // return a header with values based on what reviews are being displayed (which filter is clicked)
    return (
        <div id="admin-review-headers">
            { props.type === "all" &&
                <div className="all-grid">
                    <span>User</span>
                    <span>Rating</span>
                    <span>Comment</span>
                    <span>Visibility</span>
                </div>
            }   
            { props.type === "requests" &&
                <div className='requests-grid'>
                    <span>User</span>
                    <span>Rating</span>
                    <span>Comment</span>
                    <span>Date Request Recieved</span>
                    <span>Request Message</span>
                    <span>Date Notice Sent</span>
                    <span>Visibility</span>
                </div>
            }
            { props.type === "notices" &&
                <div className='notices-grid'>
                    <span>User</span>
                    <span>Rating</span>
                    <span>Comment</span>
                    <span>Date Notice Sent</span>
                    <span>Visibility</span>
                </div>
            }
            { props.type === "disputes" &&
                <div className='disputes-grid'>
                    <span>User</span>
                    <span>Rating</span>
                    <span>Comment</span>
                    <span>Date Dispute Recieved</span>
                    <span>Dispute Message</span>
                    <span>Visibility</span>
                </div>
            }
        </div>
    );
}