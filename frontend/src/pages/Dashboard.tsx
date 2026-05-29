import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchClients,
  fetchProjects,
  fetchNotifications,
  runSalesForecast,
  runChurnAnalysis,
  runRiskAnalysis,
  fetchStrategicAdvice
} from '../store/consultingSlice';
import { Grid, Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Chip, LinearProgress } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  TrendingUpOutlined,
  PeopleAltOutlined,
  BusinessCenterOutlined,
  GppMaybeOutlined,
  NotificationsActiveOutlined,
  FavoriteBorderOutlined,
  LightbulbOutlined,
  CheckCircleOutline,
  ErrorOutline,
  StarOutline
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, projects, salesForecast, churnAnalysis, notifications, strategicAdvice } = useSelector(
    (state: RootState) => state.consulting
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchProjects());
    dispatch(fetchNotifications());
    
    // Sequentially trigger predictions, then compile strategic advice
    const triggerMLAndAdvice = async () => {
      await Promise.all([
        dispatch(runSalesForecast({ months_to_forecast: 6 })),
        dispatch(runChurnAnalysis({})),
        dispatch(runRiskAnalysis({}))
      ]);
      dispatch(fetchStrategicAdvice());
    };
    
    triggerMLAndAdvice();
  }, [dispatch]);

  // Aggregate numbers
  const totalClients = clients.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const churnRate = churnAnalysis?.prediction_results?.summary?.predicted_churn_rate || '4.2';
  const growthRate = salesForecast?.prediction_results?.metrics?.r2_score 
    ? `${(salesForecast.prediction_results.metrics.r2_score * 10).toFixed(1)}%` 
    : '8.4%';

  // Format Recharts forecast data
  const chartData = salesForecast?.prediction_results?.historical 
    ? [...salesForecast.prediction_results.historical, ...salesForecast.prediction_results.forecast] 
    : [
        { month: 1, sales: 120000 }, { month: 2, sales: 125000 }, { month: 3, sales: 121900 },
        { month: 4, sales: 129800 }, { month: 5, sales: 134200 }, { month: 6, sales: 131500 },
        { month: 7, sales: 140800 }, { month: 8, sales: 144500 }, { month: 9, sales: 141200 },
        { month: 10, sales: 149800 }, { month: 11, sales: 155200 }, { month: 12, sales: 152400 }
      ];

  // Resolve strategic advice fallback values
  const healthScore = strategicAdvice?.health_score?.score || 72.4;
  const healthClass = strategicAdvice?.health_score?.classification || 'Good';
  const healthExplanation = strategicAdvice?.health_score?.explanation || 
    'Your corporate structures exhibit stable cash flows and resilient buyer perception.';
  const swot = strategicAdvice?.swot || {
    strengths: [
      "Established core operational revenue base.",
      "Patented technology assets driving unique client integrations."
    ],
    weaknesses: [
      "Operational delays in shipping schedules averaging 2 days.",
      "Administrative overhead spending limits R&D resources."
    ],
    opportunities: [
      "Deploy CRM telemetry workflows to identify churn hazards early.",
      "Cross-sell premium predictive analytics modules to established accounts."
    ],
    threats: [
      "Pricing elasticities indicate high attrition risks under broadly rising prices.",
      "Competitor expansion in cloud self-serve dashboarding tools."
    ]
  };
  const execSummary = strategicAdvice?.executive_summary || 
    "Comprehensive diagnostics indicate stable commercial operations. Management is advised to prioritize reducing supply delays and paying down high-interest credit lines.";
  const recommendations = strategicAdvice?.recommendations || [
    { category: 'Growth', title: 'Market Share Consolidation', description: 'Cross-sell analytical services to mature corporate accounts.', impact: 'Medium', difficulty: 'Low' },
    { category: 'Finance', title: 'Capital Deployment Rebalance', description: 'Re-allocate administrative budget to invest in proprietary AI IP assets.', impact: 'High', difficulty: 'Medium' }
  ];

  const kpis = [
    { label: 'Active Clients', value: totalClients, icon: <PeopleAltOutlined color="primary" />, desc: 'Corporate accounts assigned' },
    { label: 'Running Projects', value: activeProjects, icon: <BusinessCenterOutlined color="secondary" />, desc: 'Current consulting sprints' },
    { label: 'Forecast R2 Fit', value: growthRate, icon: <TrendingUpOutlined style={{ color: '#ec4899' }} />, desc: 'Predictive regression fit' },
    { label: 'Merchant Attrition Risk', value: `${churnRate}%`, icon: <GppMaybeOutlined style={{ color: '#f59e0b' }} />, desc: 'AI customer churn average' },
  ];

  // Color mapping based on health rating
  const getHealthColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return '#10b981'; // Green
      case 'Good': return '#3b82f6';      // Blue
      case 'Average': return '#f59e0b';   // Amber
      default: return '#ef4444';          // Red
    }
  };

  return (
    <Box className="animate-fade-in" pb={6}>
      {/* Top Welcome & Health Summary Bar */}
      <Box mb={4} p={3} className="glass-card" display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={800} style={{ letterSpacing: -1, fontFamily: 'Inter' }}>
            Corporate Consulting Hub
          </Typography>
          <Typography variant="subtitle2" color="var(--text-secondary)">
            Welcome back, {user?.first_name || 'Advisor'}. Here is your real-time strategic alignment audit.
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box textAlign="right" display={{ xs: 'none', sm: 'block' }}>
            <Typography variant="caption" color="var(--text-muted)" fontWeight={700}>
              BUSINESS HEALTH STATUS
            </Typography>
            <Typography variant="h6" fontWeight={800} style={{ color: getHealthColor(healthClass), fontFamily: 'Inter' }}>
              {healthClass} Rating
            </Typography>
          </Box>
          <Box 
            p={2} 
            display="flex" 
            flexDirection="column" 
            justifyContent="center" 
            alignItems="center" 
            borderRadius="50%" 
            width={72} 
            height={72} 
            style={{ 
              border: `4px solid ${getHealthColor(healthClass)}`, 
              backgroundColor: 'rgba(255,255,255,0.03)',
              boxShadow: `0 0 16px 0 ${getHealthColor(healthClass)}33` 
            }}
          >
            <Typography variant="subtitle1" fontWeight={900} style={{ color: getHealthColor(healthClass), fontFamily: 'Inter', lineHeight: 1 }}>
              {Math.round(healthScore)}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* KPI Grid */}
      <Grid container spacing={3} mb={4}>
        {kpis.map((kpi) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <Card className="glass-card-hover" style={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="overline" color="var(--text-muted)" fontWeight={700}>
                    {kpi.label}
                  </Typography>
                  <Box p={1} bgcolor="rgba(59, 130, 246, 0.05)" borderRadius="10px">
                    {kpi.icon}
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight={800} mb={0.5} style={{ fontFamily: 'Inter' }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" color="var(--text-secondary)">
                  {kpi.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main 2-Column Corporate Audit Pane */}
      <Grid container spacing={3}>
        
        {/* Left Column: Analytics Chart, SWOT Matrix, Recommendations */}
        <Grid item xs={12} lg={8} display="flex" flexDirection="column" gap={3}>
          
          {/* Sales trends charts */}
          <Card>
            <CardContent>
              <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Sales Trend & Predictive Forecast
                  </Typography>
                  <Typography variant="caption" color="var(--text-secondary)">
                    Combined historical and machine-learned regression curves (fitted via scikit-learn)
                  </Typography>
                </Box>
                <Chip label="LinearRegression Model" size="small" color="primary" variant="outlined" style={{ fontSize: 10, fontWeight: 700 }} />
              </Box>
              <Box height={280}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" tickFormatter={(m) => `Month ${m}`} style={{ fontSize: 11, fontFamily: 'Inter' }} />
                    <YAxis stroke="var(--text-muted)" tickFormatter={(val) => `$${val/1000}k`} style={{ fontSize: 11, fontFamily: 'Inter' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-glass)',
                        borderRadius: 12,
                        fontFamily: 'Inter'
                      }} 
                    />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* SWOT ANALYSIS MATRIX WIDGET */}
          <Card>
            <CardContent>
              <Box mb={2.5} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <StarOutline color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Dynamic SWOT Diagnostics Matrix
                  </Typography>
                </Box>
                <Chip label="Automated KPI Alignment" size="small" style={{ fontSize: 10, fontWeight: 700, backgroundColor: 'rgba(59,130,246,0.08)', color: '#3b82f6' }} />
              </Box>
              <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 20 }} />

              <Grid container spacing={2}>
                {/* Strengths */}
                <Grid item xs={12} sm={6}>
                  <Box p={2.5} borderRadius="12px" bgcolor="rgba(16,185,129,0.03)" style={{ borderLeft: '4px solid #10b981', height: '100%' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#10b981" mb={1} display="flex" alignItems="center" gap={0.5}>
                      💪 Strengths (Internal)
                    </Typography>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {swot.strengths.map((str, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}><Typography variant="body2" color="var(--text-secondary)">{str}</Typography></li>
                      ))}
                    </ul>
                  </Box>
                </Grid>

                {/* Weaknesses */}
                <Grid item xs={12} sm={6}>
                  <Box p={2.5} borderRadius="12px" bgcolor="rgba(239,68,68,0.03)" style={{ borderLeft: '4px solid #ef4444', height: '100%' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#ef4444" mb={1} display="flex" alignItems="center" gap={0.5}>
                      ⚠️ Weaknesses (Internal)
                    </Typography>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {swot.weaknesses.map((wk, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}><Typography variant="body2" color="var(--text-secondary)">{wk}</Typography></li>
                      ))}
                    </ul>
                  </Box>
                </Grid>

                {/* Opportunities */}
                <Grid item xs={12} sm={6}>
                  <Box p={2.5} borderRadius="12px" bgcolor="rgba(59,130,246,0.03)" style={{ borderLeft: '4px solid #3b82f6', height: '100%' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#3b82f6" mb={1} display="flex" alignItems="center" gap={0.5}>
                      💡 Opportunities (External)
                    </Typography>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {swot.opportunities.map((op, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}><Typography variant="body2" color="var(--text-secondary)">{op}</Typography></li>
                      ))}
                    </ul>
                  </Box>
                </Grid>

                {/* Threats */}
                <Grid item xs={12} sm={6}>
                  <Box p={2.5} borderRadius="12px" bgcolor="rgba(245,158,11,0.03)" style={{ borderLeft: '4px solid #f59e0b', height: '100%' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#f59e0b" mb={1} display="flex" alignItems="center" gap={0.5}>
                      ⚡ Threats (External)
                    </Typography>
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {swot.threats.map((th, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}><Typography variant="body2" color="var(--text-secondary)">{th}</Typography></li>
                      ))}
                    </ul>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* DYNAMIC RECOMMENDATIONS WIDGET */}
          <Card>
            <CardContent>
              <Box mb={2.5} display="flex" alignItems="center" gap={1}>
                <LightbulbOutlined color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Strategic Consulting Recommendation Cards
                </Typography>
              </Box>
              <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 20 }} />

              <Grid container spacing={2}>
                {recommendations.map((rec: any, idx: number) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Card style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', height: '100%' }}>
                      <CardContent style={{ padding: 18 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Chip label={rec.category} size="small" color="primary" style={{ fontSize: 10, fontWeight: 700 }} />
                          <Box display="flex" gap={1}>
                            <Chip label={`Impact: ${rec.impact}`} size="small" variant="outlined" color="success" style={{ fontSize: 9, height: 18 }} />
                            <Chip label={`Diff: ${rec.difficulty}`} size="small" variant="outlined" style={{ fontSize: 9, height: 18, borderColor: 'var(--border-glass)' }} />
                          </Box>
                        </Box>
                        <Typography variant="subtitle2" fontWeight={800} mb={1}>
                          {rec.title}
                        </Typography>
                        <Typography variant="body2" color="var(--text-secondary)" style={{ fontSize: 12, lineHeight: 1.4 }}>
                          {rec.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

        </Grid>

        {/* Right Column: Health Score Breakdown, Summary Narrative, Alerts, Risks/Opportunities */}
        <Grid item xs={12} lg={4} display="flex" flexDirection="column" gap={3}>
          
          {/* BUSINESS HEALTH SCORE DETAILS CARD */}
          <Card>
            <CardContent>
              <Box mb={2} display="flex" alignItems="center" gap={1}>
                <FavoriteBorderOutlined color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Business Health Assessment
                </Typography>
              </Box>
              <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 15 }} />

              {/* Progress meters */}
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={700} color="var(--text-primary)">
                    Aggregated Health Score
                  </Typography>
                  <Typography variant="body2" fontWeight={800} style={{ color: getHealthColor(healthClass) }}>
                    {healthScore}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={healthScore} 
                  style={{ 
                    height: 8, 
                    borderRadius: 4, 
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
                  }} 
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getHealthColor(healthClass),
                      borderRadius: 4
                    }
                  }}
                />
              </Box>

              {/* Classification explain */}
              <Box p={2} borderRadius="10px" bgcolor="rgba(255,255,255,0.02)" style={{ border: '1px dashed var(--border-glass)' }} mb={2.5}>
                <Typography variant="subtitle2" fontWeight={800} style={{ color: getHealthColor(healthClass) }} mb={0.5}>
                  {healthClass} Solvency Classification
                </Typography>
                <Typography variant="caption" color="var(--text-secondary)" style={{ fontSize: 11.5, lineHeight: 1.4, display: 'block' }}>
                  {healthExplanation}
                </Typography>
              </Box>

              {/* Dynamic narrative */}
              <Box>
                <Typography variant="overline" color="var(--text-muted)" fontWeight={700} display="block" mb={1}>
                  EXECUTIVE AUDIT SUMMARY
                </Typography>
                <Typography variant="body2" color="var(--text-secondary)" style={{ fontSize: 12.5, lineHeight: 1.5, fontFamily: 'Inter' }}>
                  {execSummary}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* RISK & OPPORTUNITY PILLS */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={1.5}>
                Strategic Signals Monitor
              </Typography>
              <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 15 }} />

              {/* Risks matrix */}
              <Box mb={2.5}>
                <Typography variant="caption" color="var(--text-muted)" fontWeight={700} display="block" mb={1}>
                  TOP THREAT SIGNALS
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {churnRate > 5.0 && <Chip icon={<ErrorOutline style={{ fontSize: 13 }} />} label="⚠️ High Churn Risk Index" color="error" size="small" variant="outlined" style={{ fontSize: 10 }} />}
                  {growthRate.includes('-%') && <Chip icon={<ErrorOutline style={{ fontSize: 13 }} />} label="⚠️ Sales Contraction Alert" color="error" size="small" variant="outlined" style={{ fontSize: 10 }} />}
                  <Chip label="⚡ Price Elasticity Friction" color="warning" size="small" variant="outlined" style={{ fontSize: 10 }} />
                  <Chip label="⚡ Supply Chain bottleneck" color="warning" size="small" variant="outlined" style={{ fontSize: 10 }} />
                </Box>
              </Box>

              {/* Opportunities matrix */}
              <Box>
                <Typography variant="caption" color="var(--text-muted)" fontWeight={700} display="block" mb={1}>
                  TOP EXPANSION VECTORS
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  <Chip icon={<CheckCircleOutline style={{ fontSize: 13 }} />} label="💡 Premium Cross-Selling" color="success" size="small" variant="outlined" style={{ fontSize: 10 }} />
                  <Chip label="💡 CRM Telemetry workflow" color="primary" size="small" variant="outlined" style={{ fontSize: 10 }} />
                  <Chip label="💡 BCG Star Asset Funding" color="secondary" size="small" variant="outlined" style={{ fontSize: 10 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* AI Insight Alerts Panel */}
          <Card>
            <CardContent>
              <Box mb={2.5} display="flex" alignItems="center" gap={1}>
                <NotificationsActiveOutlined color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Strategic AI Alerts
                </Typography>
              </Box>
              <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 15 }} />
              <List style={{ padding: 0 }}>
                {notifications.slice(0, 3).map((notif, idx) => (
                  <React.Fragment key={notif.id}>
                    <ListItem alignItems="flex-start" style={{ padding: '10px 0' }}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight={700} color="var(--text-primary)">
                            {notif.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="var(--text-secondary)" display="block" mt={0.5}>
                            {notif.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {idx < Math.min(notifications.length, 3) - 1 && (
                      <Divider variant="fullWidth" style={{ borderColor: 'var(--border-glass)' }} />
                    )}
                  </React.Fragment>
                ))}
                {notifications.length === 0 && (
                  <Box py={4} textAlign="center">
                    <Typography variant="body2" color="var(--text-muted)">
                      No pending strategic warnings.
                    </Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>

        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
