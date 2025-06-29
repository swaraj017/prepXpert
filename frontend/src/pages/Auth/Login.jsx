 
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const { getToken, isSignedIn } = useAuth();
const navigate = useNavigate();

const handleLoginRedirect = async () => {
  if (isSignedIn) {
    const token = await getToken();
    if (token) {
      localStorage.setItem("token", token); // Store for axiosInstance
       
    }
  }  
};
