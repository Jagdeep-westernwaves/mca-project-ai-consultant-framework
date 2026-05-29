import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { runWhatIfSimulation } from '../store/consultingSlice';
import { Grid, Card, CardContent, Typography, Box, Slider, Button, Chip } from '@mui/material';
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
    <Box className="animate-fade-in">
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800} style={{ letterSpacing: -1, fontFamily: 'Inter' }}>
          What-If Simulation Engine
        </Typography>
        <Typography variant="subtitle2" color="var(--text-secondary)">
          Model organizational parameters and witness instant predictive forecasts for revenue and merchant churn.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sliders Input Panel */}
        <Grid item xs={12} md={4}>
          <Card style={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                <TuneOutlined color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Strategy Parameters
                </Typography>
              </Box>

              {/* Price adjustment slider */}
              <Box mb={3.5}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={600} color="var(--text-primary)">
                    Price Adjustment
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="var(--primary-color)">
                    {priceChange > 0 ? `+${priceChange}%` : `${priceChange}%`}
                  </Typography>
                </Box>
                <Slider
                  value={priceChange}
                  onChange={(_, val) => setPriceChange(val as number)}
                  min={-20}
                  max={30}
                  step={0.5}
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="var(--text-muted)">
                  Simulates demand shifts based on pricing elasticity
                </Typography>
              </Box>

              {/* Supply delay slider */}
              <Box mb={3.5}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={600} color="var(--text-primary)">
                    Supply Chain Delay
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="var(--accent-warning)">
                    {delayDays} Days
                  </Typography>
                </Box>
                <Slider
                  value={delayDays}
                  onChange={(_, val) => setDelayDays(val as number)}
                  min={0}
                  max={15}
                  step={1}
                  valueLabelDisplay="auto"
                  color="warning"
                />
                <Typography variant="caption" color="var(--text-muted)">
                  Models logistic friction and delivery lag
                </Typography>
              </Box>

              {/* Marketing reallocation slider */}
              <Box mb={4}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={600} color="var(--text-primary)">
                    Marketing Budget Lift
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="var(--accent-success)">
                    +${marketingBudget}k
                  </Typography>
                </Box>
                <Slider
                  value={marketingBudget}
                  onChange={(_, val) => setMarketingBudget(val as number)}
                  min={0}
                  max={100}
                  step={5}
                  valueLabelDisplay="auto"
                  color="secondary"
                />
                <Typography variant="caption" color="var(--text-muted)">
                  Reallocates OpEx to trigger positive growth loops
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSimulate}
                style={{
                  padding: '12px 0',
                  fontWeight: 700,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 16px 0 rgba(59,130,246,0.3)'
                }}
              >
                Run Consulting Simulation
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts & Simulation Output Panel */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3} mb={3}>
            {/* Churn Change KPI Card */}
            <Grid item xs={6}>
              <Card>
                <CardContent style={{ padding: '16px 20px' }}>
                  <Typography variant="overline" color="var(--text-muted)" fontWeight={700}>
                    Simulated Churn Attrition
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                    <Typography variant="h5" fontWeight={800}>
                      {summary.simulated_churn_rate}%
                    </Typography>
                    <Chip 
                      label={`Base: ${summary.baseline_churn_rate}%`} 
                      size="small" 
                      color={summary.simulated_churn_rate > summary.baseline_churn_rate ? 'warning' : 'success'} 
                      style={{ fontSize: 10, fontWeight: 700, height: 20 }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Revenue Change KPI Card */}
            <Grid item xs={6}>
              <Card>
                <CardContent style={{ padding: '16px 20px' }}>
                  <Typography variant="overline" color="var(--text-muted)" fontWeight={700}>
                    Simulated Net Revenue Lift
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1.5} mt={1}>
                    <Typography variant="h5" fontWeight={800} style={{ color: summary.revenue_change_percent >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                      {summary.revenue_change_percent >= 0 ? `+${summary.revenue_change_percent}%` : `${summary.revenue_change_percent}%`}
                    </Typography>
                    <Typography variant="caption" color="var(--text-secondary)">
                      vs standard baseline
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Bar Chart comparing Baseline and Simulated */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={3}>
                Baseline Revenue vs. Simulated Strategy Outcome
              </Typography>
              <Box height={280}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" />
                    <XAxis dataKey="month" tickFormatter={(m) => `Month ${m}`} stroke="var(--text-muted)" style={{ fontSize: 11, fontFamily: 'Inter' }} />
                    <YAxis stroke="var(--text-muted)" tickFormatter={(val) => `$${val/1000}k`} style={{ fontSize: 11, fontFamily: 'Inter' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-glass)',
                        borderRadius: 12,
                        fontFamily: 'Inter'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
                    <Bar dataKey="baseline" name="Baseline Series" fill="var(--text-muted)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="simulated" name="Simulated Strategy" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* AI Advisory Summary Alert */}
          <Card style={{ marginTop: 20 }}>
            <CardContent>
              <Box display="flex" gap={1.5}>
                <LightbulbOutlined color="primary" style={{ marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                    AI Consulting Assessment
                  </Typography>
                  <Typography variant="body2" color="var(--text-secondary)" style={{ fontSize: 12.5, lineHeight: 1.5, fontFamily: 'Inter' }}>
                    {advisoryAssessment}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
