import React, { useState, useEffect } from 'react';
import VantaBackground from '../Backgrounds/VantaBackground';
function PurchaseBackground({ onClose, backgroundName, backgroundPrice, backgroundDescription, onHandlePurchase, updateUserBackgrounds }) {
    const [error,  setError] = useState('');
    const [success,  setSuccess] = useState('');
    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    const purchaseBackground = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost/api/purchaseBackground', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${isLoggedIn}`
                },
                body: JSON.stringify({ name: backgroundName }),
            });
            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message);
                setError('');
                onHandlePurchase(data.newMoney);
                updateUserBackgrounds();
            } else {
                const errorData = await response.json();
                // console.error(`Error ${response.status}:`, errorData);
                setError(errorData.error);
                setSuccess('');

            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    return(
        <>
            <div className={`w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 opacity-100`} onClick={onClose}></div>
            <div className='border mt-4 max-[425px]:mt-8 fixed rounded-lg z-[45] transition-all transform border-neutral-200 bg-[#121212] w-1/2 max-[425px]:w-[300px] h-[575px] flex text-white text-xl -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2'>
            <button
                onClick={onClose}
                className='absolute right-2 top-2 z-[5] text-3xl text-white cursor-pointer transform transition-all duration-200 hover:text-gray-300'
            >
                X
            </button>
                <div className='w-full h-full relative flex flex-col justify-center items-center m-2'>
                    <div className='w-full h-full flex flex-col justify-center items-center m-2'>
                        <div className='w-full'><VantaBackground effect={backgroundName} classes={`w-[100%] h-[75%] absolute top-10`}/></div>
                        <h1 className='uppercase tracking-widest text-3xl font-light absolute top-0 z-[1]'>{backgroundName}</h1>
                    </div>
                    <div className='w-full z-[1] my-auto flex flex-col justify-center items-center text-center'>
                        <h1 className='font-light tracking-wide text-2xl my-1'>{backgroundDescription}</h1>
                        <h1 className='font-light tracking-widest text-2xl my-1'>{backgroundPrice} 💸</h1>
                        <button className='w-fit z-[10] mb-4 text-xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-widest' onClick={purchaseBackground}>Purchase</button>
                        {error && <p className='text-red-500 text-xl font-light tracking-wide mb-4'>{error}</p>}
                        {success && <p className='text-green-500 text-xl font-light tracking-wide mb-4'>{success}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PurchaseBackground;