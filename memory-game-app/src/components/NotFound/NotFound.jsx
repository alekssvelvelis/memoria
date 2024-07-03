import React from 'react';
import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <>
    <div className="overflow-y-scroll min-h-screen bg-[rgb(18,18,18,0.9)] flex justify-center items-center w-full text-white flex-col">
        <div className='text-center font-light'>
        <h1>404 - Not Found</h1>
        <p className='mb-4'>Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className='mr-1 w-fit my-2 text-2xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide'>Return to the homepage</Link>
        </div>
    </div>
    </>
  );
};

export default NotFound;