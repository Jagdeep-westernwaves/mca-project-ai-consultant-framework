import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAuditLogs } from '../store/consultingSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, Card, CardContent, Divider
} from '@mui/material';
import { SecurityOutlined } from '@mui/icons-material';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { auditLogs } = useSelector((state: RootState) => state.consulting);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  return (
    <Box className="animate-fade-in">
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} style={{ letterSpacing: -1, fontFamily: 'Inter' }}>
          System Security & Audit logs
        </Typography>
        <Typography variant="subtitle2" color="var(--text-secondary)">
          Track all user interactions, model uploads, data clean operations, and strategic forecasting queries.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2.5}>
            <SecurityOutlined color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Administrative Activity Trail
            </Typography>
          </Box>
          <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 20 }} />

          <TableContainer component={Paper} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'rgba(59, 130, 246, 0.03)' }}>
                <TableRow>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Advisor Name</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Role Pillar</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Action Tag</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Description</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>IP Address</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700 }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell style={{ fontFamily: 'Inter', fontWeight: 600 }}>{log.username || 'System'}</TableCell>
                    <TableCell style={{ fontFamily: 'Inter', fontSize: 11, textTransform: 'capitalize' }}>
                      {log.role}
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter' }}>
                      <Typography variant="caption" fontWeight={700} style={{ color: 'var(--primary-color)' }}>
                        {log.action}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {log.description}
                    </TableCell>
                    <TableCell style={{ fontFamily: 'Inter', fontSize: 11 }}>{log.ip_address || '127.0.0.1'}</TableCell>
                    <TableCell style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {auditLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '40px 0', color: 'var(--text-muted)' }}>
                      No active audit entries found. Try creating a client or running simulations!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
