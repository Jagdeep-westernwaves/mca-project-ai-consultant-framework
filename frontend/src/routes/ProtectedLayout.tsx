import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadUserProfile } from '../store/authSlice';
import { Box, CircularProgress } from '@mui/material';
import Sidebar from '../components/Sidebar';

const ProtectedLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(loadUserProfile());
    }
  }, [accessToken, user, dispatch]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (loading || (accessToken && !user)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="var(--bg-primary)">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box display="flex" minHeight="100vh" bgcolor="var(--bg-primary)" position="relative" overflow="hidden">
      {/* Background ambient glows */}
      <div className="glowing-bg" style={{ top: '-10%', left: '-10%', opacity: 0.5 }} />
      <div className="glowing-bg" style={{ bottom: '-15%', right: '-10%', opacity: 0.3 }} />
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <Box component="main" flexGrow={1} p={4} overflow="auto" position="relative" zIndex={1}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
