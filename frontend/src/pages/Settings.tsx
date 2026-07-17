import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAuditLogs } from '../store/consultingSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Box, Divider
} from '@mui/material';
import { SecurityOutlined } from '@mui/icons-material';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { auditLogs } = useSelector((state: RootState) => state.consulting);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  return (
    <Box className="animate-fade-in" style={{ padding: '0 24px' }}>
      <Box mb={4} className="bento-tile" style={{ padding: '24px 32px' }}>
        <Typography variant="h3" fontWeight={900} className="neon-text" style={{ letterSpacing: -1 }}>
          SYSTEM SECURITY
        </Typography>
        <Typography variant="overline" style={{ color: 'var(--text-secondary)', letterSpacing: 3, fontWeight: 800 }}>
          AUDIT LOGS & EVENT TRACING
        </Typography>
      </Box>

      <Box className="bento-grid">
        <Box className="bento-tile" style={{ gridColumn: 'span 12', padding: 0, overflow: 'hidden' }}>
          <Box p={3} display="flex" alignItems="center" gap={1.5}>
            <SecurityOutlined style={{ color: '#ef4444', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={900} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              ADMINISTRATIVE ACTIVITY TRAIL
            </Typography>
          </Box>
          <Divider style={{ borderColor: 'var(--border-glass)' }} />

          <TableContainer style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <TableRow>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>NODE ENTITY</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>ACCESS TIER</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>EVENT TRIGGER</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>PAYLOAD DETAILS</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>IP TRACE</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>SYSTEM CLOCK</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} hover style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, color: 'var(--text-primary)', borderBottom: 'none' }}>{log.username || 'SYSTEM.CORE'}</TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-secondary)', borderBottom: 'none' }}>
                      {log.role}
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', borderBottom: 'none' }}>
                      <Typography variant="caption" fontWeight={900} style={{ color: '#ef4444', letterSpacing: 1 }}>
                        {log.action}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', borderBottom: 'none' }}>
                      {log.description}
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontSize: 11, fontWeight: 800, color: '#10b981', borderBottom: 'none' }}>{log.ip_address || '127.0.0.1'}</TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-primary)', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', borderBottom: 'none' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {auditLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '60px 0', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 2, borderBottom: 'none' }}>
                      NO EVENT TRIGGERS LOGGED IN DB
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

export default Settings;
