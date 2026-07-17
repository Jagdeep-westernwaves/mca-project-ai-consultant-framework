import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addChatMessage, queryChatbot } from '../store/consultingSlice';
import { Box, Typography, TextField, IconButton, Paper, Slide, CircularProgress, Fab } from '@mui/material';
import { ChatBubbleOutline, Send, Close, Assistant } from '@mui/icons-material';

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const chatHistory = useSelector((state: RootState) => state.consulting.chatHistory);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery('');
    
    // Add user message to Redux state
    dispatch(addChatMessage({ sender: 'user', text: userText }));
    setIsTyping(true);

    try {
      // Execute thunk which sends query + dashboard context to backend chatbot
      await dispatch(queryChatbot(userText)).unwrap();
    } catch (err) {
      dispatch(addChatMessage({ 
        sender: 'bot', 
        text: "Apologies, I encountered an advisory routing latency. Please ensure the Django backend server is running." 
      }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button Trigger */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: '0 8px 32px 0 rgba(59, 130, 246, 0.4)',
        }}
      >
        {isOpen ? <Close /> : <Assistant />}
      </Fab>

      {/* Slide-out Glassy Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: 100,
            right: 30,
            width: 380,
            height: 520,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '20px',
            border: '1px solid var(--border-glass)',
          }}
        >
          {/* Header */}
          <Box
            p={2}
            bgcolor="var(--primary-color)"
            color="#fff"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ChatBubbleOutline fontSize="small" color="primary" />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  AI Consulting Bot
                </Typography>
                <Typography variant="caption" style={{ opacity: 0.8 }}>
                  Context-Aware Strategy Advisor
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} style={{ color: '#fff' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Body */}
          <Box flexGrow={1} p={2.5} overflow="auto" display="flex" flexDirection="column" gap={1.5}>
            {chatHistory.map((msg, idx) => (
              <Box
                key={idx}
                alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                maxWidth="85%"
              >
                <Box
                  p={1.5}
                  borderRadius={msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px'}
                  bgcolor={msg.sender === 'user' ? 'var(--primary-color)' : 'var(--primary-glow)'}
                  color={msg.sender === 'user' ? '#fff' : 'var(--text-primary)'}
                  border={msg.sender === 'user' ? 'none' : '1px solid var(--border-glass)'}
                >
                  {/* Parse basic markdown styling like headers and bullets */}
                  <Typography 
                    variant="body2" 
                    style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: 12.5,
                      lineHeight: 1.4,
                      fontFamily: 'var(--font-primary)' 
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box alignSelf="flex-start" display="flex" alignItems="center" gap={1} p={1}>
                <CircularProgress size={12} color="primary" />
                <Typography variant="caption" color="var(--text-muted)">
                  Formulating strategy...
                </Typography>
              </Box>
            )}
            <div ref={messageEndRef} />
          </Box>

          {/* Footer Input Form */}
          <Box component="form" onSubmit={handleSend} p={2} borderTop="1px solid var(--border-glass)">
            <Box display="flex" gap={1}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Ask about sales, risk, or pricing..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                InputProps={{
                  style: {
                    borderRadius: 10,
                    fontSize: 12.5,
                    fontFamily: 'var(--font-primary)',
                    backgroundColor: 'rgba(255,255,255,0.03)'
                  }
                }}
              />
              <IconButton 
                type="submit" 
                color="primary" 
                disabled={!query.trim()}
                style={{ 
                  backgroundColor: query.trim() ? 'var(--primary-color)' : 'transparent',
                  color: query.trim() ? '#fff' : 'var(--text-muted)',
                  borderRadius: 10 
                }}
              >
                <Send fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default AIChatAssistant;
