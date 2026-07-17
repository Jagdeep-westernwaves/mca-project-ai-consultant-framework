import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { runWhatIfSimulation } from '../store/consultingSlice';
import { Typography, Box, Slider, Button, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TuneOutlined, LightbulbOutlined } from '@mui/icons-material';

const Analytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { simulation } = useSelector((state: RootState) => state.consulting);

  // Local state for interactive sliders
  const [priceChange, setPriceChange] = useState(5.0);
  const [delayDays, setDelayDays] = useState(2.0);
  const [marketingBudget, setMarketingBudget] = useState(20.0);

  const handleSimulate = () => {
    dispatch(runWhatIfSimulation({
      price_change_percent: priceChange,
      delay_days: delayDays,
      budget_reallocation_kUSD: marketingBudget
    }));
  };

  useEffect(() => {
    // Initial run of the simulation engine with default values if empty
    if (!simulation) {
      handleSimulate();
    }
  }, [dispatch]);

  // Read comparison data and summaries
  const chartData = simulation?.comparison || [];
  const summary = simulation?.summary || {
    baseline_total_revenue: 1650000,
    simulated_total_revenue: 1720000,
    revenue_change_percent: 4.24,
    baseline_churn_rate: 4.2,
    simulated_churn_rate: 3.8
  };
  const advisoryAssessment = simulation?.consulting_assessment || 
    "Evaluating parameters. Drag the sliders on the left and click 'Run Consulting Simulation' to analyze structural effects.";

  return (
    <Box className="animate-fade-in" style={{ padding: '0 24px' }}>
      <Box mb={4} className="bento-tile" style={{ padding: '24px 32px' }}>
        <Typography variant="h3" fontWeight={900} className="neon-text" style={{ letterSpacing: -1 }}>
          PREDICTIVE SIMULATION
        </Typography>
        <Typography variant="overline" style={{ color: 'var(--text-secondary)', letterSpacing: 3, fontWeight: 800 }}>
          STRATEGIC WHAT-IF FORECASTING ENGINE
        </Typography>
      </Box>

      <Box className="bento-grid">
        {/* Sliders Input Panel (Span 4 columns) */}
        <Box className="bento-tile" style={{ gridColumn: 'span 4' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={4}>
            <TuneOutlined style={{ color: '#3b82f6', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={900} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              SIMULATION PARAMETERS
            </Typography>
          </Box>

          {/* Price adjustment slider */}
          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="overline" fontWeight={800} style={{ color: 'var(--text-muted)' }}>
                PRICE ADJUSTMENT
              </Typography>
              <Typography variant="body2" fontWeight={900} style={{ color: '#3b82f6' }}>
                {priceChange > 0 ? `+${priceChange}%` : `${priceChange}%`}
              </Typography>
            </Box>
            <Slider
              value={priceChange}
              onChange={(_, val) => setPriceChange(val as number)}
              min={-20}
              max={30}
              step={0.5}
              sx={{ color: '#3b82f6', '& .MuiSlider-thumb': { boxShadow: '0 0 10px rgba(59,130,246,0.8)' } }}
            />
          </Box>

          {/* Supply delay slider */}
          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="overline" fontWeight={800} style={{ color: 'var(--text-muted)' }}>
                SUPPLY DELAY
              </Typography>
              <Typography variant="body2" fontWeight={900} style={{ color: '#f59e0b' }}>
                {delayDays} DAYS
              </Typography>
            </Box>
            <Slider
              value={delayDays}
              onChange={(_, val) => setDelayDays(val as number)}
              min={0}
              max={15}
              step={1}
              sx={{ color: '#f59e0b', '& .MuiSlider-thumb': { boxShadow: '0 0 10px rgba(245,158,11,0.8)' } }}
            />
          </Box>

          {/* Marketing reallocation slider */}
          <Box mb={5}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="overline" fontWeight={800} style={{ color: 'var(--text-muted)' }}>
                OPEX REALLOCATION
              </Typography>
              <Typography variant="body2" fontWeight={900} style={{ color: '#10b981' }}>
                +${marketingBudget}K
              </Typography>
            </Box>
            <Slider
              value={marketingBudget}
              onChange={(_, val) => setMarketingBudget(val as number)}
              min={0}
              max={100}
              step={5}
              sx={{ color: '#10b981', '& .MuiSlider-thumb': { boxShadow: '0 0 10px rgba(16,185,129,0.8)' } }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSimulate}
            style={{
              padding: '16px 0',
              fontWeight: 900,
              letterSpacing: 2,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: '0 0 20px rgba(59,130,246,0.5)'
            }}
          >
            EXECUTE SIMULATION
          </Button>
        </Box>

        {/* Output Panel (Span 8 columns) */}
        <Box style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <Box className="bento-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <Box className="bento-tile" style={{ padding: '24px' }}>
              <Typography variant="overline" style={{ color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 2 }}>
                ATTRITION RATE DELTA
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Typography variant="h3" fontWeight={900} style={{ color: summary.simulated_churn_rate > summary.baseline_churn_rate ? '#ef4444' : '#10b981' }}>
                  {summary.simulated_churn_rate}%
                </Typography>
                <Chip 
                  label={`BASE: ${summary.baseline_churn_rate}%`} 
                  style={{ backgroundColor: 'var(--border-glass)', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: 1 }} 
                />
              </Box>
            </Box>

            <Box className="bento-tile" style={{ padding: '24px' }}>
              <Typography variant="overline" style={{ color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 2 }}>
                REVENUE LIFT FORECAST
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Typography variant="h3" fontWeight={900} style={{ color: summary.revenue_change_percent >= 0 ? '#10b981' : '#ef4444' }}>
                  {summary.revenue_change_percent >= 0 ? `+${summary.revenue_change_percent}%` : `${summary.revenue_change_percent}%`}
                </Typography>
                <Chip 
                  label="VS BASELINE" 
                  style={{ backgroundColor: 'var(--border-glass)', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: 1 }} 
                />
              </Box>
            </Box>
          </Box>

          <Box className="bento-tile" style={{ padding: 0, overflow: 'hidden' }}>
            <Box p={3} borderBottom="1px solid var(--border-glass)">
               <Typography variant="overline" fontWeight={900} style={{ letterSpacing: 2, color: 'var(--text-secondary)' }}>
                 BASELINE VS SIMULATED TRAJECTORY
               </Typography>
            </Box>
            <Box height={320} p={3}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tickFormatter={(m) => `M${m}`} stroke="#64748b" style={{ fontSize: 12, fontWeight: 800 }} />
                  <YAxis stroke="#64748b" tickFormatter={(val) => `$${val/1000}k`} style={{ fontSize: 12, fontWeight: 800 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      borderColor: 'var(--border-glass)',
                      borderRadius: 8,
                      color: 'var(--text-primary)',
                      fontWeight: 800
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }} />
                  <Bar dataKey="baseline" name="BASELINE DATA" fill="#334155" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="simulated" name="SIMULATED OUTCOME" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box className="bento-tile" style={{ padding: '24px' }}>
            <Box display="flex" gap={2} alignItems="flex-start">
              <LightbulbOutlined style={{ color: '#10b981', fontSize: 28, marginTop: 4 }} />
              <Box>
                <Typography variant="overline" fontWeight={900} style={{ letterSpacing: 2, color: 'var(--text-muted)' }}>
                  SYSTEM ADVISORY
                </Typography>
                <Typography variant="body1" style={{ color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.6, marginTop: 4 }}>
                  {advisoryAssessment}
                </Typography>
              </Box>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default Analytics;
