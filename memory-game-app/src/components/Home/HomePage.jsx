import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';

const HomePage = () => {
    const [link, setLink] = useState('/Authorize');
    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    useEffect(() => {
        if (isLoggedIn) {
            setLink('/play');
        }
    }, []);

    return (
        <>
            <Header />
            <div className="overflow-y-scroll min-h-screen bg-[rgb(18,18,18,0.9)] flex justify-center items-center w-full text-white flex-col">
                <div className='text-center'>
                    <h1 className='tracking-widest text-6xl max-[425px]:text-5xl font-light uppercase my-6'>Welcome to Memoria!</h1>
                    <p className='mt-8 mb-4 font-light tracking-wide text-4xl italic'>the only memory game you'll ever need.</p>
                    <Link to={link} className='mr-1 w-fit text-2xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide'>Click here to start playing</Link>
                </div>
            </div>
        </>
    );
};

export default HomePage;
