import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/authSlice';
import { useThemeContext } from '../context/ThemeContext';
import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import {
  DashboardOutlined,
  AnalyticsOutlined,
  PeopleOutlined,
  AssignmentOutlined,
  DescriptionOutlined,
  SettingsOutlined,
  PersonOutline,
  LogoutOutlined,
  LightModeOutlined,
  DarkModeOutlined
} from '@mui/icons-material';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode, toggleTheme } = useThemeContext();

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
      width={280}
      minHeight="100vh"
      p={3}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRight="1px solid var(--border-glass)"
      bgcolor="var(--bg-glass)"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 10 }}
    >
      {/* Brand Header */}
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight={800} letterSpacing={-0.5} color="var(--primary-color)">
              AIMCF
            </Typography>
            <Typography variant="caption" color="var(--text-muted)" fontWeight={600}>
              Consulting Engine v1.0
            </Typography>
          </Box>
          <IconButton onClick={toggleTheme} color="primary" size="small" style={{ border: '1px solid var(--border-glass)' }}>
            {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
          </IconButton>
        </Box>

        {/* Navigation links */}
        <Box display="flex" flexDirection="column" gap={0.5}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
                border: isActive ? '1px solid var(--primary-color)' : '1px solid transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
              })}
            >
              {item.icon}
              <Typography variant="body2" style={{ fontFamily: 'Inter' }}>
                {item.label}
              </Typography>
            </NavLink>
          ))}
        </Box>
      </Box>

      {/* User profile card & Logout */}
      <Box display="flex" flexDirection="column" gap={2} pt={3} style={{ borderTop: '1px solid var(--border-glass)' }}>
        {user && (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              width={40}
              height={40}
              borderRadius="50%"
              bgcolor="var(--primary-color)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#fff"
              fontWeight={700}
            >
              {user.first_name[0] || user.username[0].toUpperCase()}
            </Box>
            <Box overflow="hidden">
              <Typography variant="subtitle2" fontWeight={700} noWrap>
                {user.first_name} {user.last_name}
              </Typography>
              <Chip
                label={user.role.toUpperCase()}
                size="small"
                color={user.role === 'admin' ? 'secondary' : user.role === 'consultant' ? 'primary' : 'default'}
                style={{ fontSize: 9, height: 18, marginTop: 4, fontWeight: 700 }}
              />
            </Box>
          </Box>
        )}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutOutlined />}
          onClick={handleLogout}
          size="small"
          style={{ borderRadius: 8, borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
