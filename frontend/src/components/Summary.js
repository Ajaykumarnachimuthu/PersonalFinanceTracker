import React from 'react';

function Summary({ summary, onAddIncome, onSetGlobalLimit }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="row g-3 mb-3">
      <div className="col-12 col-sm-6 col-md-3">
        <div className="card-lite p-3 metric h-100">
          <h6>Income</h6>
          <div className="d-flex align-items-end justify-content-between gap-2">
            <div className="value h3 mb-0">{formatCurrency(summary.totalIncome)}</div>
          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onAddIncome(formData.get('incomeAmount'));
              e.target.reset();
            }} 
            className="row g-2 mt-2"
          >
            <div className="col-7">
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                name="incomeAmount" 
                className="form-control form-control-sm" 
                placeholder="Add income" 
                required 
              />
            </div>
            <div className="col-5 d-grid">
              <button type="submit" className="btn btn-primary btn-sm">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-md-3">
        <div className="card-lite p-3 metric h-100">
          <h6>Spending</h6>
          <div className="value h3 mb-0">{formatCurrency(summary.totalExpense)}</div>
          <div className="small mt-1 subtitle-text">Across all categories</div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-md-3">
        <div className="card-lite p-3 metric h-100">
          <h6>Balance</h6>
          <div className={`value h3 mb-0 ${summary.balance >= 0 ? "text-success" : "text-danger"}`}>
            {formatCurrency(summary.balance)}
          </div>
          <div className="small mt-1 subtitle-text">
            {summary.balance >= 0 ? "Under income ✓" : "Over spent ✕"}
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-md-3">
        <div className="card-lite p-3 metric h-100">
          <h6>Global Limit</h6>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="h6 mb-0">{formatCurrency(summary.globalLimit)}</div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                onSetGlobalLimit(formData.get('globalLimit'));
              }}
              className="d-flex gap-2"
            >
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                name="globalLimit" 
                className="form-control form-control-sm mobile-input" 
                placeholder="Set" 
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                Save
              </button>
            </form>
          </div>
          <div className="progress mt-2">
            <div 
              className={`progress-bar ${summary.globalPct >= 100 ? "bg-danger" : (summary.globalPct >= 80 ? "bg-warning" : "bg-success")}`}
              role="progressbar" 
              style={{ width: `${summary.globalPct}%` }}
            ></div>
          </div>
          {summary.globalLimit > 0 && summary.totalExpense >= summary.globalLimit * 0.8 && summary.totalExpense < summary.globalLimit && (
            <div className="small mt-1 warning-text">Close to global limit</div>
          )}
          {summary.globalLimit > 0 && summary.totalExpense >= summary.globalLimit && (
            <div className="small mt-1 danger-text">Global limit exceeded</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Summary;