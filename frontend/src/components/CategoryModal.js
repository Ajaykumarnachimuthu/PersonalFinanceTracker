import React, { useState } from 'react';

function CategoryModal({ category, onClose, onUpdate }) {
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  if (!category) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const pct = category.limit > 0 ? Math.min(100, (category.total / category.limit) * 100) : 0;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{ background: category.color, color: '#fff' }}>
            <h5 className="modal-title">{category.name} — Details</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3 mb-2">
              <div className="col-12 col-md-4">
                <div className="card-lite p-3">
                  <div className="text-uppercase fw-bold small subtitle-text">Total Spent</div>
                  <div className="h5 mb-0">{formatCurrency(category.total)}</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card-lite p-3">
                  <div className="text-uppercase fw-bold small subtitle-text">Limit</div>
                  <div className="h6 mb-0">{formatCurrency(category.limit)}</div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card-lite p-3">
                  <div className="text-uppercase fw-bold small subtitle-text">Remaining</div>
                  <div className={`h5 mb-0 ${category.limit > 0 && (category.limit - category.total) < 0 ? "text-danger" : "text-success"}`}>
                    {formatCurrency(Math.max(category.limit - category.total, 0))}
                  </div>
                </div>
              </div>
            </div>

            <div className="progress mb-3">
              <div 
                className={`progress-bar ${pct >= 100 ? "bg-danger" : (pct >= 80 ? "bg-warning" : "bg-success")}`}
                style={{ width: `${pct}%` }}
              ></div>
            </div>

            {category.limit > 0 && category.total >= category.limit * 0.8 && category.total < category.limit && (
              <div className="alert alert-warning py-2">Close to category limit!</div>
            )}
            {category.limit > 0 && category.total >= category.limit && (
              <div className="alert alert-danger py-2">Category limit exceeded!</div>
            )}

            <div className="card-lite p-3 mb-3">
              <div className="text-uppercase fw-bold small mb-2 subtitle-text">Add Expense</div>
              <form className="row g-2 align-items-end">
                <div className="col-12 col-md-6">
                  <label className="form-label mb-1">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Lunch at cafe" 
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    required 
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label mb-1">Amount</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="₹" 
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    required 
                  />
                </div>
                <div className="col-6 col-md-3">
                  <button type="button" className="btn btn-primary w-100">
                    Add
                  </button>
                </div>
              </form>
            </div>

            <div className="table-responsive">
              <table className="table table-sm table-bordered align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '48px' }}>#</th>
                    <th style={{ minWidth: '120px' }}>Date</th>
                    <th>Name</th>
                    <th style={{ minWidth: '120px' }}>Amount</th>
                    <th style={{ width: '80px' }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {category.expenses && category.expenses.length > 0 ? (
                    category.expenses.map((expense, index) => (
                      <tr key={expense._id}>
                        <td>{index + 1}</td>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>{expense.item}</td>
                        <td>{formatCurrency(expense.amount)}</td>
                        <td className="text-center">
                          <button className="btn btn-outline-danger btn-sm">✕</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center subtitle-text">No expenses yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;