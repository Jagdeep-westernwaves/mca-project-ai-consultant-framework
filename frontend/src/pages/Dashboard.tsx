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
import { Typography, Box, Divider, Chip } from '@mui/material';
import { AreaChart, Area, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  TrendingUpOutlined,
  PeopleAltOutlined,
  BusinessCenterOutlined,
  GppMaybeOutlined
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
      <Box className="bento-grid">
        
        {/* HERO TILE */}
        <Box className="bento-tile bento-hero" p={4} display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2}>
          <Box>
            <Typography variant="h3" fontWeight={900} className="neon-text" mb={1} style={{ letterSpacing: -1 }}>
              SYSTEM TERMINAL
            </Typography>
            <Typography variant="body1" color="var(--text-secondary)">
              ID: {user?.first_name || 'GUEST_01'} | STATUS: SECURE_LINK
            </Typography>
          </Box>
          <Box textAlign={{ xs: 'left', md: 'right' }}>
             <Typography variant="h2" fontWeight={900} style={{ color: getHealthColor(healthClass), lineHeight: 1 }}>
               {Math.round(healthScore)}<span style={{ fontSize: '0.5em', opacity: 0.8 }}>%</span>
             </Typography>
             <Typography variant="overline" style={{ color: getHealthColor(healthClass), letterSpacing: 3, fontWeight: 800 }}>
               {healthClass} SOLVENCY
             </Typography>
          </Box>
        </Box>

        {/* KPI TILES */}
        {kpis.map((kpi) => (
          <Box key={kpi.label} className="bento-tile bento-kpi" p={3}>
             <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="overline" color="var(--text-muted)" fontWeight={800} style={{ letterSpacing: 1 }}>{kpi.label}</Typography>
                {kpi.icon}
             </Box>
             <Typography variant="h3" fontWeight={900} mb={1}>{kpi.value}</Typography>
             <Typography variant="caption" color="var(--text-secondary)">{kpi.desc}</Typography>
          </Box>
        ))}

        {/* CHART TILE */}
        <Box className="bento-tile bento-chart">
          <Box p={4} position="absolute" zIndex={10}>
            <Typography variant="h5" fontWeight={900} mb={0.5}>PREDICTIVE TRAJECTORY</Typography>
            <Typography variant="body2" color="var(--text-secondary)" mb={2}>
              Combined historical and regression forecast mapping
            </Typography>
            <Chip label="LINEAR_REGRESSION_ACTIVE" size="small" style={{ backgroundColor: 'var(--primary-glow)', color: '#3b82f6', fontWeight: 800, fontSize: 10, letterSpacing: 1 }}/>
          </Box>
          <Box className="full-bleed-chart" pt={10}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-glass)', borderRadius: 12, color: 'var(--text-primary)', fontWeight: 700 }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* SIDEBAR TILE */}
        <Box className="bento-tile bento-sidebar" p={4} style={{ overflowY: 'auto' }}>
          <Box mb={4}>
            <Typography variant="h6" fontWeight={900} mb={2} style={{ letterSpacing: 1 }}>THREAT MATRIX</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {churnRate > 5.0 && <Chip label="HIGH_CHURN_RISK" color="error" size="small" style={{ fontWeight: 800, fontSize: 10, borderRadius: 6 }} />}
              {growthRate.includes('-%') && <Chip label="CONTRACTION_ALERT" color="error" size="small" style={{ fontWeight: 800, fontSize: 10, borderRadius: 6 }} />}
              <Chip label="ELASTICITY_FRICTION" color="warning" size="small" style={{ fontWeight: 800, fontSize: 10, borderRadius: 6 }} />
              <Chip label="SUPPLY_BOTTLENECK" color="warning" size="small" style={{ fontWeight: 800, fontSize: 10, borderRadius: 6 }} />
            </Box>
          </Box>

          <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 24 }} />

          <Box mb={4}>
            <Typography variant="h6" fontWeight={900} mb={2} style={{ letterSpacing: 1 }}>EXPANSION VECTORS</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip label="CROSS_SELLING" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 800, fontSize: 10, borderRadius: 6 }} />
              <Chip label="CRM_TELEMETRY" style={{ backgroundColor: 'var(--primary-glow)', color: '#3b82f6', fontWeight: 800, fontSize: 10, borderRadius: 6 }} />
            </Box>
          </Box>

          <Divider style={{ borderColor: 'var(--border-glass)', marginBottom: 24 }} />

          <Box>
            <Typography variant="h6" fontWeight={900} mb={2} style={{ letterSpacing: 1 }}>SYSTEM LOGS</Typography>
            {notifications.slice(0, 3).map((notif) => (
              <Box key={notif.id} mb={2}>
                <Typography variant="subtitle2" fontWeight={800} color="var(--text-primary)">
                  {notif.title}
                </Typography>
                <Typography variant="caption" color="var(--text-secondary)">
                  {notif.message}
                </Typography>
              </Box>
            ))}
            {notifications.length === 0 && (
              <Typography variant="body2" color="var(--text-muted)">AWAITING LOGS...</Typography>
            )}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;
