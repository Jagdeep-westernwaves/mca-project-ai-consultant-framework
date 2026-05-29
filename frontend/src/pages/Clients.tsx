import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createClient, fetchClients } from '../store/consultingSlice';
import api from '../utils/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Grid, Card, CardContent, Typography, Box, TextField, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Alert, MenuItem
} from '@mui/material';
import { AddBusinessOutlined, UploadFileOutlined, CheckCircleOutline } from '@mui/icons-material';

const Clients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients } = useSelector((state: RootState) => state.consulting);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);
  const [uploadClient, setUploadClient] = useState<number | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<any | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Client Creation Formik
  const validationSchema = Yup.object({
    name: Yup.string().required('Client company name is required'),
    industry: Yup.string().required('Industry is required'),
    annual_revenue: Yup.number().positive('Revenue must be positive').required('Revenue is required'),
    employee_count: Yup.number().integer().positive('Employee count must be positive').required('Employees count is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      industry: '',
      annual_revenue: '',
      employee_count: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(createClient({
          name: values.name,
          industry: values.industry,
          annual_revenue: parseFloat(values.annual_revenue),
          employee_count: parseInt(values.employee_count),
        })).unwrap();
        resetForm();
      } catch (err) {
        // Handled by state error
      }
    },
  });

  // Handle Drag & Drop File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus(null);
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadClient || !selectedFile) {
      setUploadError("Please select a target client and a file to parse.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('client', uploadClient.toString());
    formData.append('file_path', selectedFile);

    try {
      // Direct post to data engine upload endpoint
      const response = await api.post('/data/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus(response.data.analysis_summary);
      setSelectedFile(null);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Failed to upload and parse the file.';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box className="animate-fade-in">
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} style={{ letterSpacing: -1, fontFamily: 'Inter' }}>
          Client Portfolio Management
        </Typography>
        <Typography variant="subtitle2" color="var(--text-secondary)">
          Track registered client company profiles, register accounts, and upload CSV/Excel/PDF business datasets.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Create Client Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                <AddBusinessOutlined color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Register Client Company
                </Typography>
              </Box>

              <Box component="form" onSubmit={formik.handleSubmit} display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Company Name"
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
                  id="industry"
                  name="industry"
                  label="Industry"
                  variant="outlined"
                  size="small"
                  value={formik.values.industry}
                  onChange={formik.handleChange}
                  error={formik.touched.industry && Boolean(formik.errors.industry)}
                  helperText={formik.touched.industry && formik.errors.industry}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                />
                <TextField
                  fullWidth
                  id="annual_revenue"
                  name="annual_revenue"
                  label="Annual Revenue ($)"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formik.values.annual_revenue}
                  onChange={formik.handleChange}
                  error={formik.touched.annual_revenue && Boolean(formik.errors.annual_revenue)}
                  helperText={formik.touched.annual_revenue && formik.errors.annual_revenue}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                />
                <TextField
                  fullWidth
                  id="employee_count"
                  name="employee_count"
                  label="Employee Count"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={formik.values.employee_count}
                  onChange={formik.handleChange}
                  error={formik.touched.employee_count && Boolean(formik.errors.employee_count)}
                  helperText={formik.touched.employee_count && formik.errors.employee_count}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                />
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
                  Create Client
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Data Upload Systems Widget */}
          <Card style={{ marginTop: 24 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                <UploadFileOutlined color="secondary" />
                <Typography variant="h6" fontWeight={700}>
                  Consulting Data Upload
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleUploadSubmit} display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  select
                  id="upload-client"
                  label="Target Client Account"
                  variant="outlined"
                  size="small"
                  value={uploadClient}
                  onChange={(e) => setUploadClient(Number(e.target.value))}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                >
                  {clients.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>

                {/* Upload drag block */}
                <Box
                  p={3}
                  border="2px dashed var(--border-glass)"
                  borderRadius="12px"
                  textAlign="center"
                  bgcolor="rgba(255,255,255,0.01)"
                  position="relative"
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="file"
                    accept=".csv,.xlsx,.pdf,.json"
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      top: 0,left: 0, width: '100%', height: '100%',
                      cursor: 'pointer'
                    }}
                    onChange={handleFileChange}
                  />
                  <UploadFileOutlined color="disabled" style={{ fontSize: 32, marginBottom: 8 }} />
                  <Typography variant="caption" display="block" color="var(--text-secondary)">
                    {selectedFile ? selectedFile.name : "Drag & Drop CSV, Excel, JSON or PDF"}
                  </Typography>
                </Box>

                {uploadError && <Alert severity="error" style={{ fontSize: 11, padding: '0 8px', borderRadius: 8 }}>{uploadError}</Alert>}

                <Button
                  type="submit"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  disabled={isUploading || !selectedFile || !uploadClient}
                  style={{ fontWeight: 700, borderRadius: 8 }}
                >
                  {isUploading ? 'Parsing & Cleaning...' : 'Parse File'}
                </Button>
              </Box>

              {/* Parsing Results Overlay */}
              {uploadStatus && (
                <Box mt={3} p={2} bgcolor="var(--primary-glow)" borderRadius="12px" border="1px solid var(--primary-color)">
                  <Box display="flex" alignItems="center" gap={1} mb={1} color="var(--primary-color)">
                    <CheckCircleOutline fontSize="small" />
                    <Typography variant="subtitle2" fontWeight={700}>
                      AI Parsing Completed
                    </Typography>
                  </Box>
                  <Typography variant="caption" display="block" color="var(--text-primary)">
                    * <b>Parsed Rows:</b> {uploadStatus.cleaned_rows} / {uploadStatus.total_rows}
                  </Typography>
                  <Typography variant="caption" display="block" color="var(--text-primary)">
                    * <b>Missing Values Filled:</b> {uploadStatus.missing_values_filled}
                  </Typography>
                  <Typography variant="caption" display="block" color="var(--text-primary)">
                    * <b>Duplicates Removed:</b> {uploadStatus.duplicates_removed}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Clients Table Panel */}
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} style={{ backgroundColor: 'var(--bg-secondary)', backdropFilter: 'blur(12px)' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                <TableRow>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Company Name</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Industry</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }} align="right">Annual Revenue</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }} align="right">Staff Count</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Assigned Advisor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell style={{ fontFamily: 'Inter', fontWeight: 600 }}>{client.name}</TableCell>
                    <TableCell>
                      <Chip label={client.industry} size="small" variant="outlined" style={{ fontFamily: 'Inter', fontSize: 11 }} />
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter' }} align="right">
                      ${(client.annual_revenue / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter' }} align="right">
                      {client.employee_count}
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter', fontSize: 12 }}>
                      {client.assigned_consultant_detail?.first_name || 'System Auto'}
                    </TableCell>
                  </TableRow>
                ))}
                {clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" style={{ padding: '40px 0', color: 'var(--text-muted)' }}>
                      No corporate client entries found. Register your first client above!
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

export default Clients;
