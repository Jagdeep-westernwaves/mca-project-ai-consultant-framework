import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Typography, Box, Divider, Chip } from '@mui/material';
import { PersonOutline, MailOutline, SecurityOutlined, CalendarTodayOutlined, FingerprintOutlined } from '@mui/icons-material';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box className="animate-fade-in" style={{ padding: '0 24px 40px 24px' }}>
      <Box mb={4} className="bento-tile" style={{ padding: '24px 32px' }}>
        <Typography variant="h3" fontWeight={900} className="neon-text" style={{ letterSpacing: -1 }}>
          IDENTITY PROTOCOL
        </Typography>
        <Typography variant="overline" style={{ color: 'var(--text-secondary)', letterSpacing: 3, fontWeight: 800 }}>
          REVIEW ADVISOR AUTHORIZATION TIER AND SYSTEM COORDINATES
        </Typography>
      </Box>

      <Box className="bento-grid">
        <Box className="bento-tile" style={{ gridColumn: 'span 12', padding: '32px' }}>
          {/* Profile Card Header */}
          <Box display="flex" alignItems="center" gap={4} mb={5}>
            <Box
              width={80}
              height={80}
              borderRadius={3}
              bgcolor="rgba(59,130,246,0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="#3b82f6"
              fontSize={32}
              fontWeight={900}
              border="1px solid rgba(59,130,246,0.3)"
              style={{ boxShadow: '0 0 20px rgba(59,130,246,0.2)' }}
            >
              {user?.first_name[0] || 'A'}
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={900} style={{ fontFamily: 'var(--font-primary)', letterSpacing: -0.5, color: 'var(--text-primary)' }}>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                <FingerprintOutlined style={{ color: 'var(--text-muted)', fontSize: 18 }} />
                <Typography variant="caption" style={{ fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: 2 }}>
                  ID-{user?.id || '0000'}
                </Typography>
                <Chip
                  label={`${(user?.role || 'operator').toUpperCase()} TIER`}
                  size="small"
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 1,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    border: '1px solid rgba(59,130,246,0.3)'
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 32 }} />

          {/* Profile Details List */}
          <Box display="flex" flexDirection="column" gap={4}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box p={1.5} borderRadius={2} style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <PersonOutline style={{ color: '#94a3b8' }} />
              </Box>
              <Box>
                <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>
                  ACCOUNT USERNAME
                </Typography>
                <Typography variant="body1" fontWeight={800} style={{ color: 'var(--text-primary)', letterSpacing: 0.5 }}>
                  {user?.username}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
              <Box p={1.5} borderRadius={2} style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <MailOutline style={{ color: '#94a3b8' }} />
              </Box>
              <Box>
                <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>
                  EMAIL COORDINATES
                </Typography>
                <Typography variant="body1" fontWeight={800} style={{ color: 'var(--text-primary)', letterSpacing: 0.5 }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
              <Box p={1.5} borderRadius={2} style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <SecurityOutlined style={{ color: '#94a3b8' }} />
              </Box>
              <Box>
                <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>
                  AUTHORIZATION CLASS
                </Typography>
                <Typography variant="body1" fontWeight={800} style={{ textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: 1 }}>
                  {user?.role} CLEARANCE
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
              <Box p={1.5} borderRadius={2} style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CalendarTodayOutlined style={{ color: '#94a3b8' }} />
              </Box>
              <Box>
                <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>
                  MEMBER JOINED SINCE
                </Typography>
                <Typography variant="body1" fontWeight={800} style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: 16 }}>
                  {user && user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'ACTIVE'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
