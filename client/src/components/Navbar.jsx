import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('book');
          }}
          className="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
        >
          <img
            src="/logo.png"
            alt="my-booking-app"
            style={{ width: '42px', height: '42px', objectFit: 'contain' }}
            className="rounded-circle shadow-sm"
          />
          <div>
            <h5 className="fw-extrabold text-dark mb-0 lh-1">my-booking-app</h5>
            <small className="text-muted fs-8">Book • Manage • Stay Organized</small>
          </div>
        </a>

        {/* Tab Switcher */}
        <div className="d-flex align-items-center gap-2 mx-auto my-2 my-lg-0">
          <div className="bg-light rounded-pill p-1 border d-flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('book')}
              className={`btn btn-sm rounded-pill fw-semibold px-4 transition-all ${
                activeTab === 'book'
                  ? 'btn-primary shadow-sm'
                  : 'btn-link text-secondary text-decoration-none'
              }`}
            >
              <i className="bi bi-calendar-plus me-1"></i> Book Appointment
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('my-appointments')}
              className={`btn btn-sm rounded-pill fw-semibold px-4 transition-all ${
                activeTab === 'my-appointments'
                  ? 'btn-primary shadow-sm'
                  : 'btn-link text-secondary text-decoration-none'
              }`}
            >
              <i className="bi bi-journal-check me-1"></i> My Appointments
            </button>
          </div>
        </div>

        {/* Top Right Tagline */}
        <div className="d-none d-md-flex align-items-center text-muted small">
          <span>A simpler way to a healthier you. 🍃</span>
        </div>
      </div>
    </nav>
  );
}