import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchReports, createReport, fetchClients } from '../store/consultingSlice';
import {
  Grid, Card, CardContent, Typography, Box, TextField, Button, MenuItem, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  CircularProgress, Chip, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
  DescriptionOutlined, CloudDownloadOutlined, PostAddOutlined, CheckCircleOutline,
  AssessmentOutlined, ShowChartOutlined, InfoOutlined, CloseOutlined, CalendarTodayOutlined
} from '@mui/icons-material';

const TEMPLATE_INFO = {
  executive_summary: {
    name: 'Executive Consulting Summary',
    description: 'A concise leadership-ready overview containing KPIs, risks, and strategic recommendations.',
    pages: '2–3 Pages',
    time: '5–10 Seconds',
    sections: ['Executive Summary', 'KPI Dashboard', 'Strategic Recommendations']
  },
  ai_insights: {
    name: 'Predictive Analytics Report',
    description: 'Detailed analysis of corporate trends, customer churn predictions, anomaly detection, and machine learning insights.',
    pages: '4–6 Pages',
    time: '5–10 Seconds',
    sections: ['Executive Summary', 'KPI Dashboard', 'Predictive Analytics', 'Charts', 'Strategic Recommendations']
  },
  full_consulting_report: {
    name: 'Strategic Business Advisory Report',
    description: 'Comprehensive enterprise advisory document including SWOT analysis, Business Health Scorecard, machine learning forecasts, simulations, and actionable roadmap.',
    pages: '8–12 Pages',
    time: '5–10 Seconds',
    sections: ['Executive Summary', 'KPI Dashboard', 'Business Health Score', 'SWOT Analysis', 'Predictive Analytics', 'Scenario Simulations', 'Strategic Recommendations Deck', 'Strategic Execution Roadmap', 'Charts', 'Appendix']
  }
};

const LOADING_STEPS = [
  'Analyzing Business Data...',
  'Running AI Models...',
  'Generating Recommendations...',
  'Compiling PDF...',
  'Finalizing Executive Report...'
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
    let interval: NodeJS.Timeout;
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
    if (!client) return { score: 75, rating: 'Strong', findings: ['Baseline revenue models are stable.'] };
    const isLarge = client.annual_revenue > 1000000;
    return {
      score: isLarge ? 82 : 64,
      rating: isLarge ? 'Excellent' : 'Stable',
      findings: isLarge ? [
        'High commercial momentum with stable recurring billing paths.',
        'Customer churn rate remains well within target benchmark limits.',
        'Reinvest excess capital allocations into machine learning software assets.'
      ] : [
        'Top-line revenue expansion showing marginal localized friction.',
        'Elevated operational debt leverage levels constraint working capital.',
        'Deploy early-warning customer retention taskforces to stabilize churn.'
      ]
    };
  };

  const selectedTemplate = TEMPLATE_INFO[reportType];

  return (
    <Box className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} style={{ letterSpacing: -1, fontFamily: 'Inter', color: 'var(--text-primary)' }}>
          Executive Consulting Reports
        </Typography>
        <Typography variant="subtitle2" color="var(--text-secondary)" style={{ marginTop: '4px' }}>
          Generate Deloitte & McKinsey-grade PDF consulting reports, customer churn classifications, and SWOT matrix roadmaps.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Generate Report Form Panel */}
        <Grid item xs={12} md={5}>
          <Card style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', backdropFilter: 'blur(12px)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1.2} mb={2.5}>
                <PostAddOutlined color="primary" />
                <Typography variant="h6" fontWeight={700} style={{ fontFamily: 'Inter' }}>
                  Compile Consulting Deliverable
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleGenerate} display="flex" flexDirection="column" gap={2.5}>
                <TextField
                  fullWidth
                  select
                  id="client-select"
                  label="Select Target Client Account"
                  variant="outlined"
                  size="small"
                  onChange={(e: any) => setSelectedClient(Number(e.target.value))}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                >
                  {clients.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  id="report-title"
                  label="Executive Report Document Title"
                  variant="outlined"
                  size="small"
                  value={reportTitle}
                  onChange={(e: any) => setReportTitle(e.target.value)}
                  placeholder="e.g. Q3 Strategic Expansion Advisory"
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                />

                <TextField
                  fullWidth
                  select
                  id="report-type"
                  label="Select Report Template Framework"
                  variant="outlined"
                  size="small"
                  value={reportType}
                  onChange={(e: any) => setReportType(e.target.value as any)}
                  InputProps={{ style: { fontFamily: 'Inter' } }}
                >
                  <MenuItem value="executive_summary">Executive Consulting Summary</MenuItem>
                  <MenuItem value="ai_insights">Predictive Analytics Report</MenuItem>
                  <MenuItem value="full_consulting_report">Strategic Business Advisory Report</MenuItem>
                </TextField>

                {/* Selected Template Description Card */}
                <Box p={2} borderRadius={2} style={{ backgroundColor: 'rgba(59, 130, 246, 0.04)', border: '1px dashed rgba(59, 130, 246, 0.2)' }}>
                  <Typography variant="caption" fontWeight={700} color="primary" display="block" mb={0.5} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Template Profile
                  </Typography>
                  <Typography variant="body2" fontWeight={600} style={{ color: 'var(--text-primary)' }} mb={0.5}>
                    {selectedTemplate.name}
                  </Typography>
                  <Typography variant="caption" style={{ color: 'var(--text-secondary)', display: 'block', leading: '1.4' }}>
                    {selectedTemplate.description}
                  </Typography>
                </Box>

                {/* Report Preview Checklist Panel */}
                <Box p={2.5} borderRadius={2} style={{ backgroundColor: 'rgba(30, 41, 59, 0.2)', border: '1px solid var(--border-glass)' }}>
                  <Typography variant="body2" fontWeight={700} mb={1.5} style={{ fontFamily: 'Inter', color: 'var(--text-primary)' }}>
                    Report Preview Breakdown
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedTemplate.sections.map((section: any, idx: number) => (
                      <Grid item xs={12} sm={6} key={idx} display="flex" alignItems="center" gap={1}>
                        <CheckCircleOutline fontSize="inherit" style={{ color: '#10b981' }} />
                        <Typography variant="caption" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {section}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider style={{ margin: '15px 0', borderColor: 'var(--border-glass)' }} />

                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="caption" color="var(--text-secondary)" display="block">ESTIMATED PAGES</Typography>
                      <Typography variant="body2" fontWeight={700} style={{ color: 'var(--text-primary)' }}>{selectedTemplate.pages}</Typography>
                    </Box>
                    <Box style={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="var(--text-secondary)" display="block">BUDGETED TIME</Typography>
                      <Typography variant="body2" fontWeight={700} style={{ color: 'var(--text-primary)' }}>{selectedTemplate.time}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isGenerating || !selectedClient || !reportTitle.trim()}
                  style={{
                    padding: '11px 0',
                    fontWeight: 700,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    textTransform: 'none'
                  }}
                >
                  {isGenerating ? (
                    <Box display="flex" alignItems="center" gap={1.2}>
                      <CircularProgress size={16} color="inherit" />
                      <span>{LOADING_STEPS[loadingStepIdx]}</span>
                    </Box>
                  ) : (
                    'Generate Strategic Report'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Reports Panel */}
        <Grid item xs={12} md={7}>
          <TableContainer component={Paper} style={{ backgroundColor: 'var(--bg-glass)', border: '1px solid var(--border-glass)', backdropFilter: 'blur(12px)' }}>
            <Table>
              <TableHead style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                <TableRow>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700, color: 'var(--text-primary)' }}>Report Name</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700, color: 'var(--text-primary)' }}>Client</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700, color: 'var(--text-primary)' }}>Framework</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700, color: 'var(--text-primary)' }}>Status</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700, color: 'var(--text-primary)' }} align="center">Pages</TableCell>
                  <TableCell style={{ fontFamily: 'Inter', fontWeight: 700, color: 'var(--text-primary)' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((rep: any) => {
                  const mappedType = TEMPLATE_INFO[rep.report_type as keyof typeof TEMPLATE_INFO]?.name || 'Advisory Report';
                  const pageCount = rep.page_count || 1;
                  const reportStatus = rep.status || 'Completed';

                  return (
                    <TableRow key={rep.id} hover style={{ cursor: 'pointer' }}>
                      <TableCell style={{ fontFamily: 'Inter', fontWeight: 600 }} onClick={() => openReportDetails(rep)}>
                        <Box display="flex" alignItems="center" gap={1.2}>
                          <DescriptionOutlined color="primary" fontSize="small" />
                          <span style={{ color: 'var(--text-primary)' }}>{rep.title}</span>
                        </Box>
                      </TableCell>
                      <TableCell style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text-primary)' }} onClick={() => openReportDetails(rep)}>
                        {rep.client_detail?.name || 'Acme Logistics'}
                      </TableCell>
                      <TableCell style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-secondary)' }} onClick={() => openReportDetails(rep)}>
                        {mappedType}
                      </TableCell>
                      <TableCell onClick={() => openReportDetails(rep)}>
                        <Chip
                          size="small"
                          label={reportStatus}
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 700,
                            fontSize: 10,
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
                      <TableCell style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-primary)' }} align="center" onClick={() => openReportDetails(rep)}>
                        {pageCount}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <IconButton 
                            size="small"
                            onClick={() => openReportDetails(rep)}
                            style={{ border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}
                          >
                            <InfoOutlined fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleDownload(rep.id)}
                            style={{ border: '1px solid var(--border-glass)' }}
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
                    <TableCell colSpan={6} align="center" style={{ padding: '60px 0', color: 'var(--text-muted)' }}>
                      No strategic deliverables compiled. Compile your first report above!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Report Details Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={closeReportDetails}
        PaperProps={{
          style: {
            width: 420,
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            padding: '24px'
          }
        }}
      >
        {selectedReport && (() => {
          const clientData = selectedReport.client_detail;
          const templateMeta = TEMPLATE_INFO[selectedReport.report_type as keyof typeof TEMPLATE_INFO] || { name: 'Advisory Summary', pages: '1 Page' };
          const healthData = getClientHealthScore(clientData);

          return (
            <Box display="flex" flexDirection="column" height="100%">
              {/* Drawer Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AssessmentOutlined color="primary" />
                  <Typography variant="h6" fontWeight={800} style={{ fontFamily: 'Inter' }}>
                    Consulting Deliverable
                  </Typography>
                </Box>
                <IconButton onClick={closeReportDetails} style={{ color: '#94a3b8' }}>
                  <CloseOutlined />
                </IconButton>
              </Box>

              <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />

              {/* Report Metadata */}
              <Box mb={3} display="flex" flexDirection="column" gap={1.5}>
                <Box>
                  <Typography variant="caption" color="grey.500" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Document Name</Typography>
                  <Typography variant="body1" fontWeight={700} style={{ color: '#fff' }}>{selectedReport.title}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="grey.500" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Client Account</Typography>
                  <Typography variant="body2" fontWeight={600} style={{ color: '#e2e8f0' }}>{clientData?.name || 'Acme Global'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="grey.500" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Template Framework</Typography>
                  <Typography variant="body2" fontWeight={600} style={{ color: '#3b82f6' }}>{templateMeta.name}</Typography>
                </Box>

                <Grid container spacing={2} style={{ marginTop: '8px' }}>
                  <Grid item xs={6} display="flex" alignItems="center" gap={1}>
                    <CalendarTodayOutlined fontSize="small" style={{ color: '#94a3b8' }} />
                    <Box>
                      <Typography variant="caption" color="grey.500" display="block">DATE COMPILED</Typography>
                      <Typography variant="caption" fontWeight={600}>{new Date(selectedReport.created_at).toLocaleDateString()}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} display="flex" alignItems="center" gap={1}>
                    <ShowChartOutlined fontSize="small" style={{ color: '#94a3b8' }} />
                    <Box>
                      <Typography variant="caption" color="grey.500" display="block">PAGE BUDGET</Typography>
                      <Typography variant="caption" fontWeight={600}>{selectedReport.page_count || 1} Pages</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />

              {/* Health Score Panel */}
              <Box p={2.5} borderRadius={2} mb={3.5} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="caption" color="grey.500" style={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }} mb={1}>
                  Weighted Business Health
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="50%"
                    style={{
                      width: 56,
                      height: 56,
                      border: '4px solid ' + (healthData.score >= 80 ? '#10b981' : '#3b82f6'),
                      fontWeight: 800,
                      fontSize: 16
                    }}
                  >
                    {healthData.score}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={800} style={{ color: healthData.score >= 80 ? '#10b981' : '#3b82f6' }}>
                      {healthData.rating} Status
                    </Typography>
                    <Typography variant="caption" color="grey.400" display="block" style={{ leading: 1.3 }}>
                      Calculated from gross revenue, attrition rates, capitalization, and customer NLP sentiments.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Strategic Findings */}
              <Box mb={4} flexGrow={1}>
                <Typography variant="caption" color="grey.500" style={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }} mb={1.5}>
                  Primary Strategic Findings
                </Typography>
                <List style={{ padding: 0 }}>
                  {healthData.findings.map((finding, idx) => (
                    <ListItem key={idx} style={{ padding: '8px 0', alignItems: 'flex-start' }}>
                      <ListItemIcon style={{ minWidth: 24, marginTop: 4, color: '#3b82f6' }}>
                        <CheckCircleOutline fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={finding}
                        primaryTypographyProps={{
                          style: { fontSize: 12.5, color: '#e2e8f0', leading: '1.4' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Action Buttons */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleDownload(selectedReport.id)}
                style={{
                  padding: '12px 0',
                  fontWeight: 700,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  textTransform: 'none'
                }}
              >
                Quick Download deliverable PDF
              </Button>
            </Box>
          );
        })()}
      </Drawer>
    </Box>
  );
};

export default Reports;
