import React, { useState, useEffect } from 'react';
import VantaBackground from './VantaBackground';

const BackgroundReceiver = ({ isLoggedIn }) => {
    const [activeBackground, setBackground] = useState(null);
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
                    setBackground(responseData.background);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        getUserCurrentBackground();
    }, [isLoggedIn]);

    return (
        <>
            {activeBackground === 'default' ? <div className='min-h-screen w-screen fixed top-0 left-0 bg-[rgb(18,18,18,0.9)]'></div> : <VantaBackground effect={activeBackground} classes="min-h-screen w-screen fixed top-0 left-0" />}
        </>
    );
};

export default BackgroundReceiver;
