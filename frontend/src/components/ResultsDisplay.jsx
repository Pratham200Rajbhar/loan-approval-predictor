import React from 'react';
import { Sparkles, FileText, Check, AlertTriangle, Lightbulb, RefreshCcw } from 'lucide-react';

export default function ResultsDisplay({ result, resetForm }) {
  if (!result) {
    return (
      <div className="card results-card" style={{ justifyContent: 'center' }}>
        <div className="welcome-view">
          <div className="welcome-icon-wrapper">
            <Sparkles size={36} />
          </div>
          <h3>Approval Result</h3>
          <p>
            Fill out the form on the left and click "Check Approval Chances" to see your prediction here.
          </p>
        </div>
      </div>
    );
  }

  const { status, message, details } = result;
  const isApproved = status === 'Approved';
  const confidence = details.confidence_pct || 0;
  const totalIncome = details.total_income || 0;
  const monthlyEmi = details.monthly_emi || 0;
  const dependents = details.dependents !== undefined ? details.dependents : 0;
  
  // Calculate Debt-to-Income
  const dti = totalIncome > 0 ? Math.round((monthlyEmi / totalIncome) * 100) : 0;

  return (
    <div className="card results-card animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title">
          <FileText size={24} />
          Evaluation Result
        </h2>
        <button onClick={resetForm} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
          <RefreshCcw size={12} />
          Clear
        </button>
      </div>

      {/* 1. STATUS BANNER */}
      <div className={`result-status-banner ${isApproved ? 'approved' : 'rejected'}`}>
        <div className="status-badge-icon">
          {isApproved ? <Check size={28} /> : <AlertTriangle size={28} />}
        </div>
        <div className="status-headline">
          {isApproved ? 'Likely Approved' : 'Likely Rejected'}
        </div>
        <div className="status-message">
          {isApproved 
            ? "Congratulations! Based on your profile, your loan application is highly likely to be approved." 
            : "Unfortunately, based on your details, your application is likely to be rejected at this time."}
        </div>
      </div>

      {/* 2. CONFIDENCE METER */}
      <div className="confidence-container">
        <div className="confidence-header">Confidence Score</div>
        <div className="confidence-value">{confidence}%</div>
        <div className="linear-progress-wrapper">
          <div
            className={`linear-progress-bar ${isApproved ? 'approved' : 'rejected'}`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>
          Based on past loan approval trends and historical patterns.
        </div>
      </div>

      {/* 3. METRIC SUMMARY */}
      <div className="summary-container">
        <h3 className="summary-title">Your Financial Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Income</span>
            <span className="summary-value">₹{totalIncome.toLocaleString()}/mo</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Monthly Payment</span>
            <span className="summary-value">₹{monthlyEmi.toLocaleString()}/mo</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Payment-to-Income</span>
            <span className="summary-value" style={{ color: dti > 40 ? 'var(--error-color)' : 'inherit' }}>
              {dti}%
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Dependents</span>
            <span className="summary-value">{dependents}</span>
          </div>
        </div>
      </div>

      {/* 4. RECOMMENDATIONS & NEXT STEPS */}
      <div className={`tips-container ${isApproved ? 'info' : ''}`}>
        <Lightbulb size={20} className="tips-icon" />
        <div className="tips-content">
          <div className="tips-title">
            {isApproved ? 'Recommended Next Steps' : 'How to Improve Your Chances'}
          </div>
          <ul className="tips-list">
            {isApproved ? (
              <>
                <li>Gather your ID and proof of employment (job letter).</li>
                <li>Prepare your paystubs or tax returns from the last 2 months.</li>
                <li>Avoid opening new credit cards or buying expensive things right now.</li>
                <li>Ask banks for formal loan quotes.</li>
              </>
            ) : (
              <>
                <li><strong>Credit History:</strong> This is the most important factor. Pay off any past dues or credit card debt first.</li>
                <li><strong>Request a Lower Loan:</strong> Borrowing less money lowers your monthly payment and makes approval easier.</li>
                <li><strong>Add Co-Borrower:</strong> Applying with a family member who has good income helps lower the bank's risk.</li>
                <li><strong>Extend Term Length:</strong> Choosing a longer time to pay back (like 30 years) makes your monthly payments smaller.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
