// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import PrepXpertLogo from '../assets/PrepXperLogo';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-10 sm:mb-14 backdrop-blur-sm bg-white/80 rounded-2xl px-4 sm:px-6 py-4 shadow-sm border border-gray-100'>
      {/* Logo */}
      <div
        className='text-2xl sm:text-3xl font-bold text-gray-900 flex items-center cursor-pointer'
        onClick={() => navigate('/')}
      >
        <div className='flex items-center h-14 sm:h-20'>
          <PrepXpertLogo className='h-full w-auto' />
        </div>
      </div>

      {/* Auth */}
      <div className='flex items-center'>
        <SignedOut>
          <div className="hidden md:block">
            <SignInButton mode="modal" afterSignInUrl="/dashboard" asChild>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="hidden md:block ml-4">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "48px",
                    height: "48px"
                  },
                  avatarImage: {
                    width: "48px",
                    height: "48px"
                  }
                }
              }}
            />
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
