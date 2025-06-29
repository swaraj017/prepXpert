import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import axios from 'axios';

const TrackUser = () => {
  const { user } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      try {
        await axios.post('https://prepxpert-backend.onrender.com/api/users', {
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
        });
        console.log(" User synced to backend");
      } catch (error) {
        console.error(" Failed to sync user:", error.message);
      }
    };

    syncUser();
  }, [user]);

  return null; // no UI
};

export default TrackUser;
