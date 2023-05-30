//import React, {useRef} from 'react'
import { Input, InputGroup, InputAddon, Text, Button} from '@chakra-ui/react';
import {Flex} from '@chakra-ui/react';
import DisplayPolicyBtn from '../PrivacyPolicy/displayprivacypolicy';
import { AtSignIcon, EmailIcon, LockIcon, WarningIcon, ArrowForwardIcon, ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';

//firebase imports
import React, { useEffect, useState } from "react";
import { auth, logInWithEmailAndPassword, registerWithEmailAndPassword, signInWithGoogle, sendPasswordReset, logout, sendEmailVerif} from "../../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";





function SignInPage(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);


    const register = () => {
        // Client side input validation
        let passed = true;
        let noWeirdCharacters_name = /^[^<>;:*]*$/.test(name);
        let noWeirdCharacters_email = /^[^<>;:*]*$/.test(email);
        console.log(noWeirdCharacters_email);
        console.log(noWeirdCharacters_name);
        if(!name){
            alert("Please enter name");
            passed = false;
        }
        else if(!email){
            alert("Please enter an email");
            passed = false;
        }
        else if(!password){
            alert("Please enter a password");
            passed = false;
        }
        else if(email.length > 100|| name > 100 || password.length < 6){
            alert("Email and username cannot be longer than 100 characters. Password must be at least 6 characters");
            passed = false;
        }
        else if(!noWeirdCharacters_name || !noWeirdCharacters_email){
            alert("Email and username contains invlaid characters");
            passed = false;
        }

        // register the email, username and password
        if(passed){
            let newUser = {
                user_name: name,
                user_email: email,
            }
           

            // Add the user to our mySQL DB (minus the password)
            fetch(`/api/open/users`, {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => {
                if(res.ok){
                    return res.json();
                }
                throw new Error("Request Failed")
            }, networkError => console.log(networkError.message)
            ).then((data) => {
                props.signedInEmail(email);
                props.toggleLoggingIn(false);
            }).catch(error => {
                console.log(error)
            });
        }
      };
    
    
   useEffect(() => {
        if (loading) {
          return;
        }
        if (user){
            props.signedInEmail(user.email); // Update email state in App.js
            props.toggleLoggingIn(false); // Update the logginIn state to remove the login form component
        }
      }, [user, loading]); 




      //displays the login page with functional buttons and input forms
    return(
        
        <div className="signIn">
            <Flex className='login_container'
            bg='#000000' w='100%' h='100vh' display='flex' direction='column' justify='center' align='center'>
                <Text color="#828282" fontSize="20" margin='2px 6px'>
                Welcome to Teamify, the internet’s braziest music streaming platform. Make playlists for your favourite songs, search through thousands of tracks, see what others are listening to with the top 10 public playlists and leave your own ratings and comments on them! Happy Streaming!
                </Text>
                <InputGroup justifyContent={'center'}>
                    <InputAddon 
                    pointerEvents={"none"}
                    children={<AtSignIcon color='lime'/>}/>
                <Input h='25px' w="250px" bg="#828282" justifyContent='center' _hover={{background: 'lime'}}
                    placeholder="enter username"
                    _placeholder={{color: 'black'}}
                    type="text"
                    className="register__textBox"
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
            </InputGroup>
            <InputGroup justifyContent={'center'}>
                    <InputAddon  
                    pointerEvents={"none"}
                    children={<EmailIcon color='lime'/>}/>
                <Input h='25px' w="250px" bg="#828282" justifyContent='center' _hover={{background: 'lime'}}
                    placeholder="enter email"
                    _placeholder={{color: 'black'}}
                    type="text"
                    className="login_textBox"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
            </InputGroup>
            <InputGroup justifyContent={'center'}>
                <InputAddon  
                    pointerEvents={"none"}
                    children={<LockIcon color='lime'/>}/>
                <Input h='25px' w="250px" bg="#828282" justifyContent='center' _hover={{background: 'lime'}}
                    placeholder="enter password"
                    _placeholder={{color: 'black'}}
                    type="password"
                    className="login_textBox"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
            </InputGroup>

            <Flex direction='row' justify="space-between" w="250px" marginLeft="20px">
            <Button bg='#828282'w='150px' h='20px' fontSize="12px" marginTop={"10"} _hover={{background: 'lime'}} leftIcon={<ArrowForwardIcon/>}
                className="login_btn"
                onClick={() => logInWithEmailAndPassword(email, password)}>login</Button>
            
            <Button bg='#828282' w='150px' h='20px' fontSize="12px" marginTop={"10"}  _hover={{background: 'lime'}} leftIcon={<ArrowForwardIcon/>}
                className="login__btn login__google" onClick={signInWithGoogle}>
                login with Google</Button>
                </Flex>

            <Button bg='#828282' fontSize="12px" marginTop={"10"} _hover={{background: 'lime'}} leftIcon={<CheckIcon/>}
                className="register__btn"
                onClick={register}>sign up</Button>


            <Button bg='#828282'  fontSize="12px" marginTop={"10"} _hover={{background: 'lime'}} leftIcon={<WarningIcon/>}
                className="reset__btn" onClick={() => sendPasswordReset(email)}>
                forgot password</Button>


            </Flex>
            <Flex bg='#000000'>
                <DisplayPolicyBtn></DisplayPolicyBtn>
                
            </Flex>
        </div>
        ); 
}


export default SignInPage;


   