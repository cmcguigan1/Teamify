import React, {useState, useEffect} from 'react';
import './Admin.css';

// Display a user in the user management page
export default function User(props){

    // Used to check to see if a change was made to the user's status: made or removed admin status or activated/deactivated
    const handleChange = (e) => {
        let number = 0;
        let type = "";
        // temp object with user's id
        let updateObject = {
            user_id: props.user.user_id
        };

        // if the checkbox is unchecked then make the number 0
        if(!e.target.checked) {
            number = 0;
        }
        // Otherwise the checkbox was checked and make the number 1
        else{
            number = 1;
        }
        // If the checkbox was the deactivate checkbox, set the type
        if(e.target.name === "isActive") {
            type = "active";
            updateObject["isActive"] = number;
        }
        // If the checkbox was the admin checkbox, set the type
        else{
            type = "admin";
            updateObject["isAdmin"] = number;
        }

        // Query the endpoint based on the type to update the field's of user
        if(type == "active"){
            // Update the user's active or deactivated
            fetch(`/api/admin/users/activity`, {
                method: 'PUT',
                body: JSON.stringify(updateObject),
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => {
                if(res.ok){
                    return res.json();
                }
                throw new Error("Request Failed")
            }, networkError => console.log(networkError.message)
            ).then((data) => {
                props.toggleUpdated();
            }).catch(error => {
                console.log(error)
            });
        }
        // Update the user's admin priviledges (make admin or not)
        else {
            fetch(`/api/admin/users/adminPriviledges`, {
                method: 'PUT',
                body: JSON.stringify(updateObject),
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => {
                if(res.ok){
                    return res.json();
                }
                throw new Error("Request Failed")
            }, networkError => console.log(networkError.message)
            ).then((data) => {
                props.toggleUpdated();
            }).catch(error => {
                console.log(error)
            });
        }
        
    };

    // Checkboxes to either make the user deactivated or not, or admin or not
    return (
        <div className="user">
            <div>{props.user.user_name}</div>
            <div>{props.user.user_email}</div>
            { props.user.isActive === 0 && <input type="checkbox" onChange={handleChange} name="isActive" value="0" />}
            { props.user.isActive === 1 && <input type="checkbox" onChange={handleChange} name="isActive"value="1" defaultChecked/>}
            { props.user.isAdmin === 0 && <input type="checkbox" onChange={handleChange} name="isAdmin"value="0" />}
            { props.user.isAdmin === 1 && <input type="checkbox" onChange={handleChange} name="isAdmin"value="1" defaultChecked/>}
        </div>
    );

}