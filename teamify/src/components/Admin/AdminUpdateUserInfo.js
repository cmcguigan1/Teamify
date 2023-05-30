import React, {useState, useEffect} from 'react';
import './Admin.css';
import User from './User';

export default function AdminUpdateUserInfo(props){
    const [users, setUsers] = useState([]); //all users in the database
    const [updated, setUpdated] = useState(false); //check for if a user has been updated

    // Get the basic info for all users in the database. Listens for changes to "update" 's state
    useEffect(() => {
        fetch(`/api/admin/users`)
        .then((res) => {
            if(res.ok){
                return res.json();
            }
            throw new Error("Request Failed")
        }, networkError => console.log(networkError.message)
        ).then((data) => {
            setUsers(data); //set the users State
        }).catch(error => {
            console.log(error)
        });
    }, [updated]);

    // update the updated state to trigger the useEffect to reload users 
    const toggleUpdated = () => {
        setUpdated((prev) => !prev);
    };

    
    return (
        <div id="list-of-users">
            <h2>Users</h2>
            <div id="list-of-users-header">
                <span>Name</span>
                <span>Email</span>
                <span>Deactivated</span>
                <span>Admin</span>
            </div>
            {
                users.map((user) => {
                    return (
                        <User toggleUpdated={toggleUpdated} key={user.user_id} user={user}/>
                    )
                })
            }
        </div>
    );
}