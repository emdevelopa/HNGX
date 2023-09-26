"use client"
import React, {useEffect, useState} from 'react'
import Dashboard from './components/board'
import ImageGallery from './components/imggallery'
import Navbar from '../nav'
import { useTheme } from 'next-themes'
import CustomLoading from '../loading'

const Page = () => {
  const { theme, setTheme } = useTheme('dark');
  useEffect(() => {
    const userToken = sessionStorage.getItem('token');

    if (!userToken) {
      window.location.href = '/accounts/login'; 
    }
  }, []);
  
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false); // Set loading to false after 3 seconds
    }, 2000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`w-full flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-[#08f34b15]'} min-h-screen`}>
    {/* <Navbar /> */}
      <Dashboard />
      {loading ? <CustomLoading /> :
      <ImageGallery />
    
  }
    </div>
  )
}

export default Page