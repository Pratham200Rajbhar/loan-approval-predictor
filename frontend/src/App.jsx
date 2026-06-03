import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoanForm from './components/LoanForm';
import ResultsDisplay from './components/ResultsDisplay';
import { AlertCircle } from 'lucide-react';

const BACKEND_URL = '';

function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to analyze loan application. Please verify server status.');
      }

      setPredictionResult(data);
    } catch (err) {
      console.error('Prediction API Error:', err);
      setError(err.message || 'Unable to connect to the prediction service. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <Navbar backendUrl={BACKEND_URL} />

      <main className="main-content">
        {/* Header Introduction */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
            Loan Approval Predictor
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Enter your details in the form below to see if your loan application is likely to be approved. We use a machine learning model to predict your chances.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="animate-fade-in" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            backgroundColor: 'var(--error-bg)',
            border: '1px solid var(--error-border)',
            color: 'var(--error-color)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.15rem' }}>Prediction Service Offline</div>
              <div style={{ fontSize: '0.85rem' }}>{error}</div>
            </div>
          </div>
        )}

        {/* Grid Dashboard */}
        <div className="dashboard-grid">
          <div>
            <LoanForm onSubmit={handlePredict} isLoading={isLoading} />
          </div>
          <div>
            <ResultsDisplay result={predictionResult} resetForm={handleReset} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginTop: '4rem',
        backgroundColor: 'var(--card-bg)'
      }}>
        <p>© {new Date().getFullYear()} CrediPredict Systems. Powered by Random Forest Credit Classification Model.</p>
        <p style={{ marginTop: '0.25rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>For informational and internal underwriting simulation purposes only.</p>
      </footer>
    </div>
  );
}

export default App;
