import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Card, CardContent, Typography, Box, Grid, Divider, Chip } from '@mui/material';
import { PersonOutline, MailOutline, SecurityOutlined, CalendarTodayOutlined } from '@mui/icons-material';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box className="animate-fade-in">
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} style={{ letterSpacing: -1, fontFamily: 'Inter' }}>
          My Consulting Profile
        </Typography>
        <Typography variant="subtitle2" color="var(--text-secondary)">
          Review your advisor authorization tier, profile coordinates, and platform settings.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent style={{ padding: '32px' }}>
              {/* Profile Card Header */}
              <Box display="flex" alignItems="center" gap={3} mb={4}>
                <Box
                  width={64}
                  height={64}
                  borderRadius="50%"
                  bgcolor="var(--primary-color)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="#fff"
                  fontSize={24}
                  fontWeight={800}
                >
                  {user?.first_name[0] || 'A'}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} style={{ fontFamily: 'Inter' }}>
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Chip
                    label={user?.role.toUpperCase()}
                    color="primary"
                    size="small"
                    style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}
                  />
                </Box>
              </Box>

              <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 24 }} />

              {/* Profile Details List */}
              <Box display="flex" flexDirection="column" gap={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <PersonOutline color="action" />
                  <Box>
                    <Typography variant="caption" color="var(--text-muted)" fontWeight={600} display="block">
                      Account Username
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {user?.username}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <MailOutline color="action" />
                  <Box>
                    <Typography variant="caption" color="var(--text-muted)" fontWeight={600} display="block">
                      Email Coordinates
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <SecurityOutlined color="action" />
                  <Box>
                    <Typography variant="caption" color="var(--text-muted)" fontWeight={600} display="block">
                      Authorization Class
                    </Typography>
                    <Typography variant="body2" fontWeight={700} style={{ textTransform: 'capitalize' }}>
                      {user?.role} Tier
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarTodayOutlined color="action" />
                  <Box>
                    <Typography variant="caption" color="var(--text-muted)" fontWeight={600} display="block">
                      Member Joined Since
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {user && user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Active Member'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
