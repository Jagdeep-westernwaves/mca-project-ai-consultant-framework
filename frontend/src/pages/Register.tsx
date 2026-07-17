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
      <Box className="bento-tile" style={{ width: '100%', maxWidth: 500, padding: 40, border: '1px solid var(--border-glass)', backgroundColor: 'var(--bg-secondary)' }}>
        <Typography variant="h3" fontWeight={900} className="neon-text" mb={1} align="center" style={{ letterSpacing: -1 }}>
          PROVISIONING
        </Typography>
        <Typography variant="overline" color="var(--text-secondary)" mb={4} align="center" display="block" style={{ letterSpacing: 3, fontWeight: 800 }}>
          NEW IDENTITY REGISTRATION
        </Typography>

        {authError && (
          <Alert severity="error" style={{ width: '100%', marginBottom: 20, borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {authError}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" style={{ width: '100%', marginBottom: 20, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} width="100%" display="flex" flexDirection="column" gap={3}>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              id="first_name"
              name="first_name"
              placeholder="FIRST NAME"
              variant="standard"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              error={formik.touched.first_name && Boolean(formik.errors.first_name)}
              helperText={formik.touched.first_name && formik.errors.first_name}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 4 } }}
            />
            <TextField
              fullWidth
              id="last_name"
              name="last_name"
              placeholder="LAST NAME"
              variant="standard"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              error={formik.touched.last_name && Boolean(formik.errors.last_name)}
              helperText={formik.touched.last_name && formik.errors.last_name}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 4 } }}
            />
          </Box>

          <TextField
            fullWidth
            id="username"
            name="username"
            placeholder="SYSTEM IDENTITY (USERNAME)"
            variant="standard"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            InputProps={{
              startAdornment: <AccountCircleOutlined color="action" style={{ marginRight: 12, fontSize: 24, color: '#3b82f6' }} />,
              style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 4 }
            }}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            placeholder="COMMUNICATION NODE (EMAIL)"
            variant="standard"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: <EmailOutlined color="action" style={{ marginRight: 12, fontSize: 24, color: '#3b82f6' }} />,
              style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 4 }
            }}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            placeholder="ENCRYPTION KEY (PASSWORD)"
            type="password"
            variant="standard"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: <LockOutlined color="action" style={{ marginRight: 12, fontSize: 24, color: '#3b82f6' }} />,
              style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 4 }
            }}
          />

          <TextField
            fullWidth
            select
            id="role"
            name="role"
            label="Clearance Level"
            variant="standard"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
            InputProps={{
              startAdornment: <BadgeOutlined color="action" style={{ marginRight: 12, fontSize: 24, color: '#3b82f6' }} />,
              style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 4 }
            }}
          >
            <MenuItem value="consultant">CONSULTANT OP</MenuItem>
            <MenuItem value="client">CLIENT NODE</MenuItem>
          </TextField>

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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 0 20px rgba(16,185,129,0.4)',
              borderRadius: 12
            }}
          >
            {loading ? 'PROVISIONING...' : 'INITIALIZE IDENTITY'}
          </Button>
        </Box>

        <Typography variant="body2" color="var(--text-secondary)" mt={4} align="center">
          CLEARANCE ALREADY ESTABLISHED?{' '}
          <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 800 }}>
            ACCESS GATEWAY
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
