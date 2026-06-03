import React, { useState } from 'react';
import { User, DollarSign, Home, CheckCircle2, HelpCircle } from 'lucide-react';

const Tooltip = ({ text }) => (
  <span className="tooltip-container">
    <HelpCircle size={14} className="tooltip-icon" />
    <span className="tooltip-content">{text}</span>
  </span>
);

export default function LoanForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    Gender: 'Male',
    Married: 'Yes',
    Dependents: '0',
    Education: 'Graduate',
    Self_Employed: 'No',
    ApplicantIncome: 50000,
    CoapplicantIncome: 15000,
    LoanAmount: 150, // in thousands
    Loan_Amount_Term: 360, // in months
    Credit_History: 1.0,
    Property_Area: 'Urban',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (formData.ApplicantIncome <= 0 || isNaN(formData.ApplicantIncome)) {
      newErrors.ApplicantIncome = 'Income must be greater than ₹0';
    }
    if (formData.CoapplicantIncome < 0 || isNaN(formData.CoapplicantIncome)) {
      newErrors.CoapplicantIncome = 'Co-applicant income must be ₹0 or more';
    }
    if (formData.LoanAmount <= 0 || isNaN(formData.LoanAmount)) {
      newErrors.LoanAmount = 'Loan amount must be greater than ₹0';
    }
    if (formData.Loan_Amount_Term <= 0 || isNaN(formData.Loan_Amount_Term)) {
      newErrors.Loan_Amount_Term = 'Term must be greater than 0 months';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Parse numeric fields
    if (['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Credit_History'].includes(name)) {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = '';
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSegmentChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Live Metrics Calculations
  const combinedIncome = (Number(formData.ApplicantIncome) || 0) + (Number(formData.CoapplicantIncome) || 0);
  const loanAmountInDollars = (Number(formData.LoanAmount) || 0) * 1000;
  const loanTermMonths = Number(formData.Loan_Amount_Term) || 1;
  const estimatedEMI = combinedIncome > 0 ? Math.round(loanAmountInDollars / loanTermMonths) : 0;
  const emiPercentageOfIncome = combinedIncome > 0 ? Math.round((estimatedEMI / combinedIncome) * 100) : 0;

  const isDtiTooHigh = emiPercentageOfIncome > 40;

  return (
    <div className="card">
      <h2 className="card-title">
        <User size={24} />
        Loan Application Form
      </h2>
      <p className="card-subtitle">
        Fill in your details below. Hover over the <HelpCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> icons if you need help understanding any field.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* SECTION 1: ABOUT YOU */}
        <div className="form-section">
          <h3 className="section-header">
            <User size={18} /> About You
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Gender
                <Tooltip text="Select your gender." />
              </label>
              <div className="segmented-control">
                {['Male', 'Female'].map((option) => (
                  <div key={option} className="segmented-option">
                    <input
                      type="radio"
                      id={`gender-${option}`}
                      name="Gender"
                      checked={formData.Gender === option}
                      onChange={() => handleSegmentChange('Gender', option)}
                    />
                    <label htmlFor={`gender-${option}`} className="segmented-label">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Are you married?
                <Tooltip text="Select whether you are currently married. This helps assess household stability." />
              </label>
              <div className="segmented-control">
                {['Yes', 'No'].map((option) => (
                  <div key={option} className="segmented-option">
                    <input
                      type="radio"
                      id={`married-${option}`}
                      name="Married"
                      checked={formData.Married === option}
                      onChange={() => handleSegmentChange('Married', option)}
                    />
                    <label htmlFor={`married-${option}`} className="segmented-label">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Dependents
                <Tooltip text="Number of children or other family members who rely on your income." />
              </label>
              <div className="segmented-control">
                {['0', '1', '2', '3+'].map((option) => (
                  <div key={option} className="segmented-option">
                    <input
                      type="radio"
                      id={`dependents-${option}`}
                      name="Dependents"
                      checked={formData.Dependents === option}
                      onChange={() => handleSegmentChange('Dependents', option)}
                    />
                    <label htmlFor={`dependents-${option}`} className="segmented-label">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Education
                <Tooltip text="Select 'Graduate' if you have finished a college or university degree." />
              </label>
              <div className="segmented-control">
                {[
                  { label: 'Graduate', value: 'Graduate' },
                  { label: 'Not Graduate', value: 'Not Graduate' },
                ].map((option) => (
                  <div key={option.value} className="segmented-option">
                    <input
                      type="radio"
                      id={`education-${option.value}`}
                      name="Education"
                      checked={formData.Education === option.value}
                      onChange={() => handleSegmentChange('Education', option.value)}
                    />
                    <label htmlFor={`education-${option.value}`} className="segmented-label">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group form-grid-full">
              <label className="form-label">
                Are you self-employed?
                <Tooltip text="Select 'Yes' if you run your own business, work freelance, or do contract work." />
              </label>
              <div className="segmented-control">
                {['Yes', 'No'].map((option) => (
                  <div key={option} className="segmented-option">
                    <input
                      type="radio"
                      id={`self-employed-${option}`}
                      name="Self_Employed"
                      checked={formData.Self_Employed === option}
                      onChange={() => handleSegmentChange('Self_Employed', option)}
                    />
                    <label htmlFor={`self-employed-${option}`} className="segmented-label">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: INCOME DETAILS */}
        <div className="form-section">
          <h3 className="section-header">
            <DollarSign size={18} /> Income Details
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span>
                  Your Monthly Income
                  <Tooltip text="Your personal monthly earnings before taxes (e.g. basic salary, bonuses)." />
                </span>
                <span className="label-aside">INR (₹)</span>
              </label>
              <input
                type="number"
                name="ApplicantIncome"
                className={`input-control ${errors.ApplicantIncome ? 'error' : ''}`}
                value={formData.ApplicantIncome}
                onChange={handleChange}
                min="1"
              />
              {errors.ApplicantIncome && <span className="error-message">{errors.ApplicantIncome}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>
                  Co-applicant's Income
                  <Tooltip text="Monthly income of your partner or co-borrower, if any. Enter 0 if you are applying alone." />
                </span>
                <span className="label-aside">INR (₹)</span>
              </label>
              <input
                type="number"
                name="CoapplicantIncome"
                className={`input-control ${errors.CoapplicantIncome ? 'error' : ''}`}
                value={formData.CoapplicantIncome}
                onChange={handleChange}
                min="0"
              />
              {errors.CoapplicantIncome && <span className="error-message">{errors.CoapplicantIncome}</span>}
            </div>
          </div>
        </div>

        {/* SECTION 3: LOAN DETAILS */}
        <div className="form-section">
          <h3 className="section-header">
            <Home size={18} /> Loan Details
          </h3>
          <div className="form-grid">
            <div className="form-group form-grid-full slider-container">
              <label className="form-label">
                <span>
                  Loan Amount
                  <Tooltip text="The total money you wish to borrow. (e.g., ₹150k means ₹150,000)." />
                </span>
                <span className="label-aside">₹{(formData.LoanAmount * 1000).toLocaleString()} ({formData.LoanAmount}k)</span>
              </label>
              <div className="slider-inputs">
                <input
                  type="range"
                  name="LoanAmount"
                  min="10"
                  max="700"
                  step="5"
                  className="slider-bar"
                  value={formData.LoanAmount || 10}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="LoanAmount"
                  style={{ width: '90px' }}
                  className={`input-control ${errors.LoanAmount ? 'error' : ''}`}
                  value={formData.LoanAmount}
                  onChange={handleChange}
                />
              </div>
              {errors.LoanAmount && <span className="error-message">{errors.LoanAmount}</span>}
            </div>

            <div className="form-group form-grid-full slider-container">
              <label className="form-label">
                <span>
                  Repayment Term
                  <Tooltip text="The time you need to pay back the loan. Standard is 360 months (30 years) or 180 months (15 years)." />
                </span>
                <span className="label-aside">{formData.Loan_Amount_Term} months ({Math.round((formData.Loan_Amount_Term / 12) * 10) / 10} yrs)</span>
              </label>
              <div className="slider-inputs">
                <input
                  type="range"
                  name="Loan_Amount_Term"
                  min="12"
                  max="480"
                  step="12"
                  className="slider-bar"
                  value={formData.Loan_Amount_Term || 12}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="Loan_Amount_Term"
                  style={{ width: '90px' }}
                  className={`input-control ${errors.Loan_Amount_Term ? 'error' : ''}`}
                  value={formData.Loan_Amount_Term}
                  onChange={handleChange}
                />
              </div>
              {errors.Loan_Amount_Term && <span className="error-message">{errors.Loan_Amount_Term}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Credit Score History
                <Tooltip text="Do you have a clean history of paying off credit cards or past loans? 'Good' means no missed payments." />
              </label>
              <div className="segmented-control">
                {[
                  { label: 'Good History', value: 1.0 },
                  { label: 'Poor History', value: 0.0 },
                ].map((option) => (
                  <div key={option.value} className="segmented-option">
                    <input
                      type="radio"
                      id={`credit-${option.value}`}
                      name="Credit_History"
                      checked={formData.Credit_History === option.value}
                      onChange={() => handleSegmentChange('Credit_History', option.value)}
                    />
                    <label htmlFor={`credit-${option.value}`} className="segmented-label">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Property Location
                <Tooltip text="Select where the property is located. Semi-urban areas often have higher approval odds." />
              </label>
              <div className="segmented-control">
                {['Urban', 'Semiurban', 'Rural'].map((option) => (
                  <div key={option} className="segmented-option">
                    <input
                      type="radio"
                      id={`property-${option}`}
                      name="Property_Area"
                      checked={formData.Property_Area === option}
                      onChange={() => handleSegmentChange('Property_Area', option)}
                    />
                    <label htmlFor={`property-${option}`} className="segmented-label">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* REAL-TIME ESTIMATES COMPONENT */}
        <div className="form-footer-metrics">
          <div className="metric-item">
            <span className="metric-label">Total Combined Income</span>
            <span className="metric-value">₹{combinedIncome.toLocaleString()}/mo</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Estimated Payment (EMI)</span>
            <span className="metric-value">₹{estimatedEMI.toLocaleString()}/mo</span>
          </div>
          <div className="metric-item" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
            <span className="metric-label">Payment to Income</span>
            <span className={`metric-value ${isDtiTooHigh ? 'error-message' : ''}`} style={{ fontWeight: 700 }}>
              {emiPercentageOfIncome}%
            </span>
          </div>
        </div>

        {isDtiTooHigh && (
          <div className="error-message" style={{ marginTop: '0.75rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>⚠️</span>
            <span>Warning: Your monthly payment takes up over 40% of your total income. This makes approval less likely.</span>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="btn btn-primary btn-full animate-fade-in"
          style={{ marginTop: '2rem' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
              Calculating Chances...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              Check Approval Chances
            </>
          )}
        </button>
      </form>
    </div>
  );
}
