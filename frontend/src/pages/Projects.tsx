import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createProject, fetchProjects, fetchClients } from '../store/consultingSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Typography, Box, TextField, Button, MenuItem, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { PlaylistAddOutlined } from '@mui/icons-material';

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, clients } = useSelector((state: RootState) => state.consulting);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchClients());
  }, [dispatch]);

  // Project Creation Validation
  const validationSchema = Yup.object({
    client: Yup.number().required('Target client is required'),
    name: Yup.string().required('Project name is required'),
    description: Yup.string().required('Description is required'),
    status: Yup.string().oneOf(['planning', 'active', 'on_hold', 'completed']).required('Status is required'),
    start_date: Yup.date().required('Start date is required'),
    end_date: Yup.date().required('End date is required'),
    budget: Yup.number().positive('Budget must be positive').required('Budget is required'),
  });

  const formik = useFormik({
    initialValues: {
      client: '',
      name: '',
      description: '',
      status: 'planning',
      start_date: '',
      end_date: '',
      budget: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(createProject({
          client: Number(values.client),
          name: values.name,
          description: values.description,
          status: values.status as any,
          start_date: values.start_date,
          end_date: values.end_date,
          budget: parseFloat(values.budget),
        })).unwrap();
        resetForm();
      } catch (err) {
        // Handled by state
      }
    },
  });

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'active': return '#3b82f6';
      case 'on_hold': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <Box className="animate-fade-in" style={{ padding: '0 24px' }}>
      <Box mb={4} className="bento-tile" style={{ padding: '24px 32px' }}>
        <Typography variant="h3" fontWeight={900} className="neon-text" style={{ letterSpacing: -1 }}>
          SPRINT LOGS
        </Typography>
        <Typography variant="overline" style={{ color: 'var(--text-secondary)', letterSpacing: 3, fontWeight: 800 }}>
          PROJECT OPERATIONS AND MILESTONES
        </Typography>
      </Box>

      <Box className="bento-grid">
        {/* Create Project Panel */}
        <Box className="bento-tile" style={{ gridColumn: 'span 4' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <PlaylistAddOutlined style={{ color: '#3b82f6', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={900} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              INITIALIZE SPRINT
            </Typography>
          </Box>

          <Box component="form" onSubmit={formik.handleSubmit} display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              select
              id="client"
              name="client"
              label="TARGET CLIENT NODE"
              variant="standard"
              value={formik.values.client}
              onChange={formik.handleChange}
              error={formik.touched.client && Boolean(formik.errors.client)}
              helperText={formik.touched.client && formik.errors.client}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            >
              {clients.map(c => (
                <MenuItem key={c.id} value={c.id} style={{ fontWeight: 800 }}>{c.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              id="name"
              name="name"
              placeholder="SPRINT DESIGNATION"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              placeholder="OPERATIONAL DIRECTIVE"
              multiline
              rows={2}
              variant="standard"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' } }}
            />

            <TextField
              fullWidth
              select
              id="status"
              name="status"
              label="CURRENT STATUS"
              variant="standard"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            >
              <MenuItem value="planning" style={{ fontWeight: 800 }}>PLANNING PHASE</MenuItem>
              <MenuItem value="active" style={{ fontWeight: 800 }}>ACTIVE DEPLOYMENT</MenuItem>
              <MenuItem value="on_hold" style={{ fontWeight: 800 }}>HALTED / STANDBY</MenuItem>
              <MenuItem value="completed" style={{ fontWeight: 800 }}>MISSION COMPLETE</MenuItem>
            </TextField>

            <TextField
              fullWidth
              id="budget"
              name="budget"
              placeholder="STRATEGIC BUDGET ($)"
              type="number"
              variant="standard"
              value={formik.values.budget}
              onChange={formik.handleChange}
              error={formik.touched.budget && Boolean(formik.errors.budget)}
              helperText={formik.touched.budget && formik.errors.budget}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            />

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                id="start_date"
                name="start_date"
                label="START TICK"
                type="date"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                value={formik.values.start_date}
                onChange={formik.handleChange}
                error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                helperText={formik.touched.start_date && formik.errors.start_date}
                InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' } }}
              />
              <TextField
                fullWidth
                id="end_date"
                name="end_date"
                label="END TICK"
                type="date"
                variant="standard"
                InputLabelProps={{ shrink: true }}
                value={formik.values.end_date}
                onChange={formik.handleChange}
                error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                helperText={formik.touched.end_date && formik.errors.end_date}
                InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' } }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                marginTop: 8,
                padding: '16px 0',
                fontWeight: 900,
                letterSpacing: 2,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 0 20px rgba(59,130,246,0.5)'
              }}
            >
              LAUNCH SPRINT
            </Button>
          </Box>
        </Box>

        {/* Projects Listing Table */}
        <Box className="bento-tile" style={{ gridColumn: 'span 8', padding: 0, overflow: 'hidden' }}>
          <TableContainer style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <TableRow>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>SPRINT OP</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>NODE</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>STATUS</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }} align="right">BUDGET</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>TIMELINE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((proj) => (
                  <TableRow key={proj.id} hover style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', maxWidth: 220, borderBottom: 'none' }}>
                      <Typography variant="subtitle2" fontWeight={800} color='var(--text-primary)'>{proj.name}</Typography>
                      <Typography variant="caption" color="var(--text-secondary)" noWrap display="block" style={{ fontSize: 11, fontWeight: 600 }}>
                        {proj.description}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, color: 'var(--text-primary)', borderBottom: 'none' }}>{proj.client_detail?.name || 'STANDARD NODE'}</TableCell>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Chip
                        label={proj.status.toUpperCase()}
                        size="small"
                        style={{
                          fontFamily: 'var(--font-primary)',
                          fontSize: 10,
                          fontWeight: 900,
                          backgroundColor: `${getStatusChipColor(proj.status)}20`,
                          color: getStatusChipColor(proj.status),
                          border: `1px solid ${getStatusChipColor(proj.status)}50`,
                          letterSpacing: 1
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, color: '#10b981', borderBottom: 'none' }} align="right">
                      ${(proj.budget / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', borderBottom: 'none' }}>
                      {proj.start_date} / {proj.end_date}
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" style={{ padding: '60px 0', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 2, borderBottom: 'none' }}>
                      NO ACTIVE SPRINTS FOUND
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Projects;
