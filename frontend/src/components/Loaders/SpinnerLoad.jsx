import React from 'react';

const SpinnerLoad = () => {
  return (
    <div role="status" className="flex justify-center items-center">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin fill-orange-500"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5C100 78.3 77.6 100.5 50 100.5S0 78.3 0 50.5 22.4 0.5 50 0.5s50 22.2 50 50z"
          fill="currentColor"
        />
        <path
          d="M93.9 39.1C96.8 40 98.1 43.4 96.7 46.1c-8.4 17.3-26.2 28.6-46.7 28.6-20.5 0-38.3-11.3-46.7-28.6-1.4-2.7-.1-6.1 2.8-7 2.7-1 5.8.4 7 2.8 6.4 13.1 19.5 21.5 34.9 21.5 15.4 0 28.5-8.4 34.9-21.5 1.2-2.4 4.3-3.8 7-2.9z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SpinnerLoad;
