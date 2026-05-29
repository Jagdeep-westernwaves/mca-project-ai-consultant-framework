import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { registerUser } from '../store/authSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Paper, Typography, TextField, Button, MenuItem, Alert } from '@mui/material';
import { AccountCircleOutlined, EmailOutlined, LockOutlined, BadgeOutlined } from '@mui/icons-material';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error: authError } = useSelector((state: RootState) => state.auth);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Validation Schema
  const validationSchema = Yup.object({
    username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
    email: Yup.string().email('Provide a valid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must exceed 5 characters').required('Password is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    role: Yup.string().oneOf(['consultant', 'client'], 'Invalid role').required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'consultant',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(registerUser(values)).unwrap();
        setSuccessMsg("Registration complete! Redirecting to login portal...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        // Handled by Redux auth state error
      }
    },
  });

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
      <div className="glowing-bg" style={{ top: '15%', left: '15%' }} />
      <div className="glowing-bg" style={{ bottom: '15%', right: '15%' }} />

      <Paper
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 480,
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
          Create Account
        </Typography>
        <Typography variant="body2" color="var(--text-secondary)" mb={4}>
          Join the AI-Integrated Consulting Portal
        </Typography>

        {authError && (
          <Alert severity="error" style={{ width: '100%', marginBottom: 20, borderRadius: 8 }}>
            {authError}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" style={{ width: '100%', marginBottom: 20, borderRadius: 8 }}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} width="100%" display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              id="first_name"
              name="first_name"
              label="First Name"
              variant="outlined"
              size="small"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              error={formik.touched.first_name && Boolean(formik.errors.first_name)}
              helperText={formik.touched.first_name && formik.errors.first_name}
              InputProps={{ style: { fontFamily: 'Inter' } }}
            />
            <TextField
              fullWidth
              id="last_name"
              name="last_name"
              label="Last Name"
              variant="outlined"
              size="small"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              error={formik.touched.last_name && Boolean(formik.errors.last_name)}
              helperText={formik.touched.last_name && formik.errors.last_name}
              InputProps={{ style: { fontFamily: 'Inter' } }}
            />
          </Box>

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
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            size="small"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: <EmailOutlined color="action" style={{ marginRight: 8, fontSize: 20 }} />,
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

          <TextField
            fullWidth
            select
            id="role"
            name="role"
            label="Register As"
            variant="outlined"
            size="small"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            InputProps={{
              startAdornment: <BadgeOutlined color="action" style={{ marginRight: 8, fontSize: 20 }} />,
              style: { fontFamily: 'Inter' }
            }}
          >
            <MenuItem value="consultant">Consultant</MenuItem>
            <MenuItem value="client">Client Representative</MenuItem>
          </TextField>

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
              borderRadius: 8,
              marginTop: 10
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" color="var(--text-secondary)" mt={3}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
            Login here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
