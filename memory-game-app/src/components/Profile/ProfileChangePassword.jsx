import React, { useState } from 'react';
import PasswordToggle from '../PasswordToggle';

function ProfileChangePassword({ onClose, hasPassword, onPasswordChange }) {
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState([]);
    const handleSubmitForm = async (e) => {
        e.preventDefault();
    
        const formData = {
            password: e.target.password ? e.target.password.value.trim() : '',
            confirmPassword: e.target.confirmPassword ? e.target.confirmPassword.value.trim() : '',
            currentPassword: e.target.currentPassword ? e.target.currentPassword.value.trim() : '',
        };

        const validationErrors = {};
        const passwordToClear = formData.password;
        const confirmToClear = formData.confirmPassword;
        const currentPassword = formData.currentPassword;
        
        if(!passwordToClear){
            validationErrors.password = 'Password is required';
        }else if (passwordToClear.length < 8){
            validationErrors.password = 'Minimum length is 8 symbols';
        }

        if(!confirmToClear){
            validationErrors.confirmPassword = 'Confirmed password is required';
        }else if (confirmToClear.length < 8){
            validationErrors.confirmPassword = 'Minimum length is 8 symbols';
        }  else if (confirmToClear !== passwordToClear) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }

        if(hasPassword){
            if(!currentPassword){
                validationErrors.currentPassword = 'Current password is required';
            }
        }
        setSuccess('');
        if (Object.keys(validationErrors).length === 0) {
            try {
                const isLoggedInObject = localStorage.getItem('token');
                const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;
                const response = await fetch('http://localhost/api/updatePassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${isLoggedIn}`
                    },
                    body: JSON.stringify(formData)
                });
                const responseData = await response.json();
                if (!response.ok) {
                    console.error('Error:', responseData.error);
                    setSuccess('');
                    if (responseData.error === 'Invalid current password') {
                        setErrors({ currentPassword: 'Wrong current password' });
                    }
                    throw new Error('Password update failed');
                }
                setErrors({});
                setSuccess('Password updated!');
                if(errors.length === 0){
                    setTimeout(() => {
                        onClose();
                        onPasswordChange();
                    }, 7000);
                }

            } catch (error) {
                console.error('Error:', error.message);
            }
        } else {
            setErrors(validationErrors);
        }
    };
    return(
        <>
        <div onClick={onClose} className={`w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 opacity-100`}></div>
        <div className={`border-[3px] z-[45] text-white border-neutral-300 bg-[#181a1b] shadow-lg sm:ml-0 md:ml-0 lg:ml-0 lg:ml-0 min-h-[300px] xl:w-[500px] lg:w-[500px] md:w-[500px] sm:w-[500px] max-[425px]:w-[400px] max-[375px]:w-[350px] max-[325px]:w-[310px]  w-[400px] font-light rounded-md shadow-lg mb-4 max-[769px]:mt-[24px] mt-[48px] fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2`}>
            <button
                onClick={onClose}
                className='absolute right-2 text-3xl text-white cursor-pointer hover:text-gray-300'
            >
                X
            </button>
            <div className='w-full min-h-full flex flex-wrap'>
                    <form className='w-full min-h-full flex flex-col justify-center items-center' onSubmit={(handleSubmitForm)}>
                        <div className='w-[95%]'>
                            <h1 className='text-2xl tracking-widest my-1'>Change your password:</h1>
                            <p className='font-light text-lg uppercase text-[rgb(175,169,158)] mb-4 mt-2'>Enter your new password</p>
                        </div>
                        {!hasPassword ? '' :
                            <div className='w-[90%]'>
                            <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='currentPassword'>Current password:</label>
                            <PasswordToggle id='currentPassword'/>
                            {errors.currentPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.currentPassword}</p>}
                        </div>
                        }
                        <div className='w-[90%]'>
                            <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='password'>Password:</label>
                            <PasswordToggle id='password'/>
                            {errors.password && <p className="text-red-500 ml-3 my-2 text-lg">{errors.password}</p>}
                        </div>
                        <div className='w-[90%]'>
                        <label className='ml-3 text-lg uppercase tracking-widest' htmlFor='confirmPassword'>Confirm Password:</label>
                            <PasswordToggle id='confirmPassword'/>
                            {errors.confirmPassword && <p className="text-red-500 ml-3 my-2 text-lg">{errors.confirmPassword}</p>}
                        </div>
                        <input className='mt-4 w-[75%] my-2 h-10 bg-[rgb(33,36,37)] hover:bg-[rgb(39,42,43)] hover:border-neutral-200 focus:border-2 border-neutral-600 border text-white text-2xl rounded-sm duration-500 hover:scale-105 cursor-pointer' type='submit' value='Change' />
                        {success && <p className='text-green-500 my-2 text-xl'>{success}</p>}
                    </form>
            </div>
        </div>
        </>
    );
}

export default ProfileChangePassword;