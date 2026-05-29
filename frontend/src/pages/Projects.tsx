import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createProject, fetchProjects, fetchClients } from '../store/consultingSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Grid, Card, CardContent, Typography, Box, TextField, Button, MenuItem, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip
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
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'on_hold': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box className="animate-fade-in">
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} style={{ letterSpacing: -1, fontFamily: 'Inter' }}>
          Consulting Projects Sprints
        </Typography>
        <Typography variant="subtitle2" color="var(--text-secondary)">
          Organize client milestones, assign sprint tasks, track target budgets, and manage timeline operations.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Create Project Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                <PlaylistAddOutlined color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Launch Consulting Project
                </Typography>
              </Box>

              <Box component="form" onSubmit={formik.handleSubmit} display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  select
                  id="client"
                  name="client"
                  label="Target Client"
                  variant="outlined"
                  size="small"
                  value={formik.values.client}
                  onChange={formik.handleChange}
                  error={formik.touched.client && Boolean(formik.errors.client)}
                  helperText={formik.touched.client && formik.errors.client}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                >
                  {clients.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Project Sprint Name"
                  variant="outlined"
                  size="small"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                />

                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Project Scope / Goal"
                  multiline
                  rows={2}
                  variant="outlined"
                  size="small"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                />

                <TextField
                  fullWidth
                  select
                  id="status"
                  name="status"
                  label="Current Status"
                  variant="outlined"
                  size="small"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  id="budget"
                  name="budget"
                  label="Strategic Budget ($)"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formik.values.budget}
                  onChange={formik.handleChange}
                  error={formik.touched.budget && Boolean(formik.errors.budget)}
                  helperText={formik.touched.budget && formik.errors.budget}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                />

                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    id="start_date"
                    name="start_date"
                    label="Start Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.start_date}
                    onChange={formik.handleChange}
                    error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                    helperText={formik.touched.start_date && formik.errors.start_date}
                    InputProps={{ style: { fontFamily: 'Inter' } }}
                  />
                  <TextField
                    fullWidth
                    id="end_date"
                    name="end_date"
                    label="Target End Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.end_date}
                    onChange={formik.handleChange}
                    error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                    helperText={formik.touched.end_date && formik.errors.end_date}
                    InputProps={{ style: { fontFamily: 'Inter' } }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{
                    padding: '10px 0',
                    fontWeight: 700,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  }}
                >
                  Launch Project
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Projects Listing Table */}
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} style={{ backgroundColor: 'var(--bg-secondary)', backdropFilter: 'blur(12px)' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                <TableRow>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Project Sprint</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Client Account</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Status</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }} align="right">Strategic Budget</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Active Timeline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((proj) => (
                  <TableRow key={proj.id} hover>
                    <TableCell style={{ fontFamily: 'Inter', maxWidth: 220 }}>
                      <Typography variant="subtitle2" fontWeight={700}>{proj.name}</Typography>
                      <Typography variant="caption" color="var(--text-secondary)" noWrap display="block" style={{ fontSize: 11 }}>
                        {proj.description}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter', fontWeight: 600 }}>{proj.client_detail?.name || 'Standard Client'}</TableCell>
                    <TableCell>
                      <Chip
                        label={proj.status.toUpperCase()}
                        size="small"
                        color={getStatusChipColor(proj.status)}
                        style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter' }} align="right">
                      ${(proj.budget / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-secondary)' }}>
                      {proj.start_date} to {proj.end_date}
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" style={{ padding: '40px 0', color: 'var(--text-muted)' }}>
                      No project sprints registered. Launch your first project above!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Projects;
