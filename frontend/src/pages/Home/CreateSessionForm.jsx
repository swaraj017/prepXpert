import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import SpinnerLoad from '../../components/Loaders/SpinnerLoad';

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-base font-medium text-gray-800">{label}</label>
    <input
      className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
    />
  </div>
);

const CreateSessionForm = ({ token, onSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    topicsToFocus: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus } = formData;
    if (!role || !experience || !topicsToFocus) {
      setError('Please fill all required fields');
      return;
    }

    if (!token) {
      toast.error('⚠️ Your session has expired due to inactivity. Please sign in again.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const aiResponse = await axiosInstance.post(
        API_PATH.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus: topicsToFocus.split(',').map((t) => t.trim()),
          numberOfQues: 10,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATH.SESSION.CREATE,
        {
          ...formData,
          questions: generatedQuestions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.session?._id) {
        toast.success('🎉 Session created successfully!');
        navigate(`/interview-prep/${response.data.session._id}`);
        onSuccess?.();
      } else {
        throw new Error('Invalid session response');
      }
    } catch (err) {
      console.error('[CreateSessionForm] Error:', err);
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        'Failed to create session. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      toast('⏳ You’ve been inactive for a while. Submit soon to avoid token expiry.', {
        icon: '⏰',
      });
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h3 className="text-3xl font-bold text-gray-900 mb-2">🎯 Start a New Journey</h3>
      <p className="text-base text-gray-600 mb-8">
        Fill in a few quick details to generate a personalized set of interview questions tailored to your goals.
      </p>

      <form onSubmit={handleCreateSession} className="space-y-6">
        <Input
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          label="Target Role"
          placeholder="e.g., Frontend Developer"
        />
        <Input
          value={formData.experience}
          onChange={(e) => handleChange('experience', e.target.value)}
          label="Years of Experience"
          type="number"
          placeholder="e.g., 1, 3, 5+"
        />
        <Input
          value={formData.topicsToFocus}
          onChange={(e) => handleChange('topicsToFocus', e.target.value)}
          label="Topics to Focus"
          placeholder="e.g., React, Node.js"
        />
        <Input
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          label="Description (Optional)"
          placeholder="Any specific notes"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end flex-col items-end gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2"
          >
            {isLoading && <SpinnerLoad />}
            Create Session
          </button>
          <p className="text-m text-gray-500 italic">
            ⚠️ Note: Please complete and submit in a timely manner.
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreateSessionForm;
