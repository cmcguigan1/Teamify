import React, {useState} from 'react';
import './Reviews.css';

export default function DisputeOrReportReviewForm(props){
    const [reasoning, setReasoning] = useState("");

    const handleInputChange = (e) => {
        setReasoning(e.target.value);
    };

    // Handling the submission of the dispute request
    const handleSubmit = (e) => {
        // Client side input validation
        if(!reasoning){
            alert("Please provide a brief explanation");
            return;
        }
        let noWeirdCharacters = /^[^<>;:*]*$/.test(reasoning);
        if(!noWeirdCharacters){
            alert("Your reasoning contains invalid characters");
            return;
        }

        // Calling the appropriate handle submit function from Review component
        if(props.type === "dispute"){
            props.handleDisputeSubmit(reasoning);
        }
        else{
            props.handleReportSubmit(reasoning);
        }
    };

    return (
        <div className="report-dispute-review-form">
            <input type="text" max="255" onChange={handleInputChange} placeholder="Please provide a brief reasoning for your dispute" required/>
            <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
    );
}