import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState = ({ onAdd }) => (
  <div className='text-center py-12'>
    <div className='max-w-md mx-auto'>
      <div className='mb-4'>
        <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Plus size={32} className='text-gray-400' />
        </div>
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>No journeys yet</h3>
      <p className='text-gray-600 mb-6'>
        Start your first interview journey and take the first step toward your dream role!
      </p>
      <button
        onClick={onAdd}
        className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors'
      >
        Create Your First Journey
      </button>
    </div>
  </div>
);

export default EmptyState;
