import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/api';

interface ClientState {
  id: number;
  name: string;
  industry: string;
  annual_revenue: number;
  employee_count: number;
  assigned_consultant_detail?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

interface ProjectState {
  id: number;
  client: number;
  client_detail?: ClientState;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  start_date: string;
  end_date: string;
  budget: number;
}

interface DatasetState {
  id: number;
  client: number;
  client_detail?: ClientState;
  file_name: string;
  file_type: string;
  record_count: number;
  uploaded_at: string;
}

interface ReportState {
  id: number;
  client: number;
  client_detail?: ClientState;
  title: string;
  report_type: string;
  file_path: string;
  created_at: string;
}

interface NotificationState {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface AuditLogState {
  id: number;
  username: string;
  role: string;
  action: string;
  description: string;
  ip_address: string;
  created_at: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface ConsultingState {
  clients: ClientState[];
  projects: ProjectState[];
  datasets: DatasetState[];
  reports: ReportState[];
  notifications: NotificationState[];
  auditLogs: AuditLogState[];
  salesForecast: any | null;
  churnAnalysis: any | null;
  riskAnalysis: any | null;
  simulation: any | null;
  strategicAdvice: any | null;
  chatHistory: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ConsultingState = {
  clients: [],
  projects: [],
  datasets: [],
  reports: [],
  notifications: [],
  auditLogs: [],
  salesForecast: null,
  churnAnalysis: null,
  riskAnalysis: null,
  simulation: null,
  strategicAdvice: null,
  chatHistory: [
    { sender: 'bot', text: 'Hello! I am your AI Consulting Bot. Ask me anything about your dashboard metrics or run strategic simulations!' }
  ],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchClients = createAsyncThunk('consulting/fetchClients', async () => {
  const res = await api.get('/clients/');
  return res.data;
});

export const createClient = createAsyncThunk('consulting/createClient', async (data: Partial<ClientState>) => {
  const res = await api.post('/clients/', data);
  return res.data;
});

export const fetchProjects = createAsyncThunk('consulting/fetchProjects', async () => {
  const res = await api.get('/projects/');
  return res.data;
});

export const createProject = createAsyncThunk('consulting/createProject', async (data: Partial<ProjectState>) => {
  const res = await api.post('/projects/', data);
  return res.data;
});

export const fetchDatasets = createAsyncThunk('consulting/fetchDatasets', async () => {
  const res = await api.get('/data/upload/');
  return res.data;
});

export const fetchReports = createAsyncThunk('consulting/fetchReports', async () => {
  const res = await api.get('/reports/');
  return res.data;
});

export const createReport = createAsyncThunk('consulting/createReport', async (data: { client: number; title: string; report_type: string }) => {
  const res = await api.post('/reports/generate/', data);
  return res.data;
});

export const fetchNotifications = createAsyncThunk('consulting/fetchNotifications', async () => {
  const res = await api.get('/notifications/');
  return res.data;
});

export const markNotificationRead = createAsyncThunk('consulting/markRead', async (id: number) => {
  await api.post(`/notifications/${id}/read/`);
  return id;
});

export const fetchAuditLogs = createAsyncThunk('consulting/fetchAuditLogs', async () => {
  const res = await api.get('/audit/');
  return res.data;
});

// AI & ML Actions
export const runSalesForecast = createAsyncThunk('consulting/runForecast', async (data: { dataset_id?: number; months_to_forecast: number }) => {
  const res = await api.post('/ai/forecast/', data);
  return res.data;
});

export const runChurnAnalysis = createAsyncThunk('consulting/runChurn', async (data: { dataset_id?: number }) => {
  const res = await api.post('/ai/churn/', data);
  return res.data;
});

export const runRiskAnalysis = createAsyncThunk('consulting/runRisk', async (data: Record<string, number>) => {
  const res = await api.post('/ai/risk/', data);
  return res.data;
});

export const runWhatIfSimulation = createAsyncThunk('consulting/runSim', async (data: { price_change_percent: number; delay_days: number; budget_reallocation_kUSD: number }) => {
  const res = await api.post('/ai/simulate/', data);
  return res.data;
});

export const fetchStrategicAdvice = createAsyncThunk('consulting/fetchAdvice', async (_, thunkAPI: any) => {
  const state = thunkAPI.getState().consulting;
  const churn = state.churnAnalysis?.prediction_results?.summary?.predicted_churn_rate || 4.2;
  const growth = state.salesForecast?.prediction_results?.metrics?.r2_score 
    ? (state.salesForecast.prediction_results.metrics.r2_score * 0.05) 
    : 0.035;
  const risk = state.riskAnalysis?.prediction_results?.risk_score || 4;
  const sentiment = state.churnAnalysis?.prediction_results?.metrics?.feature_importances?.satisfaction
    ? state.churnAnalysis.prediction_results.metrics.feature_importances.satisfaction
    : 0.65;
  const delay = state.simulation?.parameters?.delay_days || 2.0;

  const kpis = {
    revenue_growth: parseFloat(growth.toString()),
    churn_rate: parseFloat(churn.toString()),
    risk_score: parseInt(risk.toString()),
    sentiment_score: parseFloat(sentiment.toString()),
    delay_days: parseFloat(delay.toString())
  };

  const res = await api.post('/recommendations/advice/', { kpis });
  return res.data;
});

export const queryChatbot = createAsyncThunk('consulting/queryChat', async (query: string, thunkAPI: any) => {
  // Capture active metrics as context for smart answers
  const state = thunkAPI.getState().consulting;
  const context = {
    client_name: state.clients[0]?.name || 'Acme Corp',
    current_revenue: state.clients[0]?.annual_revenue ? `$${(state.clients[0].annual_revenue/1000000).toFixed(1)}M` : '$1.8M',
    churn_risk: state.churnAnalysis?.prediction_results?.summary?.predicted_churn_rate ? `${state.churnAnalysis.prediction_results.summary.predicted_churn_rate}%` : '4.2%',
    risk_level: state.riskAnalysis?.prediction_results?.risk_level || 'Medium'
  };

  const res = await api.post('/recommendations/chat/', { query, context });
  return res.data.response;
});

const consultingSlice = createSlice({
  name: 'consulting',
  initialState,
  reducers: {
    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatHistory.push(action.payload);
    },
    clearConsultingError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetching entities
      .addCase(fetchClients.fulfilled, (state, action) => { state.clients = action.payload; })
      .addCase(createClient.fulfilled, (state, action) => { state.clients.unshift(action.payload); })
      
      .addCase(fetchProjects.fulfilled, (state, action) => { state.projects = action.payload; })
      .addCase(createProject.fulfilled, (state, action) => { state.projects.unshift(action.payload); })
      
      .addCase(fetchDatasets.fulfilled, (state, action) => { state.datasets = action.payload; })
      
      .addCase(fetchReports.fulfilled, (state, action) => { state.reports = action.payload; })
      .addCase(createReport.fulfilled, (state, action) => { state.reports.unshift(action.payload); })
      
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.notifications = action.payload; })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map(n => n.id === action.payload ? { ...n, is_read: true } : n);
      })
      
      .addCase(fetchAuditLogs.fulfilled, (state, action) => { state.auditLogs = action.payload; })

      // ML Predictions
      .addCase(runSalesForecast.fulfilled, (state, action) => { state.salesForecast = action.payload; })
      .addCase(runChurnAnalysis.fulfilled, (state, action) => { state.churnAnalysis = action.payload; })
      .addCase(runRiskAnalysis.fulfilled, (state, action) => { state.riskAnalysis = action.payload; })
      .addCase(fetchStrategicAdvice.fulfilled, (state, action) => { state.strategicAdvice = action.payload; })
      .addCase(runWhatIfSimulation.fulfilled, (state, action) => { state.simulation = action.payload; })

      // Chatbot answers
      .addCase(queryChatbot.fulfilled, (state, action: PayloadAction<string>) => {
        state.chatHistory.push({ sender: 'bot', text: action.payload });
      });
  }
});

export const { addChatMessage, clearConsultingError } = consultingSlice.actions;
export default consultingSlice.reducer;
export type { ClientState, ProjectState, DatasetState, ReportState, NotificationState, AuditLogState, ChatMessage };
