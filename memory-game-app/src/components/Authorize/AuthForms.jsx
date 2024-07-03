import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import PasswordToggle from '../PasswordToggle';
import { setWithExpiry } from '../../utils/localStorageUtils';
import Header from '../Header';

function AuthForms(){
    // console.log(localStorage.getItem('token'));
    const [errors, setErrors] = useState({});
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLoginForm(!isLoginForm);
        setSuccess('');
    };

    const handleLogin = (token) => {
        setWithExpiry('token', token, 60);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
    
        const formData = {
            username: e.target.username ? e.target.username.value.trim() : '',
            password: e.target.password ? e.target.password.value.trim() : '',
            registerEmail: e.target.registerEmail ? e.target.registerEmail.value.trim() : '',
            registerUsername: e.target.registerUsername ? e.target.registerUsername.value.trim() : '',
            registerPassword: e.target.registerPassword ? e.target.registerPassword.value.trim() : '',
            confirmRegisterPassword: e.target.confirmRegisterPassword ? e.target.confirmRegisterPassword.value.trim() : '',
        };
    
        if (isLoginForm) {
            const validationErrors = {};
    
            const usernameToClear = formData.username;
            const passwordToClear = formData.password;
    
            if (!usernameToClear) {
                validationErrors.loginUsername = 'Username is required';
            }
            if (!passwordToClear) {
                validationErrors.loginPassword = 'Password is required';
            }
    
            setErrors(validationErrors);
    
            if (Object.keys(validationErrors).length === 0) {
                setErrors({});
                // console.log(formData);
                try{
                    const response = await fetch('http://localhost/api/login', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });
                    const responseData = await response.json();
                    if (!response.ok) {
                        console.error('Error:', responseData.error);
                        if (responseData.error === 'Invalid account') {
                            setErrors({ loginUsername: 'Unrecognized username' });
                        } else if (responseData.error === 'Incorrect password') {
                            setErrors({ loginPassword: 'Incorrect password' });
                        }
                    } else {
                        setSuccess('Sucessful login');
                        handleLogin(responseData.token);
                        // console.log(responseData);
                        navigate("/Profile");
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        } else {
            const validationErrors = {};
            const usernameToClear = formData.registerUsername;
            const emailToClear = formData.registerEmail;
            const passwordToClear = formData.registerPassword;
            const regPasswordToClear = formData.confirmRegisterPassword;
    
            if (!emailToClear) {
                validationErrors.registerEmail = 'E-mail is required';
            }

            if (!usernameToClear) {
                validationErrors.registerUsername = 'Username is required';
            } else if (usernameToClear.match(/^[^a-zA-Z0-9]+$/)){
                validationErrors.registerUsername = 'Username cannot contain symbols';
            } else if(usernameToClear.trim().length < 3){
                validationErrors.registerUsername = 'Minimum length is 3 symbols';
            } else if(usernameToClear.trim().length > 15){
                validationErrors.registerUsername = 'Maximum length is 15 symbols';
            }
    
            if (!passwordToClear) {
                validationErrors.registerPassword = 'Password is required';
            } else if (passwordToClear.trim().length < 8){
                validationErrors.registerPassword = 'Minimum length is 8 symbols';
            }
    
            if (!regPasswordToClear) {
                validationErrors.confirmRegisterPassword = 'Confirmation is required';
            } else if (regPasswordToClear !== passwordToClear) {
                validationErrors.confirmRegisterPassword = 'Passwords do not match';
            } else if(regPasswordToClear.trim().length < 8){
                validationErrors.confirmRegisterPassword = 'Minimum length is 8 symbols';
            }
            
            setErrors(validationErrors);
            
            if (Object.keys(validationErrors).length === 0) {
                setErrors({});
                // console.log(formData);
                try{
                    const response = await fetch('http://localhost/api/register', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });
                    const responseData = await response.json();
                    if (!response.ok) {
                        setErrors(responseData.errors);
                        setSuccess('');
                    }else{
                        setSuccess(responseData.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
    };

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    const handleSuccess = async (response) => {
        // console.log('Google Access Token:', response);
        const { credential } = response;
        const jwtData = parseJwt(credential);
    
        if (jwtData.email && jwtData.name) {
            try {
                const response = await fetch('http://localhost/api/google-login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jwtData
                    }),
                });
    
                const responseData = await response.json();
    
                if (!response.ok) {
                    console.error('Error:', responseData.error);
                } else {
                    setSuccess('Successful login');
                    handleLogin(responseData.token);
                    navigate("/Profile");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };    

    const handleError = (error) => {
        console.error('Google Login Error:', error);
    };


    return(
    <>
    <Header/>
    <GoogleOAuthProvider clientId="347059151046-ecqpjrcbltpdqio5g6rcgkd54gpii4q7.apps.googleusercontent.com"> 
        <div className="overflow-y-scroll min-h-screen bg-[rgb(18,18,18,0.9)] flex items-center justify-center w-full text-white">
            <div className='h-full w-[95%] flex justify-center items-center'>
                <div className={`border-[3px] border-neutral-300 bg-[#181a1b] shadow-lg sm:ml-0 md:ml-0 lg:ml-0 lg:ml-0 min-h-[300px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] max-[425px]:w-[400px] max-[375px]:w-[350px] max-[325px]:w-[310px] w-[400px] font-light rounded-md shadow-lg mb-4 max-[769px] transition-transform absolute transform ${isLoginForm ? 'translate-y-[0%]' : '-translate-y-[200%]'}`}>
                    <div className='w-full min-h-full flex flex-wrap'>
                            <div className='rounded-full w-20 h-20 bg-[rgb(26,28,29)] absolute -top-8 -right-8 max-[426px]:hidden transform bg-[rgb(236,236,236,1)]'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="white" className="w-25 h-28 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <form className='w-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                                <div className='w-[95%]'>
                                    <h1 className='text-2xl tracking-widest my-1'>Log into your account:</h1>
                                    <p className='font-light text-lg uppercase text-[rgb(175,169,158)] mb-4 mt-2'>Login below to start playing</p>
                                </div>
                                <div className='w-[90%]'>
                                    <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='username'>Username:</label>
                                    <input className='focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm mb-2' type='text' id='username' name='username'/>
                                    {errors.loginUsername && <p className="text-red-500 ml-3 my-2 text-lg">{errors.loginUsername}</p>}
                                </div>
                                <div className='w-[90%]'>
                                <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='password'>Password</label>
                                    <PasswordToggle id='password'/>
                                    {errors.loginPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.loginPassword}</p>}
                                </div>
                                <input className='mt-4 w-[75%] my-2 h-10 bg-[rgb(33,36,37)] hover:bg-[rgb(39,42,43)] hover:border-neutral-200 focus:border-2 border-neutral-600 border text-white text-2xl rounded-sm duration-500 hover:scale-105 cursor-pointer' type='submit' value='Login' />
                                {success && <p className='text-green-500 ml-3 my-2 text-lg'>{success}</p>}
                                <div className='w-full relative flex flex-col justify-center items-center my-8'>
                                    <div className='my-1 w-[90%] h-[2px] bg-neutral-500'></div>
                                    <h1 className='absolute max-[326px]:w-[58%] max-[376px]:w-[52%] max-[426px]:w-[45%] w-[38%] bg-[rgb(24,26,27)] justify-center flex text-lg text-[rgb(234,238,240,0.9)] uppercase'>Or continue with</h1>    
                                </div>
                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />
                            </form>
                        <div className='w-full text-center justify-center items-center flex'>
                            <p className='mr-1 w-fit my-2 text-xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide' onClick={toggleForm}>Don't have an account?</p>
                        </div>
                    </div>
                </div>
                <div className={`border-[3px] border-neutral-300 bg-[#181a1b] mt-[84px] shadow-lg min-h-[300px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] max-[425px]:w-[400px] max-[375px]:w-[350px] max-[325px]:w-[310px]  w-[400px] font-light rounded-md shadow-lg mb-4 transition-transform transform ${isLoginForm ? '-translate-y-[200%]' : 'translate-y-[0%]'}`}>
                    <div className='w-full  min-h-full flex flex-wrap'>
                        <div className='rounded-full w-20 h-20 absolute bg-[rgb(26,28,29)] -top-8 -right-8 max-[426px]:hidden transform bg-[rgb(236,236,236,1)]'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="white" className="w-25 h-28 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        <form className='w-full h-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                            <div className='w-[95%]'>
                                <h1 className='text-2xl tracking-widest my-1'>Register your account:</h1>
                                <p className='font-light text-lg uppercase text-[rgb(175,169,158)] mb-4 mt-2'>Register below to continue</p>
                            </div>
                            <div className='w-[90%]'>
                                <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='registerEmail'>E-mail</label>
                                <input className='focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm mb-2' type='email' id='registerEmail' name='registerEmail'/>
                                {errors.registerEmail && <p className="text-red-500 ml-3 my-2 text-lg">{errors.registerEmail}</p>}
                            </div>
                            <div className='w-[90%]'>
                                <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='registerUsername'>Username:</label>
                                <input className='focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm mb-2' type='text' id='registerUsername' name='registerUsername'/>
                                {errors.registerUsername && <p className="text-red-500 ml-3 my-2 text-lg">{errors.registerUsername}</p>}
                            </div>
                            <div className='w-[90%]'>
                            <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='registerPassword'>Password</label>
                                <PasswordToggle id='registerPassword'/>
                                {errors.registerPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.registerPassword}</p>}
                            </div>
                            <div className='w-[90%]'>
                            <label className='ml-3 text-lg uppercase tracking-widest mt-20' htmlFor='confirmRegisterPassword'>Confirm password</label>
                                <PasswordToggle id='confirmRegisterPassword'/>
                                {errors.confirmRegisterPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.confirmRegisterPassword}</p>}
                            </div>
                            <input className='mt-4 w-[75%] h-10 bg-[rgb(33,36,37)] hover:bg-[rgb(39,42,43)] hover:border-neutral-200 focus:border-2 border-neutral-600 border text-white text-2xl rounded-sm duration-500 hover:scale-105 cursor-pointer' type='submit' value='Register' />
                            {success && <p className='text-green-500 ml-3 my-2 text-lg'>{success}</p>}
                            <div className='w-full relative flex flex-col justify-center items-center my-8'>
                                <div className='my-1 w-[90%] h-[2px] bg-neutral-500'></div>
                                <h1 className='absolute max-[326px]:w-[58%] max-[376px]:w-[52%] max-[426px]:w-[45%] w-[38%] bg-[rgb(24,26,27)] justify-center flex text-lg text-[rgb(234,238,240,0.9)] uppercase'>Or continue with</h1>    
                            </div>
                            <GoogleLogin
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        </form>
                        <div className='w-full text-center justify-center items-center flex'>
                            <p className='mr-1 w-fit my-2 text-xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide' onClick={toggleForm}>Already have an account?</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </GoogleOAuthProvider>
    </>
    );
}

export default AuthForms;