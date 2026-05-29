import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loginUser } from '../store/authSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Paper, Typography, TextField, Button, Alert, Grid, Card, CardActionArea } from '@mui/material';
import { LockOutlined, AccountCircleOutlined } from '@mui/icons-material';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Validation Schema
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Password must exceed 5 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        navigate('/');
      } catch (err) {
        // Handled by Redux auth state error
      }
    },
  });

  const triggerQuickLogin = (user: string, pass: string) => {
    formik.setFieldValue('username', user);
    formik.setFieldValue('password', pass);
  };

  const demoAccounts = [
    { role: 'Admin', user: 'admin', pass: 'adminpassword123', color: '#ec4899' },
    { role: 'Consultant', user: 'consultant', pass: 'consultant123', color: '#3b82f6' },
    { role: 'Client', user: 'client_user', pass: 'client123', color: '#10b981' }
  ];

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="var(--bg-primary)"
      position="relative"
      overflow="hidden"
      p={3}
    >
      {/* Background ambient glows */}
      <div className="glowing-bg" style={{ top: '20%', left: '20%' }} />
      <div className="glowing-bg" style={{ bottom: '20%', right: '20%' }} />

      <Paper
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid var(--border-glass)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <Typography variant="h5" fontWeight={800} color="var(--primary-color)" style={{ letterSpacing: -0.8 }}>
          AIMCF Portal
        </Typography>
        <Typography variant="body2" color="var(--text-secondary)" mb={4}>
          Management Consulting Platform
        </Typography>

        {error && (
          <Alert severity="error" style={{ width: '100%', marginBottom: 20, borderRadius: 8 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} width="100%" display="flex" flexDirection="column" gap={2.5}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            variant="outlined"
            size="small"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            InputProps={{
              startAdornment: <AccountCircleOutlined color="action" style={{ marginRight: 8, fontSize: 20 }} />,
              style: { fontFamily: 'Inter' }
            }}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: <LockOutlined color="action" style={{ marginRight: 8, fontSize: 20 }} />,
              style: { fontFamily: 'Inter' }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            style={{
              padding: '10px 0',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 16px 0 rgba(59,130,246,0.3)',
              borderRadius: 8
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" color="var(--text-secondary)" mt={3}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
            Register here
          </Link>
        </Typography>

        {/* Demo Accounts Panel */}
        <Box width="100%" mt={4} pt={3} style={{ borderTop: '1px solid var(--border-glass)' }}>
          <Typography variant="caption" color="var(--text-muted)" fontWeight={700} display="block" mb={1.5} style={{ textTransform: 'uppercase' }}>
            Quick Demo Logins (Click to Populate)
          </Typography>
          <Grid container spacing={1}>
            {demoAccounts.map((account) => (
              <Grid item xs={4} key={account.role}>
                <Card style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                  <CardActionArea 
                    onClick={() => triggerQuickLogin(account.user, account.pass)}
                    style={{ padding: 8, textAlign: 'center' }}
                  >
                    <Typography variant="caption" fontWeight={700} style={{ color: account.color, fontSize: 10 }}>
                      {account.role}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
