import React from 'react';

const Modal = ({
  children,
  isOpen,
  onClose,
  hideHeader,
  title
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/30 backdrop-blur-sm'>
      <div className='relative flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md'>
        {!hideHeader && (
          <div className='flex justify-between items-center p-4 border-b'>
            <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
            <button
              type='button'
              className='text-gray-600 hover:text-gray-900'
              onClick={onClose}
            >
              <svg
                className='w-5 h-5'
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        )}

        <div className='p-4 custom-scrollbar'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
