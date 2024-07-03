import React, { useState, useEffect } from 'react';

function ProfileAchievements() {
    const [userAchievements, setUserAchievements] = useState([]);
    const [allAchievements, setAllAchievements] = useState([]);
    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    useEffect(() => {
        const fetchUserAchievements = async () => {
            try {
                const response = await fetch('http://localhost/api/getUserAchievements', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${isLoggedIn}`
                    },
                });
                const responseData = await response.json();
                if (!response.ok) {
                    console.error('Error:', responseData);
                } else {
                    setUserAchievements(responseData.achievements);
                    setAllAchievements(responseData.totalAchievements);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUserAchievements();
    }, [isLoggedIn]);

    return (
        <>
            <div className='w-[85%] sm:min-h-[45%] rounded-xl flex flex-col bg-[rgb(26,26,26,0.9)] my-2 relative overflow-hidden'>
                <h1 className='text-2xl sm:text-3xl tracking-widest font-light uppercase text-center my-2'>YOUR ACHIEVEMENTS:</h1>
                <p className='text-xl tracking-widest font-light uppercase text-center text-[rgb(175,169,158)]'>Memoria completion: {((userAchievements.length/allAchievements.length)*100).toFixed(2)}%</p>
                <div className='flex gap-16 overflow-x-scroll snap-x-mandatory scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800'>
                    {userAchievements.map((achievement, index) => (
                        <div className='group m-2 mb-4 h-[150px] w-[150px] [perspective:1000px]' key={index}>
                            <div className='relative h-full w-[150px] rounded-xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]'>
                                <div className='absolute inset-0'>
                                    <img className='h-full w-full rounded-xl object-cover' src={`http://localhost/${achievement?.image_path}`} alt="" />
                                </div>
                                <div className='absolute inset-0 h-full w-full rounded-xl bg-black/40 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]'>
                                    <div className='flex w-full min-h-full flex-col items-center justify-center'>
                                        <h1 className='tracking-widest font-light uppercase'>{achievement.achievement}</h1>
                                        <p className='tracking-widest font-light'>{achievement.description}</p>
                                        <p className='tracking-widest font-light'>{new Date(achievement.pivot.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ProfileAchievements;
