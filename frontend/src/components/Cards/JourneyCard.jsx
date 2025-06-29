import React from 'react';
import {
  Trash2,
  Calendar,
  BookOpen,
  User,
  ChevronRight,
} from 'lucide-react';
import moment from 'moment';

const JourneyCard = ({ session, onSelect, onDelete }) => {
  const {
    role = 'Frontend Developer',
    experience = '2 Years',
    topicsToFocus = [],
    questions = [],
    updatedAt,
    description = 'Preparing for frontend dev roles',
  } = session;

  const initials = role
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const formattedDate = moment(updatedAt).format('Do MMMM YYYY');

  // Dynamic background colors by role
  const getBackgroundColor = (role = '') => {
    const colors = {
      Frontend: 'bg-blue-50 border-blue-100',
      Backend: 'bg-green-50 border-green-100',
      'Full Stack': 'bg-purple-50 border-purple-100',
      DevOps: 'bg-orange-50 border-orange-100',
    };

    const matchedKey = Object.keys(colors).find((key) =>
      role.toLowerCase().includes(key.toLowerCase())
    );
    return colors[matchedKey] || 'bg-yellow-50 border-yellow-100';
  };

  return (
    <div
      onClick={() => onSelect?.(session)}
      className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md cursor-pointer space-y-5 transition-all"
    >
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(session);
        }}
        className="absolute top-3 right-3 p-2 bg-white text-gray-400 rounded-full hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 shadow-sm border border-gray-200"
      >
        <Trash2 size={16} />
      </button>

      {/* Header */}
      <div
        className={`flex items-center gap-4 ${getBackgroundColor(
          role
        )} rounded-xl p-4 border`}
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-xl bg-white text-gray-800 font-bold text-lg flex items-center justify-center shadow-sm border border-gray-200">
            {initials}
          </div>
          
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{role}</h2>
          <p className="text-sm text-gray-600 font-medium">
            {Array.isArray(topicsToFocus)
              ? topicsToFocus.slice(0, 3).join(', ')
              : topicsToFocus}
            {Array.isArray(topicsToFocus) && topicsToFocus.length > 3 && '...'}
          </p>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>

      {/* Info Pills */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
          <User size={14} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Experience: {experience}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
          <BookOpen size={14} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {questions.length} Q&amp;A
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
          <Calendar size={14} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Last Updated: {formattedDate}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default JourneyCard;
