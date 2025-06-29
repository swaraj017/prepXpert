// src/pages/LandingPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App_Features } from '../utils/data';
import hero from '../assets/hero.png';
import Header from './Header';
import { useUser, useAuth, useSignIn } from '@clerk/clerk-react';
import { SignInButton } from '@clerk/clerk-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
 
  useEffect(() => {
    const saveToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          localStorage.setItem('token', token);
          navigate('/dashboard');
        }
      }
    };
    saveToken();
  }, [isSignedIn]);

  return (
    <div className='w-full min-h-screen bg-white relative overflow-x-hidden font-sans'>
      {/* Background Blurs */}
      <div className='w-[500px] h-[500px] bg-indigo-200/30 absolute top-0 left-0 -z-10 rounded-full' style={{ filter: 'blur(75px)' }} />
      <div className='w-[400px] h-[400px] bg-purple-200/30 absolute bottom-0 right-0 -z-10 rounded-full' style={{ filter: 'blur(70px)' }} />
      <div className='w-[300px] h-[300px] bg-blue-100/40 absolute top-1/2 left-1/3 -z-10 rounded-full' style={{ filter: 'blur(60px)' }} />

      <Header />

      {/* Hero Section */}
      <div className='flex flex-col-reverse md:flex-row items-center gap-10 sm:gap-12 mb-20 px-6 sm:px-12'>
        {/* Text Content */}
        <div className='w-full md:w-1/2 text-center md:text-left'>
          <div className='inline-block text-lg sm:text-xl font-semibold tracking-wide text-indigo-600 mb-4 bg-indigo-50 px-4 py-2 rounded-full'>
            🚀 Path To Hired!
          </div>
          <h1 className='text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6'>
            Ace Interviews with <br />
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600'>
              AI Powered
            </span>{' '}
            Learning!
          </h1>
          <p className='text-base sm:text-lg text-gray-600 leading-relaxed mb-8 bg-gray-50/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gray-100'>
            Create your own journey, get role-specific questions, expand answers when you need them,
            and go deep into concepts — everything in one place to master interviews.
          </p>

           
          <SignInButton mode='modal' afterSignInUrl='/dashboard'>
            <button
              className='bg-gray-900 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-lg transform hover:scale-105 transition-all duration-300'
            >
              Get Started ✨
            </button>
          </SignInButton>
        </div>

        {/* Hero Image */}
        <div className='w-full md:w-1/2 flex justify-center'>
          <img
            src={hero}
            alt='Interview AI'
            className='w-full max-w-lg rounded-xl shadow-xl border'
          />
        </div>
      </div>

      {/* Features Section */}
      <div className='text-center mb-12'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>
          Why Choose{' '}
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600'>
            PrepXpert
          </span>
          ?
        </h2>
        <p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
          Everything you need to excel in your interviews, powered by AI and designed for your success.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-6 sm:px-12 pb-20'>
        {App_Features.map((feature) => (
          <div
            key={feature.id}
            className='bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105'
          >
            <div className='text-2xl font-bold text-indigo-600 mb-3'>{feature.id}</div>
            <h3 className='text-2xl font-semibold text-gray-900 mb-3'>{feature.title}</h3>
            <p className='text-gray-600 text-md leading-relaxed'>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
