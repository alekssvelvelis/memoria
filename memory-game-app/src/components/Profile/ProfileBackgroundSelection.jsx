import React, { useState, useEffect } from 'react';
import PurchaseBackground from './PurchaseBackground'; // Import PurchaseBackground component

function ProfileBackgroundSelection({ onUserBackgroundChange, onHandlePurchase }) {
    const [animatedBackgrounds, setAnimatedBackgrounds] = useState([]);
    const [userBackgrounds, setUserBackgrounds] = useState([]);
    const [activeBackground, setActiveBackground] = useState('');
    const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);

    const [backgroundInfo, setBackgroundInfo] = useState([]);
    const handlePurchaseModal = (background) => {
        setPurchaseModalOpen(!isPurchaseModalOpen)
        setBackgroundInfo(background);
    }

    const handlePurchaseBackground = async (newMoney) => {
        onHandlePurchase(newMoney);
        const updatedBackgrounds = [...userBackgrounds, backgroundInfo];
        setUserBackgrounds(updatedBackgrounds);
    };


    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;
    useEffect(() => {
        const getUserCurrentBackground = async () => {
            try {
                const response = await fetch('http://localhost/api/getUserCurrentBackground', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${isLoggedIn}`
                    },
                });
                const responseData = await response.json();
                if (!response.ok) {
                    console.error('Error:', responseData);
                } else {
                    setActiveBackground(responseData.background);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        getUserCurrentBackground();
    }, [isLoggedIn]);

    useEffect(() => {
        const getAnimatedBackgrounds = async () => {
            try {
                const response = await fetch('http://localhost/api/getAnimatedBackgrounds', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${isLoggedIn}`
                    },
                });
                const responseData = await response.json();
                if (!response.ok) {
                    console.error('Error:', responseData);
                } else {
                    setAnimatedBackgrounds(responseData.backgrounds);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        getAnimatedBackgrounds();
    }, [isLoggedIn]);

    const getUserBackgrounds = async () => {
        try {
            const response = await fetch('http://localhost/api/getUserBackgrounds', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${isLoggedIn}`
                },
            });
            const responseData = await response.json();
            if (!response.ok) {
                console.error('Error:', responseData);
            } else {
                setUserBackgrounds(responseData.backgrounds);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getUserBackgrounds();
    }, [isLoggedIn]);

    const updateUserBackground = async (backgroundName) => {
        try {
            const response = await fetch('http://localhost/api/updateUserBackground', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${isLoggedIn}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: backgroundName }),
            });
            const responseData = await response.json();
            if (!response.ok) {
                console.error('Error:', responseData);
            } else {
                setActiveBackground(backgroundName);
                onUserBackgroundChange(backgroundName);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <>
            <div className='w-[85%] sm:min-h-[45%] rounded-xl flex flex-col bg-[rgb(26,26,26,0.9)] my-2 relative overflow-hidden'>
                <h1 className='text-2xl sm:text-3xl tracking-widest font-light uppercase text-center my-2'>YOUR COSMETICS:</h1>
                <p className='text-xl tracking-widest font-light uppercase text-center text-[rgb(175,169,158)]'>Memoria completion: {((userBackgrounds.length/animatedBackgrounds.length)*100).toFixed(2)}%</p>
                <div className='flex gap-16 overflow-x-scroll snap-x-mandatory scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800'>
                {animatedBackgrounds.map((background, index) => {
                    const isOwned = userBackgrounds.some(userBackground => userBackground.background_id === background.id);
                    const isActive = activeBackground === background.name;
                    return (
                        <>
                        <div className={`m-2 mb-4 h-[150px] relative cursor-pointer rounded-xl transition-all transform duration-500 hover:scale-105 ${isActive ? 'border border-green-500 scale-105' : ''}`} key={index} onClick={isOwned ? () => updateUserBackground(background.name) : () => handlePurchaseModal(background)}>
                            {isOwned ? (
                                    <>
                                        {isActive && (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 z-[2] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        )}
                                    </>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 z-[2] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                )}
                            <div className="h-full w-[150px] rounded-xl" style={{ backgroundImage: `url(http://localhost/${background?.image_path})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        </div>
                        </>
                    );
                })}
                </div>
            </div>
            {isPurchaseModalOpen && (
                <PurchaseBackground 
                    onClose={handlePurchaseModal} 
                    backgroundId={backgroundInfo.id} 
                    backgroundName={backgroundInfo.name} 
                    backgroundDescription={backgroundInfo.description} 
                    backgroundPrice={backgroundInfo.price}
                    onHandlePurchase={handlePurchaseBackground}
                    updateUserBackgrounds={getUserBackgrounds}
                />
            )}
        </>
    );
}

export default ProfileBackgroundSelection;
