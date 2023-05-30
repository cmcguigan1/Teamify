import React, {useState, useEffect} from 'react';
import './Admin.css';
import AdminUpdateUserInfo from './AdminUpdateUserInfo';

import DisplayPolicyBtnAdmin from '../PrivacyPolicy/displayPoliciesAdmin';
import AdminUpdateReviews from './AdminUpdateReviews';


// Display the admin management page
export default function DisplayAdmin(){
    
    return (
        <div id="admin-page">
            <h2>Admin</h2>
            <AdminUpdateUserInfo />

            <DisplayPolicyBtnAdmin/>
            <AdminUpdateReviews />

        </div>
    );
}