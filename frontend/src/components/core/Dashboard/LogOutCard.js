import React from 'react'
import { Navigate } from 'react-router-dom';

const LogOutCard = () => {
    function LogOutYesHandler() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login page after logout
    }
    function LogOutNoHandler() {
        window.location.href = "/dashboard"; // Redirect to login page after logout
    }
  return (
    <div>
        Are you sure you want to log out?
        <div className='flex justify-center items-center gap-4 mt-4'>
            <button onClick={LogOutYesHandler} className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'>Yes</button>
            <button onClick={LogOutNoHandler} className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'>No</button>   
        </div>
    </div>
  )
}

export default LogOutCard