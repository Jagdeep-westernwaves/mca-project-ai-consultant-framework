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
      <Box className="bento-tile" style={{ width: '100%', maxWidth: 500, padding: 40, border: '1px solid var(--border-glass)', backgroundColor: 'var(--bg-secondary)' }}>
        <Typography variant="h3" fontWeight={900} className="neon-text" mb={1} align="center" style={{ letterSpacing: -1 }}>
          SECURE GATEWAY
        </Typography>
        <Typography variant="overline" color="var(--text-secondary)" mb={4} align="center" display="block" style={{ letterSpacing: 3, fontWeight: 800 }}>
          SYSTEM AUTHENTICATION REQUIRED
        </Typography>

        {error && (
          <Alert severity="error" style={{ width: '100%', marginBottom: 20, borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} width="100%" display="flex" flexDirection="column" gap={3}>
          <TextField
            fullWidth
            id="username"
            name="username"
            placeholder="ENTER IDENTITY"
            variant="standard"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            InputProps={{
              startAdornment: <AccountCircleOutlined color="action" style={{ marginRight: 12, fontSize: 24, color: '#3b82f6' }} />,
              style: { fontFamily: 'var(--font-primary)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 8 }
            }}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            placeholder="ENTER PASSCODE"
            type="password"
            variant="standard"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: <LockOutlined color="action" style={{ marginRight: 12, fontSize: 24, color: '#3b82f6' }} />,
              style: { fontFamily: 'var(--font-primary)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 8 }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            style={{
              marginTop: 16,
              padding: '16px 0',
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 2,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: '0 0 20px rgba(59,130,246,0.4)',
              borderRadius: 12
            }}
          >
            {loading ? 'UPLINKING...' : 'INITIALIZE LINK'}
          </Button>
        </Box>

        <Typography variant="body2" color="var(--text-secondary)" mt={4} align="center">
          NO ACCESS CLEARANCE?{' '}
          <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 800 }}>
            REQUEST PROVISIONING
          </Link>
        </Typography>

        {/* Demo Accounts Panel */}
        <Box width="100%" mt={5} pt={4} style={{ borderTop: '1px solid var(--border-glass)' }}>
          <Typography variant="caption" color="var(--text-muted)" fontWeight={800} display="block" mb={2} align="center" style={{ letterSpacing: 2 }}>
            OVERRIDE CODES (DEMO)
          </Typography>
          <Grid container spacing={1.5}>
            {demoAccounts.map((account) => (
              <Grid item xs={4} key={account.role}>
                <Card style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 8 }}>
                  <CardActionArea 
                    onClick={() => triggerQuickLogin(account.user, account.pass)}
                    style={{ padding: 12, textAlign: 'center' }}
                  >
                    <Typography variant="caption" fontWeight={900} style={{ color: account.color, fontSize: 11, letterSpacing: 1 }}>
                      {account.role}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
