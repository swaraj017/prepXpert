import React, { useEffect, useState } from 'react';
import JourneyCard from '../../components/Cards/JourneyCard';
import DashboardLayout from './DashboardLayout';
import CreateSessionForm from './CreateSessionForm';
import { useUser, useAuth } from '@clerk/clerk-react';
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
  const navigate = useNavigate();

  const fetchAllSessions = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("User token missing");
        return;
      }

      const response = await axiosInstance.get(API_PATH.SESSION.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched sessions:", response.data);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to fetch sessions");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("User token missing");
        return;
      }

      await axiosInstance.delete(`${API_PATH.SESSION.DELETE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Session deleted");
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchAllSessions();
    }
  }, [isSignedIn]);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        {sessions.length === 0 ? (
          <p className="text-center text-gray-500">No sessions found. Click "Add New" to create one.</p>
        ) : (
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

        <button
          onClick={() => setCreateModal(true)}
          className="fixed bottom-6 right-6 z-50 h-12 md:h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors cursor-pointer"
        >
          <Plus className="text-2xl text-white" />
          Add New
        </button>
      </div>

      {/*   Your custom modal */}
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
