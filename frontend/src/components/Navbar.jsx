import React, { useEffect, useState } from 'react';
import { ShieldCheck, Server, AlertCircle } from 'lucide-react';

export default function Navbar({ backendUrl }) {
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${backendUrl}/health`, { method: 'GET' });
        if (response.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        setApiStatus('offline');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <ShieldCheck className="brand-logo-icon" size={28} />
          <span className="brand-text">CrediPredict</span>
        </div>
        <div className="navbar-actions">
          {apiStatus === 'checking' && (
            <span className="api-badge offline animate-fade-in" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-light)', borderColor: 'var(--border-color)' }}>
              Checking connection...
            </span>
          )}
          {apiStatus === 'online' && (
            <span className="api-badge online animate-fade-in" title="FastAPI Backend is running and connected">
              <span className="pulse-dot"></span>
              <Server size={14} />
              API Connected
            </span>
          )}
          {apiStatus === 'offline' && (
            <span className="api-badge offline animate-fade-in" title="Could not connect to FastAPI Backend. Is it running on port 8000?">
              <AlertCircle size={14} />
              API Disconnected
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
