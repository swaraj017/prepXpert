import React from 'react';

const RoleInfoHeader = ({
  role = '',
  topicsToFocus = [],
  experience = '',
  questions = [],
  description = '',
  lastUpdated = '',
}) => {
  // Helper function to format experience text
  const formatExperience = (exp) => {
    const num = parseInt(exp);
    return `Experience: ${exp} ${num === 1 ? 'Year' : 'Years'}`;
  };

  // Helper function to format date if it's a Date object
  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return date;
  };

  return (
    <div className="relative rounded-2xl bg-white mx-8 p-6 shadow-lg overflow-hidden border border-gray-200">
      {/* Soft Gradient Border Glow */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-green-300 via-blue-300 to-transparent blur-xl opacity-50 rounded-full pointer-events-none" />
      <div className="absolute -right-10 -top-10 w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-300 to-transparent blur-lg opacity-40 rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{role}</h2>
          <p className="text-gray-600 text-base font-medium leading-relaxed">
            {Array.isArray(topicsToFocus) ? topicsToFocus.join(' • ') : topicsToFocus}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm">
            {formatExperience(experience)}
          </span>
          <span className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm">
            {Array.isArray(questions) ? questions.length : 0} Q&A
          </span>
          <span className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm">
            Updated: {formatDate(lastUpdated)}
          </span>
        </div>

        {description && (
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
 

export default RoleInfoHeader;
