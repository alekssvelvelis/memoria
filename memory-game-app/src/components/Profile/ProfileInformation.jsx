import React, { useState, useEffect } from 'react';
import Header from '../Header';
import ProfileUserForm from './ProfileUserForm';
import ProfileAchievements from './ProfileAchievements';
import ProfileGameHistory from './ProfileGameHistory';
import ProfileBackgroundSelection from './ProfileBackgroundSelection';
import GoogleUserFirstTime from './GoogleUserFirstTime';
import VantaBackground from '../Backgrounds/VantaBackground';
import BackgroundReceiver from '../Backgrounds/BackgroundReceiver';
function ProfileInformation(){

    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    const [userData, setUserData] = useState({});
    const [currentName, setCurrentName] = useState('');
    const [currentBackground, setCurrentBackground] = useState('');
    const [money, setMoney] = useState(0);

    useEffect(() => {
        const getUserMoney = async () => {
            try {
                const response = await fetch('http://localhost/api/getUserMoney', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${isLoggedIn}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setMoney(data.money);
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching user info:', errorData);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        getUserMoney();
    }, [isLoggedIn]);

    const handleUserDataChange = (newUserData, newCurrentName) => {
        setUserData(newUserData);
        setCurrentName(newCurrentName);
    };
    const handleUserBackgroundChange = (newUserBackground) => {
        setCurrentBackground(newUserBackground);
    };
    const handlePurchaseBackground = (newMoney) => {
        setMoney(newMoney);
    };

    const [isGoogleModalOpen, setGoogleModalOpen] = useState(false);
    useEffect(() => {
        if (userData.username === null && userData.google_id) {
          setGoogleModalOpen(true);
        }
    }, [userData]);
    
    const toggleGoogleModal = () => {
        setGoogleModalOpen(!isGoogleModalOpen);
    }

    return(
        <>
        {currentBackground ? <VantaBackground effect={currentBackground} classes="min-h-screen w-screen fixed top-0 left-0"/>:<BackgroundReceiver isLoggedIn={isLoggedIn}/>}
        <Header/>
        <div className={`overflow-y-scroll min-h-screen absolute bg-[rgb(18,18,18,0.6)] flex justify-center w-full text-white flex-col`}>
            <div className='w-full h-[10vh]'></div>
            <div className='h-full w-[100%] flex flex-col justify-center items-center my-6'>
                <div className='w-[85%] flex max-[425px]:flex-col sm:ml-8 text-center items-center justify-center sm:justify-start'>
                    <h1 className='uppercase text-2xl sm:text-4xl tracking-widest'>Welcome {currentName}!</h1>
                    <h1 className='uppercase text-2xl sm:text-4xl tracking-widest ml-auto mr-8 max-[425px]:hidden'>{money} 💸</h1>   
                    <h1 className='uppercase text-2xl sm:text-4xl tracking-widest hidden max-[425px]:flex mt-4'>YOU have: {money} 💸</h1>
                </div>
                <div className='rounded-xl bg-[rgb(44,44,44,0.8)] w-[85%] min-h-[90%] flex flex-col m-4'>
                    <div className='w-full flex flex-col sm:flex-row'>
                        <div className='sm:w-1/2 w-full h-full flex flex-col items-center justify-center m-2 ml-0'>
                            <ProfileUserForm onUserDataChange={handleUserDataChange} defaultUsername={currentName} email={userData.email}/>
                        </div>
                        <div className='sm:w-1/2 w-full flex justify-center'>
                            <div className='w-full flex flex-col justify-around items-center'>
                                <ProfileAchievements/>
                                <ProfileBackgroundSelection onUserBackgroundChange={handleUserBackgroundChange} onHandlePurchase={handlePurchaseBackground}/>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex justify-center'>
                        <div className='w-[92%] h-full flex flex-col items-center justify-center m-2'>
                            <div className='w-[100%] min-h-[90%] mb-4 rounded-xl flex flex-col items-center bg-[rgb(26,26,26,0.9)]'>
                                <div className='w-full h-[40%] flex justify-center items-center text-center m-2'>
                                    <h1 className='uppercase text-4xl tracking-widest my-2'>YOUR GAME HISTORY:</h1>
                                </div>
                                <ProfileGameHistory/>
                            </div>
                        </div>
                    </div>
                </div>
                {isGoogleModalOpen && (
                    <GoogleUserFirstTime onClose={toggleGoogleModal} email={userData.email} onUsernameChosen={(username) => {setCurrentName(username)}}/>
                )}
            </div>
        </div>
        </>
    );
}

export default ProfileInformation;
