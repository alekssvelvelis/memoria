import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Memoria from '../assets/memoria-logo.svg';
import Gamepad from '../assets/gamepad-solid.svg';

function Header({ onPlayClick }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [leadToGame, setLeadToGame] = useState('/Authorize');
    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            console.log(isLoggedIn);
            const response = await fetch('http://localhost/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${isLoggedIn}`,
                },
            });
    
            if (response.ok) {
                localStorage.removeItem('token');
                navigate("/Authorize");
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };

    const handlePlayClick = () => {
        if (onPlayClick) {
            onPlayClick();
        }
        toggleMobileMenu();
    };

    useEffect(() => {
        if(isLoggedIn){
            setLeadToGame('/play')
        }
      }, [isLoggedIn]);

    return (
        <>
            <div className="w-screen h-[10vh] bg-[rgb(10,10,10,0.05)] flex justify-between items-center z-[65] absolute top-0">
                <div className="flex items-center sm:ml-4 md:ml-4 lg:ml-4 w-full max-[476px]:justify-start md:justify-normal sm:justify-normal lg:justify-normal">
                    <button onClick={toggleMobileMenu} className="flex p-3 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-10 h-10 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <div className="absolute right-0 flex justify-center items-center">
                        <p className="font-mono uppercase tracking-widest"></p>
                        <Link to="/" className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer">Memoria</Link>
                        <img className="flex p-2 ml-2 h-20 w-20" src={Memoria} />
                    </div>
                </div>
            </div>
            <div onClick={toggleMobileMenu} className={`w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-[65] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}></div>
            <div className={`w-full overflow-y-scroll sm:w-[47%] lg:w-[35%] h-screen fixed top-0 left-0 z-[66] flex text-white flex-col items-center justify-center bg-[rgb(18,18,18,0.97)] overflow-hidden transition-transform transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-full h-full flex flex-col">
                    <div className="h-[10%] w-full">
                        <div className="flex items-center sm:ml-6 md:ml-6 lg:ml-6 my-1 w-full max-[476px]:justify-start sm:justify-normal lg:justify-normal md:justify-normal">
                            <button onClick={toggleMobileMenu} className="flex p-3  max-[768px]:-ml-2 max-[1024px]:-ml-2 max-[1440px]:ml-0 max-[425px]:ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-10 h-10 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                            <div className="absolute right-0 flex justify-center items-center">
                                <Link to="/" className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer">Memoria</Link>
                                <img className="flex p-2 ml-2 h-20 w-20" src={Memoria} />
                            </div>
                        </div>
                    </div>
                    <div className="h-full w-full flex flex-col justify-evenly">
                        <div className=" w-full flex mb-2 flex-col items-center">
                            <div className="flex items-center justify-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                <Link to={leadToGame} className="flex p-2" onClick={handlePlayClick}>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg> */}
                                    <img className="w-12 h-12 my-2" src={Gamepad}/>
                                </Link>
                                <div className="w-full sm:text-start text-center">
                                    <Link to={leadToGame} onClick={handlePlayClick} className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Play</Link> 
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex mb-2 flex-col items-center">
                            <div className="flex items-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                <Link to="/leaderboard" className="flex p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                                    </svg>
                                </Link>
                                <div className="w-full sm:text-start text-center">
                                    <Link to="/leaderboard"  className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Leaderboard</Link> 
                                </div>
                            </div>
                        </div>
                        {isLoggedIn && 
                            <div className=" w-full flex mb-2 flex-col items-center">
                                <div className="flex items-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                    <Link to="/Profile" className="flex p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </Link>
                                    <div className="w-full sm:text-start text-center">
                                        <Link to="/Profile" className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Profile</Link> 
                                    </div>
                                </div>
                            </div>
                        }
                        <div className=" w-full flex mb-2 flex-col items-center">
                            <div className="flex items-center w-full flex-col md:flex-row lg:flex-row sm:flex-row md:ml-12 sm:ml-12 lg:ml-12">
                                <div className="flex p-2">
                                    {isLoggedIn ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                        </svg> 
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                        </svg>
                                    )}
                                </div>
                                <div className="w-full text-center sm:text-start md:text-start lg:text-start xl:text-start">
                                    {isLoggedIn ? (
                                     <button onClick={handleLogout} className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Logout</button>
                                    ):(
                                      <Link to="/Authorize" className="text-3xl text-white font-light uppercase tracking-widest cursor-pointer text-center sm:text-left sm:ml-8 md:text-left md:ml-8 lg:text-left lg:ml-8">Login</Link>   
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
