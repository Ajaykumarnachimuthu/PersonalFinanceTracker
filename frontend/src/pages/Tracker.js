import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Summary from '../components/Summary';
import Categories from '../components/Categories';
import CategoryModal from '../components/CategoryModal';
import axios from 'axios';

function Tracker() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    globalLimit: 0,
    globalPct: 0
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, categoriesRes] = await Promise.all([
        axios.get('/api/finance/summary'),
        axios.get('/api/categories')
      ]);
      
      setSummary(summaryRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddIncome = async (amount) => {
    try {
      await axios.post('/api/finance/income', { amount });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleSetGlobalLimit = async (limit) => {
    try {
      await axios.put('/api/user/limit', { globalLimit: limit });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error setting global limit:', error);
    }
  };

  const handleAddCategory = async (name) => {
    try {
      await axios.post('/api/categories', { name });
      fetchData(); // Refresh data
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`/api/categories/${categoryId}`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleResetAll = async () => {
    if (window.confirm('This will remove all your data. Continue?')) {
      try {
        await axios.post('/api/finance/reset');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error resetting data:', error);
      }
    }
  };

  return (
    <div>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
        <div className="text-center">
          <h1 className="app-title display-6 mb-0">Personal Finance Tracker</h1>
          <div className="subtitle">A bright & beautiful way to track your spending.</div>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={handleResetAll}>
          Reset
        </button>
      </header>

      <Summary 
        summary={summary}
        onAddIncome={handleAddIncome}
        onSetGlobalLimit={handleSetGlobalLimit}
      />

      <Categories 
        categories={categories}
        onCategoryClick={setSelectedCategory}
        onAddCategory={() => setShowCategoryModal(true)}
        onDeleteCategory={handleDeleteCategory}
      />

      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onUpdate={fetchData}
        />
      )}

      {showCategoryModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{background: '#7c3aed', color: '#fff'}}>
                <h5 className="modal-title">Add New Category</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCategoryModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAddCategory(formData.get('name'));
                }}>
                  <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input type="text" name="name" className="form-control" placeholder="e.g., Travel" required />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Add</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracker;