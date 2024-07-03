import React, { useState } from 'react';
function GoogleUserFirstTime({ onClose, email, onUsernameChosen }) {
    const [errors, setErrors] = useState({});

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        const validationErrors = {};

        const formData = {
            profileUsername : e.target.profileUsername.value,
            profileEmail : email,
        }

        const usernameToClear = formData.profileUsername;
        if (!usernameToClear) {
            validationErrors.profileUsername = 'Username is required';
        } else if (usernameToClear.match(/^[^a-zA-Z0-9]+$/)){
            validationErrors.profileUsername = 'Username cannot contain symbols';
        } else if(usernameToClear.trim().length < 3){
            validationErrors.profileUsername = 'Minimum length is 3 symbols';
        } else if(usernameToClear.trim().length > 15){
            validationErrors.profileUsername = 'Maximum length is 15 symbols';
        }
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                console.log(formData);
                const isLoggedInObject = localStorage.getItem('token');
                const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;
                const response = await fetch('http://localhost/api/updateUserData', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${isLoggedIn}`
                    },
                    body: JSON.stringify(formData)
                });
                if(!response.ok){
                    const responseData = await response.json();
                    console.error(errors);
                    setErrors(responseData.errors);
                    console.log(errors);
                }else{
                    console.log('success updating google login');
                    onUsernameChosen(formData.profileUsername);
                    onClose();
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
    }
    return (
        <>
        <div className={`w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 opacity-100`}></div>
        <div className={`border-[3px] z-[45] text-white border-neutral-300 bg-[#181a1b] shadow-lg sm:ml-0 md:ml-0 lg:ml-0 lg:ml-0 min-h-[250px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] max-[425px]:w-[400px] max-[375px]:w-[350px] max-[325px]:w-[310px]  w-[400px] font-light rounded-md shadow-lg mb-4 max-[769px]:mt-[24px] mt-[48px] fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2`}>
            <div className='w-full min-h-full flex flex-wrap'>
                <form className='w-full min-h-full flex flex-col justify-center items-center' onSubmit={handleSubmitForm}>
                    <div className='w-[95%]'>
                        <h1 className='text-3xl tracking-widest my-1'>Hey! Welcome to Memoria!</h1>
                        <p className='font-light text-lg uppercase text-[rgb(175,169,158)] mb-4 mt-2'>Choose your username to continue:</p>
                    </div>
                    <div className='w-[90%]'>
                        <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='profileUsername'>Username:</label>
                        <input className='focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm mb-2' type='text' id='profileUsername' name='profileUsername'/>
                        {errors.profileUsername && (<p className='text-red-500 ml-2 text-lg'>{errors.profileUsername}</p>)}
                    </div>
                    <input className='mt-4 w-[75%] my-2 h-10 bg-[rgb(33,36,37)] hover:bg-[rgb(39,42,43)] hover:border-neutral-200 focus:border-2 border-neutral-600 border text-white text-2xl rounded-sm duration-500 hover:scale-105 cursor-pointer' type='submit' value='Submit' />
                </form>
            </div>
        </div>
        </>
    );  
}

export default GoogleUserFirstTime;