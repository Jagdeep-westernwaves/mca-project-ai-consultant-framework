import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadUserProfile } from '../store/authSlice';
import { Box, CircularProgress, Typography, IconButton, Chip } from '@mui/material';
import { LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import { useThemeContext } from '../context/ThemeContext';

const ProtectedLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, user, loading } = useSelector((state: RootState) => state.auth);
  const { mode, toggleTheme } = useThemeContext();

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
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="var(--bg-primary)" position="relative" overflow="hidden">
      {/* Background ambient glows */}
      <div className="glowing-bg" style={{ top: '-10%', left: '-10%', opacity: 0.5 }} />
      <div className="glowing-bg" style={{ bottom: '-15%', right: '-10%', opacity: 0.3 }} />
      
      {/* Top Header Navigation */}
      <Box 
        component="header" 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        px={4} 
        py={2}
        position="sticky"
        top={0}
        zIndex={20}
        sx={{
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-glass)',
          backgroundColor: 'var(--bg-glass)'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" justifyContent="center" width={40} height={40} borderRadius={2} bgcolor="var(--primary-color)" color="#fff">
            <Typography variant="h6" fontWeight={800} style={{ fontFamily: 'Outfit' }}>AI</Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight={800} letterSpacing={-0.5} color="var(--text-primary)">
              AIMCF
            </Typography>
            <Typography variant="caption" color="var(--text-muted)" fontWeight={600}>
              Consulting Engine v1.0
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" gap={3}>
          <IconButton onClick={toggleTheme} color="primary" size="small" style={{ border: '1px solid var(--border-glass)' }}>
            {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
          </IconButton>
          
          {user && (
            <Box display="flex" alignItems="center" gap={1.5} pl={3} borderLeft="1px solid var(--border-glass)">
              <Box textAlign="right" display={{ xs: 'none', sm: 'block' }}>
                <Typography variant="subtitle2" fontWeight={700} color="var(--text-primary)">
                  {user.first_name} {user.last_name}
                </Typography>
                <Chip
                  label={user.role.toUpperCase()}
                  size="small"
                  color={user.role === 'admin' ? 'secondary' : user.role === 'consultant' ? 'primary' : 'default'}
                  style={{ fontSize: 9, height: 18, fontWeight: 700 }}
                />
              </Box>
              <Box
                width={40}
                height={40}
                borderRadius="50%"
                bgcolor="var(--primary-glow)"
                border="1px solid var(--primary-color)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="var(--primary-color)"
                fontWeight={800}
              >
                {user.first_name[0] || user.username[0].toUpperCase()}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Main Body */}
      <Box display="flex" flexGrow={1} position="relative" zIndex={10} p={3} gap={3}>
        <Sidebar />

        {/* Main Content Pane */}
        <Box component="main" flexGrow={1} overflow="auto" borderRadius="16px">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
