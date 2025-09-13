import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="container">
          <nav className="landing-nav">
            <div className="logo">
              <span className="logo-icon">💰</span>
              <span className="logo-text">FinanceTracker</span>
            </div>
            <div className="nav-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/login" className="nav-link nav-link-primary">Sign Up</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  Take Control of Your <span className="text-gradient">Finances</span>
                </h1>
                <p className="hero-description">
                  Track your expenses, set budgets, and achieve your financial goals with our intuitive personal finance tracker.
                </p>
                <div className="hero-actions">
                  <Link to="/login" className="btn btn-primary btn-lg">Get Started</Link>
                  <Link to="/login" className="btn btn-outline btn-lg">Learn More</Link>
                </div>
              </div>
              <div className="hero-image">
                <div className="dashboard-preview">
                  <div className="preview-header">
                    <div className="preview-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="preview-content">
                    <div className="preview-card">
                      <div className="preview-card-header"></div>
                      <div className="preview-card-body">
                        <div className="preview-bar" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="preview-card">
                      <div className="preview-card-header"></div>
                      <div className="preview-card-body">
                        <div className="preview-bar" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <div className="preview-card">
                      <div className="preview-card-header"></div>
                      <div className="preview-card-body">
                        <div className="preview-bar" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose FinanceTracker?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Visual Analytics</h3>
                <p className="feature-description">
                  Understand your spending patterns with beautiful charts and visualizations.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Category Budgets</h3>
                <p className="feature-description">
                  Set limits for different spending categories and get alerts when you're close to exceeding them.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔔</div>
                <h3 className="feature-title">Smart Alerts</h3>
                <p className="feature-description">
                  Receive notifications about unusual spending patterns and upcoming bills.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3 className="feature-title">Mobile Friendly</h3>
                <p className="feature-description">
                  Access your financial data anywhere, on any device, with our responsive design.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Transform Your Financial Life?</h2>
              <p className="cta-description">
                Join thousands of users who have already taken control of their finances with our app.
              </p>
              <Link to="/login" className="btn btn-primary btn-lg">Start Your Journey Today</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span className="logo-icon">💰</span>
                <span className="logo-text">FinanceTracker</span>
              </div>
              <p className="footer-description">
                The simplest way to manage your personal finances and achieve your financial goals.
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#case-studies">Case Studies</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><a href="#blog">Blog</a></li>
                <li><a href="#guides">Guides</a></li>
                <li><a href="#support">Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} FinanceTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;