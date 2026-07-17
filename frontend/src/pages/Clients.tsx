import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createClient, fetchClients } from '../store/consultingSlice';
import api from '../utils/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Typography, Box, TextField, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Alert, MenuItem
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
    <Box className="animate-fade-in" style={{ padding: '0 24px' }}>
      <Box mb={4} className="bento-tile" style={{ padding: '24px 32px' }}>
        <Typography variant="h3" fontWeight={900} className="neon-text" style={{ letterSpacing: -1 }}>
          CLIENT DATABASE
        </Typography>
        <Typography variant="overline" style={{ color: 'var(--text-secondary)', letterSpacing: 3, fontWeight: 800 }}>
          REGISTERED CORPORATE ENTITIES
        </Typography>
      </Box>

      <Box className="bento-grid">
        {/* Create Client Box */}
        <Box className="bento-tile" style={{ gridColumn: 'span 4' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <AddBusinessOutlined style={{ color: '#3b82f6', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={900} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              INITIALIZE CLIENT
            </Typography>
          </Box>

          <Box component="form" onSubmit={formik.handleSubmit} display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              id="name"
              name="name"
              placeholder="COMPANY DESIGNATION"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            />
            <TextField
              fullWidth
              id="industry"
              name="industry"
              placeholder="INDUSTRY VECTOR"
              variant="standard"
              value={formik.values.industry}
              onChange={formik.handleChange}
              error={formik.touched.industry && Boolean(formik.errors.industry)}
              helperText={formik.touched.industry && formik.errors.industry}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            />
            <TextField
              fullWidth
              id="annual_revenue"
              name="annual_revenue"
              placeholder="ANNUAL REVENUE ($)"
              type="number"
              variant="standard"
              value={formik.values.annual_revenue}
              onChange={formik.handleChange}
              error={formik.touched.annual_revenue && Boolean(formik.errors.annual_revenue)}
              helperText={formik.touched.annual_revenue && formik.errors.annual_revenue}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            />
            <TextField
              fullWidth
              id="employee_count"
              name="employee_count"
              placeholder="PERSONNEL COUNT"
              type="number"
              variant="standard"
              value={formik.values.employee_count}
              onChange={formik.handleChange}
              error={formik.touched.employee_count && Boolean(formik.errors.employee_count)}
              helperText={formik.touched.employee_count && formik.errors.employee_count}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            />
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
              CREATE ENTITY
            </Button>
          </Box>
        </Box>

        {/* Data Upload Systems Widget */}
        <Box className="bento-tile" style={{ gridColumn: 'span 4' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <UploadFileOutlined style={{ color: '#10b981', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={900} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              DATA INGESTION
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleUploadSubmit} display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              select
              id="upload-client"
              placeholder="TARGET NODE"
              variant="standard"
              value={uploadClient}
              onChange={(e) => setUploadClient(Number(e.target.value))}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            >
              {clients.map(c => (
                <MenuItem key={c.id} value={c.id} style={{ fontWeight: 800 }}>{c.name}</MenuItem>
              ))}
            </TextField>

            {/* Upload drag block */}
            <Box
              p={3}
              border="2px dashed rgba(255,255,255,0.1)"
              borderRadius="8px"
              textAlign="center"
              bgcolor="rgba(0,0,0,0.2)"
              position="relative"
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
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
              <UploadFileOutlined style={{ fontSize: 32, marginBottom: 8, color: '#64748b' }} />
              <Typography variant="caption" display="block" color="var(--text-secondary)" fontWeight={800} style={{ letterSpacing: 1 }}>
                {selectedFile ? selectedFile.name : "MOUNT PAYLOAD (.CSV/.PDF)"}
              </Typography>
            </Box>

            {uploadError && <Alert severity="error" style={{ fontSize: 11, padding: '0 8px', borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{uploadError}</Alert>}

            <Button
              type="submit"
              variant="outlined"
              fullWidth
              disabled={isUploading || !selectedFile || !uploadClient}
              style={{ 
                fontWeight: 900, 
                borderRadius: 8, 
                letterSpacing: 2, 
                padding: '16px 0',
                color: '#10b981',
                borderColor: '#10b981'
              }}
            >
              {isUploading ? 'DECRYPTING...' : 'PARSE PAYLOAD'}
            </Button>
          </Box>

          {/* Parsing Results Overlay */}
          {uploadStatus && (
            <Box mt={3} p={2} bgcolor="rgba(16,185,129,0.1)" borderRadius="8px" border="1px solid rgba(16,185,129,0.3)">
              <Box display="flex" alignItems="center" gap={1} mb={1} color="#10b981">
                <CheckCircleOutline fontSize="small" />
                <Typography variant="subtitle2" fontWeight={800} style={{ letterSpacing: 1 }}>
                  INGESTION COMPLETE
                </Typography>
              </Box>
              <Typography variant="caption" display="block" color="var(--text-primary)" fontWeight={600} style={{ fontFamily: 'monospace' }}>
                &gt; ROW INTEGRITY: {uploadStatus.cleaned_rows} / {uploadStatus.total_rows}
              </Typography>
              <Typography variant="caption" display="block" color="var(--text-primary)" fontWeight={600} style={{ fontFamily: 'monospace' }}>
                &gt; FILL OVERRIDE: {uploadStatus.missing_values_filled}
              </Typography>
              <Typography variant="caption" display="block" color="var(--text-primary)" fontWeight={600} style={{ fontFamily: 'monospace' }}>
                &gt; DUP PRUNED: {uploadStatus.duplicates_removed}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Clients Table Panel */}
        <Box className="bento-tile" style={{ gridColumn: 'span 8', padding: 0, overflow: 'hidden' }}>
          <TableContainer style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <TableRow>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>ENTITY DESIGNATION</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>SECTOR</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }} align="right">YIELD</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }} align="right">UNITS</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>NODE HANDLER</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} hover style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, color: 'var(--text-primary)', borderBottom: 'none' }}>{client.name}</TableCell>
                    <TableCell style={{ borderBottom: 'none' }}>
                      <Chip label={client.industry} size="small" style={{ fontFamily: 'var(--font-primary)', fontSize: 10, fontWeight: 900, backgroundColor: 'var(--primary-glow)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', letterSpacing: 1 }} />
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, color: '#10b981', borderBottom: 'none' }} align="right">
                      ${(client.annual_revenue / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, color: 'var(--text-primary)', borderBottom: 'none' }} align="right">
                      {client.employee_count}
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontSize: 12, fontWeight: 800, color: 'var(--text-secondary)', borderBottom: 'none' }}>
                      {client.assigned_consultant_detail?.first_name || 'SYSTEM.AUTO'}
                    </TableCell>
                  </TableRow>
                ))}
                {clients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" style={{ padding: '60px 0', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 2, borderBottom: 'none' }}>
                      NO ENTITIES REGISTERED IN DB
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

export default Clients;
