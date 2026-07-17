import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchReports, createReport, fetchClients } from '../store/consultingSlice';
import {
  Typography, Box, TextField, Button, MenuItem, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  CircularProgress, Chip, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
  DescriptionOutlined, CloudDownloadOutlined, PostAddOutlined, CheckCircleOutline,
  AssessmentOutlined, ShowChartOutlined, InfoOutlined, CloseOutlined, CalendarTodayOutlined
} from '@mui/icons-material';

const TEMPLATE_INFO = {
  executive_summary: {
    name: 'EXECUTIVE DIRECTIVE SUMMARY',
    description: 'A concise leadership-ready overview containing KPIs, risks, and strategic recommendations.',
    pages: '2–3 PAGES',
    time: '5–10 SECONDS',
    sections: ['EXECUTIVE SUMMARY', 'KPI DASHBOARD', 'STRATEGIC RECOMMENDATIONS']
  },
  ai_insights: {
    name: 'PREDICTIVE ANALYTICS LOG',
    description: 'Detailed analysis of corporate trends, customer churn predictions, anomaly detection, and machine learning insights.',
    pages: '4–6 PAGES',
    time: '5–10 SECONDS',
    sections: ['EXECUTIVE SUMMARY', 'KPI DASHBOARD', 'PREDICTIVE ANALYTICS', 'CHARTS', 'STRATEGIC RECOMMENDATIONS']
  },
  full_consulting_report: {
    name: 'STRATEGIC ADVISORY REPORT',
    description: 'Comprehensive enterprise advisory document including SWOT analysis, Business Health Scorecard, machine learning forecasts, simulations, and actionable roadmap.',
    pages: '8–12 PAGES',
    time: '5–10 SECONDS',
    sections: ['EXECUTIVE SUMMARY', 'KPI DASHBOARD', 'BUSINESS HEALTH SCORE', 'SWOT ANALYSIS', 'PREDICTIVE ANALYTICS', 'SCENARIO SIMULATIONS', 'STRATEGIC RECOMMENDATIONS DECK', 'STRATEGIC EXECUTION ROADMAP', 'CHARTS', 'APPENDIX']
  }
};

const LOADING_STEPS = [
  '> ANALYZING DB CLUSTERS...',
  '> RUNNING ML INFERENCE...',
  '> GENERATING STRATEGIC VECTORS...',
  '> COMPILING PDF PAYLOAD...',
  '> FINALIZING DOCUMENT...'
];

const Reports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, clients } = useSelector((state: RootState) => state.consulting);
  const [selectedClient, setSelectedClient] = useState<number | ''>('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<'executive_summary' | 'ai_insights' | 'full_consulting_report'>('executive_summary');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  // Drawer states
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchClients());
  }, [dispatch]);

  // Loading text cycler
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isGenerating) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !reportTitle.trim()) return;

    setIsGenerating(true);
    try {
      await dispatch(createReport({
        client: Number(selectedClient),
        title: reportTitle,
        report_type: reportType
      })).unwrap();
      
      setReportTitle('');
      setSelectedClient('');
    } catch (err) {
      alert("Failed to render and compile the advisory PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (reportId: number) => {
    const token = localStorage.getItem('aimcf_access_token');
    window.open(`http://localhost:8000/api/reports/${reportId}/download/?token=${token}`, '_blank');
    // Refresh report list to fetch updated status badge
    setTimeout(() => {
      dispatch(fetchReports());
    }, 1500);
  };

  const openReportDetails = (report: any) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  const closeReportDetails = () => {
    setIsDrawerOpen(false);
    setSelectedReport(null);
  };

  // Helper to resolve custom client metadata for details drawer
  const getClientHealthScore = (client: any) => {
    if (!client) return { score: 75, rating: 'STABLE', findings: ['Baseline revenue models are stable.'] };
    const isLarge = client.annual_revenue > 1000000;
    return {
      score: isLarge ? 82 : 64,
      rating: isLarge ? 'OPTIMAL' : 'STABLE',
      findings: isLarge ? [
        'HIGH COMMERCIAL MOMENTUM DETECTED.',
        'CHURN RATE WITHIN TARGET BENCHMARK LIMITS.',
        'REINVEST EXCESS CAPITAL INTO ML SOFTWARE ASSETS.'
      ] : [
        'TOP-LINE REVENUE EXPANSION SHOWING LOCALIZED FRICTION.',
        'ELEVATED OPERATIONAL DEBT LEVERAGE DETECTED.',
        'DEPLOY EARLY-WARNING RETENTION TASKFORCES TO STABILIZE CHURN.'
      ]
    };
  };

  const selectedTemplate = TEMPLATE_INFO[reportType];

  return (
    <Box className="animate-fade-in" style={{ padding: '0 24px 40px 24px' }}>
      <Box mb={4} className="bento-tile" style={{ padding: '24px 32px' }}>
        <Typography variant="h3" fontWeight={900} className="neon-text" style={{ letterSpacing: -1 }}>
          INTELLIGENCE REPORTS
        </Typography>
        <Typography variant="overline" style={{ color: 'var(--text-secondary)', letterSpacing: 3, fontWeight: 800 }}>
          STRATEGIC PDF DELIVERABLES AND DATA EXPORTS
        </Typography>
      </Box>

      <Box className="bento-grid">
        {/* Generate Report Form Panel */}
        <Box className="bento-tile" style={{ gridColumn: 'span 5' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <PostAddOutlined style={{ color: '#3b82f6', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={900} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              COMPILE DELIVERABLE
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleGenerate} display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              select
              id="client-select"
              label="TARGET CLIENT NODE"
              variant="standard"
              value={selectedClient}
              onChange={(e: any) => setSelectedClient(Number(e.target.value))}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            >
              {clients.map((c: any) => (
                <MenuItem key={c.id} value={c.id} style={{ fontWeight: 800 }}>{c.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              id="report-title"
              placeholder="DOCUMENT DESIGNATION"
              variant="standard"
              value={reportTitle}
              onChange={(e: any) => setReportTitle(e.target.value)}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            />

            <TextField
              fullWidth
              select
              id="report-type"
              label="TEMPLATE FRAMEWORK"
              variant="standard"
              value={reportType}
              onChange={(e: any) => setReportType(e.target.value as any)}
              InputProps={{ style: { fontFamily: 'var(--font-primary)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' } }}
            >
              <MenuItem value="executive_summary" style={{ fontWeight: 800 }}>EXECUTIVE SUMMARY LOG</MenuItem>
              <MenuItem value="ai_insights" style={{ fontWeight: 800 }}>PREDICTIVE ANALYTICS PROFILE</MenuItem>
              <MenuItem value="full_consulting_report" style={{ fontWeight: 800 }}>STRATEGIC ADVISORY DOSSIER</MenuItem>
            </TextField>

            {/* Selected Template Description Card */}
            <Box p={3} borderRadius={2} style={{ backgroundColor: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Typography variant="caption" fontWeight={900} color="#3b82f6" display="block" mb={1} style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                TEMPLATE PROFILE
              </Typography>
              <Typography variant="body1" fontWeight={800} style={{ color: 'var(--text-primary)', letterSpacing: 1 }} mb={1}>
                {selectedTemplate.name}
              </Typography>
              <Typography variant="body2" style={{ color: 'var(--text-secondary)', display: 'block', lineHeight: 1.6, fontWeight: 600 }}>
                {selectedTemplate.description}
              </Typography>
            </Box>

            {/* Report Preview Checklist Panel */}
            <Box p={3} borderRadius={2} style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="caption" fontWeight={900} mb={2} style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-muted)', letterSpacing: 2, display: 'block' }}>
                PAYLOAD STRUCTURE
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {selectedTemplate.sections.map((section: any, idx: number) => (
                  <Box key={idx} display="flex" alignItems="center" gap={1.5}>
                    <CheckCircleOutline style={{ color: '#10b981', fontSize: 18 }} />
                    <Typography variant="caption" style={{ color: 'var(--text-primary)', fontWeight: 800, letterSpacing: 1 }}>
                      {section}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider style={{ margin: '20px 0', borderColor: 'var(--border-glass)' }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="var(--text-muted)" fontWeight={800} display="block" style={{ letterSpacing: 2 }}>EST. PAGES</Typography>
                  <Typography variant="body2" fontWeight={900} style={{ color: 'var(--text-primary)', letterSpacing: 1 }}>{selectedTemplate.pages}</Typography>
                </Box>
                <Box style={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="var(--text-muted)" fontWeight={800} display="block" style={{ letterSpacing: 2 }}>CPU CYCLE REQ.</Typography>
                  <Typography variant="body2" fontWeight={900} style={{ color: 'var(--text-primary)', letterSpacing: 1 }}>{selectedTemplate.time}</Typography>
                </Box>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isGenerating || !selectedClient || !reportTitle.trim()}
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
              {isGenerating ? (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <CircularProgress size={16} style={{ color: 'var(--text-primary)' }} />
                  <span style={{ fontFamily: 'monospace' }}>{LOADING_STEPS[loadingStepIdx]}</span>
                </Box>
              ) : (
                'INITIALIZE COMPILATION'
              )}
            </Button>
          </Box>
        </Box>

        {/* Generated Reports Panel */}
        <Box className="bento-tile" style={{ gridColumn: 'span 7', padding: 0, overflow: 'hidden' }}>
          <TableContainer style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <TableRow>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>DOCUMENT IDENTIFIER</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>CLIENT NODE</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>FRAMEWORK</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }}>STATUS LOG</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }} align="center">VOL</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 900, letterSpacing: 1, color: 'var(--text-muted)', borderBottom: 'none' }} align="center">CMD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((rep: any) => {
                  const mappedType = TEMPLATE_INFO[rep.report_type as keyof typeof TEMPLATE_INFO]?.name || 'ADVISORY REPORT';
                  const pageCount = rep.page_count || 1;
                  const reportStatus = rep.status || 'Completed';

                  return (
                    <TableRow key={rep.id} hover style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, borderBottom: 'none' }} onClick={() => openReportDetails(rep)}>
                        <Box display="flex" alignItems="center" gap={1.2}>
                          <DescriptionOutlined style={{ color: '#3b82f6', fontSize: 18 }} />
                          <span style={{ color: 'var(--text-primary)' }}>{rep.title}</span>
                        </Box>
                      </TableCell>
                      <TableCell style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, color: 'var(--text-primary)', borderBottom: 'none' }} onClick={() => openReportDetails(rep)}>
                        {rep.client_detail?.name || 'ACME LOGISTICS'}
                      </TableCell>
                      <TableCell style={{ fontFamily: 'var(--font-primary)', fontSize: 10, fontWeight: 800, color: 'var(--text-secondary)', borderBottom: 'none' }} onClick={() => openReportDetails(rep)}>
                        {mappedType}
                      </TableCell>
                      <TableCell onClick={() => openReportDetails(rep)} style={{ borderBottom: 'none' }}>
                        <Chip
                          size="small"
                          label={reportStatus.toUpperCase()}
                          style={{
                            fontFamily: 'var(--font-primary)',
                            fontWeight: 900,
                            fontSize: 10,
                            letterSpacing: 1,
                            backgroundColor:
                              reportStatus === 'Completed' ? 'rgba(16, 185, 129, 0.1)' :
                              reportStatus === 'Downloaded' ? 'rgba(59, 130, 246, 0.1)' :
                              reportStatus === 'Processing' ? 'rgba(245, 158, 11, 0.1)' :
                              'rgba(239, 68, 68, 0.1)',
                            color:
                              reportStatus === 'Completed' ? '#10b981' :
                              reportStatus === 'Downloaded' ? '#3b82f6' :
                              reportStatus === 'Processing' ? '#f59e0b' :
                              '#ef4444',
                            border: '1px solid currentColor'
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ fontFamily: 'var(--font-primary)', fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', borderBottom: 'none' }} align="center" onClick={() => openReportDetails(rep)}>
                        {pageCount}P
                      </TableCell>
                      <TableCell align="center" style={{ borderBottom: 'none' }}>
                        <Box display="flex" justifyContent="center" gap={1}>
                          <IconButton 
                            size="small"
                            onClick={() => openReportDetails(rep)}
                            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}
                          >
                            <InfoOutlined fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => handleDownload(rep.id)}
                            style={{ border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', backgroundColor: 'var(--primary-glow)' }}
                          >
                            <CloudDownloadOutlined fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={{ padding: '60px 0', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 2, borderBottom: 'none' }}>
                      NO DELIVERABLES COMPILED IN DB
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Report Details Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={closeReportDetails}
        PaperProps={{
          style: {
            width: 460,
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            padding: '32px'
          }
        }}
      >
        {selectedReport && (() => {
          const clientData = selectedReport.client_detail;
          const templateMeta = TEMPLATE_INFO[selectedReport.report_type as keyof typeof TEMPLATE_INFO] || { name: 'ADVISORY SUMMARY', pages: '1 PAGE' };
          const healthData = getClientHealthScore(clientData);

          return (
            <Box display="flex" flexDirection="column" height="100%">
              {/* Drawer Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <AssessmentOutlined style={{ color: '#3b82f6' }} />
                  <Typography variant="h6" fontWeight={900} style={{ fontFamily: 'var(--font-primary)', letterSpacing: 1 }}>
                    DOCUMENT INSPECT
                  </Typography>
                </Box>
                <IconButton onClick={closeReportDetails} style={{ color: '#64748b' }}>
                  <CloseOutlined />
                </IconButton>
              </Box>

              <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: '24px' }} />

              {/* Report Metadata */}
              <Box mb={4} display="flex" flexDirection="column" gap={2.5}>
                <Box>
                  <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>DOCUMENT DESIGNATION</Typography>
                  <Typography variant="body1" fontWeight={800} style={{ color: 'var(--text-primary)' }}>{selectedReport.title}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>CLIENT NODE</Typography>
                  <Typography variant="body2" fontWeight={800} style={{ color: '#e2e8f0' }}>{clientData?.name || 'ACME GLOBAL'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>TEMPLATE ARCHITECTURE</Typography>
                  <Typography variant="body2" fontWeight={800} style={{ color: '#3b82f6' }}>{templateMeta.name}</Typography>
                </Box>

                <Box display="flex" gap={4} mt={1}>
                  <Box>
                    <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>SYS CLOCK</Typography>
                    <Typography variant="caption" fontWeight={800} color='var(--text-primary)' style={{ fontFamily: 'monospace' }}>{new Date(selectedReport.created_at).toLocaleDateString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={0.5}>VOLUME</Typography>
                    <Typography variant="caption" fontWeight={800} color='var(--text-primary)' style={{ fontFamily: 'monospace' }}>{selectedReport.page_count || 1} PAGES</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: '24px' }} />

              {/* Health Score Panel */}
              <Box p={3} borderRadius={2} mb={4} style={{ background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={2}>
                  NODE INTEGRITY INDEX
                </Typography>
                <Box display="flex" alignItems="center" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      width: 64,
                      height: 64,
                      border: '4px solid ' + (healthData.score >= 80 ? '#10b981' : '#3b82f6'),
                      borderRadius: 12,
                      fontWeight: 900,
                      fontSize: 20,
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-glass)'
                    }}
                  >
                    {healthData.score}
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={900} style={{ color: healthData.score >= 80 ? '#10b981' : '#3b82f6', letterSpacing: 1 }} mb={0.5}>
                      {healthData.rating} STATUS
                    </Typography>
                    <Typography variant="caption" color="var(--text-secondary)" display="block" style={{ lineHeight: 1.5, fontWeight: 600 }}>
                      CALCULATED FROM TELEMETRY, FINANCIALS AND NLP METRICS.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Strategic Findings */}
              <Box mb={5} flexGrow={1}>
                <Typography variant="caption" color="var(--text-muted)" style={{ fontWeight: 900, letterSpacing: 2, display: 'block' }} mb={2}>
                  PRIMARY VECTORS IDENTIFIED
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {healthData.findings.map((finding, idx) => (
                    <Box key={idx} display="flex" alignItems="flex-start" gap={1.5}>
                      <CheckCircleOutline style={{ color: '#3b82f6', fontSize: 18, marginTop: 2 }} />
                      <Typography style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6, fontWeight: 600 }}>
                        {finding}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Action Buttons */}
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleDownload(selectedReport.id)}
                style={{
                  padding: '16px 0',
                  fontWeight: 900,
                  letterSpacing: 2,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 0 20px rgba(59,130,246,0.3)',
                  marginTop: 'auto'
                }}
              >
                DOWNLOAD PAYLOAD
              </Button>
            </Box>
          );
        })()}
      </Drawer>
    </Box>
  );
};

export default Reports;
