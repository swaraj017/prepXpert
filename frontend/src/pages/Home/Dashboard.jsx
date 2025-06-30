import React, { useEffect, useState } from 'react';
import JourneyCard from '../../components/Cards/JourneyCard';
import DashboardLayout from './DashboardLayout';
import CreateSessionForm from './CreateSessionForm';
import { useUser, useAuth, useSession } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import Modal from '../../components/Modal';

const Dashboard = () => {
  const [openCreateModal, setCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { session } = useSession();
  const navigate = useNavigate();

  // Fetch all sessions
  const fetchAllSessions = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Session expired. Please sign in again.');
        return;
      }

      const response = await axiosInstance.get(API_PATH.SESSION.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch sessions. Try refreshing.');
    }
  };

  // Open modal safely
  const handleOpenModal = async () => {
    const token = await getToken();
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      return;
    }
    setCreateModal(true);
  };

  // Delete session
  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Session expired. Please sign in again.');
        return;
      }

      await axiosInstance.delete(`${API_PATH.SESSION.DELETE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Session deleted');
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchAllSessions();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!session) {
      toast.error('Session expired. Refreshing...');
      setTimeout(() => window.location.reload(), 2500);
    }
  }, [session]);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        {sessions.length === 0 ? (
  <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
    <img
      src="/nothing.JPG"
      alt="No sessions"
      className="w-52 sm:w-64 md:w-72 lg:w-80 h-auto mb-6 rounded-lg shadow-md"
    />
    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
      No sessions yet
    </h2>
    <p className="text-sm sm:text-base text-gray-600 max-w-md mb-5">
      You haven’t started your prep journey. Tap “Add New” to begin.
    </p>
    <button
      onClick={handleOpenModal}
      className="px-5 py-2.5 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition"
    >
      ➕ Add New
    </button>
  </div>
)  
: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1">
            {sessions.map((session) => (
              <JourneyCard
                key={session._id}
                session={session}
                onSelect={() => navigate(`/interview-prep/${session._id}`)}
                onDelete={() => handleDelete(session._id)}
              />
            ))}
          </div>
        )}

        {/* Floating Button */}
        {sessions.length > 0 && (
          <button
            onClick={handleOpenModal}
            className="fixed bottom-6 right-6 z-50 h-12 md:h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="text-2xl text-white" />
            Add New
          </button>
        )}
      </div>

      {openCreateModal && (
        <Modal isOpen={openCreateModal} onClose={() => setCreateModal(false)}>
          <CreateSessionForm
            onSuccess={() => {
              setCreateModal(false);
              fetchAllSessions();
            }}
          />
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
