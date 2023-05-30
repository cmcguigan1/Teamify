import React from 'react';
import {useState, useEffect} from 'react';
import { Button, Text } from '@chakra-ui/react'
import {LinkIcon} from '@chakra-ui/icons'
//import the policy element documents
import PrivacyPolicyAdmin from './TeamifyPrivacyPolicy.docx'
import DMCAPolicyAdmin from './TeamifyDMCAPolicy.docx'
import AUPAdmin from './TeamifyAUP.docx'

//method to implement buttons that display the pdfs in seperate windows when clicked
//these buttosn are only available on the admin page (admin view only alllows for editable docs)
const DisplayPolicyBtnAdmin = ({label, handleClick}) => {
    const [input, setInput] = useState("");
//method to open privacypolicy in new window
    const handleSubmitPrivacy = e => {
        e.preventDefault();
        window.open(PrivacyPolicyAdmin);
    };
//method to open dmca policy in new window
    const handleSubmitDMCA = e => {
        e.preventDefault();
        window.open(DMCAPolicyAdmin);
    };
//method to open aup in new window
    const handleSubmitAUP = e => {
        e.preventDefault();
        window.open(AUPAdmin);
    };
  
    return (
    <div>
        <Button bg='#828282' w='160px' h='20px' leftIcon={<LinkIcon/>} _hover={{background: 'lime'}} marginLeft='5px' marginBottom='30px'
        className = "privacypolicyBtn"
        onClick={handleSubmitPrivacy}
        type="submit">
           <Text fontSize="12px">Privacy Policy</Text>
        </Button>

        <Button bg='#828282' w='160px' h='20px' leftIcon={<LinkIcon/>} _hover={{background: 'lime'}} marginRight='5px' marginBottom='30px'
        className = "dmcaBtn"
        onClick={handleSubmitDMCA}
        type="submit">
           <Text fontSize="12px">DMCA protocol</Text>
        </Button>

        <Button bg='#828282' w='160px' h='20px' leftIcon={<LinkIcon/>} _hover={{background: 'lime'}} marginRight='5px' marginBottom='30px'
        className = "AUPBtn"
        onClick={handleSubmitAUP}
        type="submit">
           <Text fontSize="12px">Acceptable Use Policy</Text>
        </Button>
   
    </div>
    );
};


export default DisplayPolicyBtnAdmin;