import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { logout } from '../store/authSlice';
import { Box, Typography, Button } from '@mui/material';
import {
  DashboardOutlined,
  AnalyticsOutlined,
  PeopleOutlined,
  AssignmentOutlined,
  DescriptionOutlined,
  SettingsOutlined,
  PersonOutline,
  LogoutOutlined
} from '@mui/icons-material';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
    { label: 'Analytics & Sim', path: '/analytics', icon: <AnalyticsOutlined /> },
    { label: 'Clients', path: '/clients', icon: <PeopleOutlined /> },
    { label: 'Projects', path: '/projects', icon: <AssignmentOutlined /> },
    { label: 'Advisory Reports', path: '/reports', icon: <DescriptionOutlined /> },
    { label: 'System Logs', path: '/settings', icon: <SettingsOutlined /> },
    { label: 'My Profile', path: '/profile', icon: <PersonOutline /> },
  ];

  return (
    <Box
      width={260}
      p={2.5}
      display={{ xs: 'none', md: 'flex' }}
      flexDirection="column"
      justifyContent="space-between"
      className="glass-panel"
      style={{
        height: 'calc(100vh - 100px)',
        position: 'sticky',
        top: '84px',
        border: '1px solid var(--border-glass)',
      }}
    >
      <Box>
        <Typography variant="overline" fontWeight={700} color="var(--text-muted)" mb={2} display="block">
          MAIN MENU
        </Typography>
        
        {/* Navigation links */}
        <Box display="flex" flexDirection="column" gap={1}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.2s ease',
              })}
            >
              {React.cloneElement(item.icon, { fontSize: 'small', style: { color: 'inherit' } })}
              <Typography variant="body2" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.9rem', color: 'inherit' }}>
                {item.label}
              </Typography>
            </NavLink>
          ))}
        </Box>
      </Box>

      {/* Logout */}
      <Box display="flex" flexDirection="column" pt={3}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutOutlined />}
          onClick={handleLogout}
          size="medium"
          style={{ 
            borderRadius: 12, 
            borderColor: 'var(--border-glass)',
            color: 'var(--text-secondary)',
            textTransform: 'none',
            fontWeight: 600,
            justifyContent: 'flex-start',
            padding: '10px 16px'
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
