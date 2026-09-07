import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';

export default function AppointmentsList({ onOpenCancelModal }) {
  const [emailInput, setEmailInput] = useState('');
  const [activeEmail, setActiveEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'past'

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('disha_user_email');
    if (savedEmail) {
      setEmailInput(savedEmail);
      fetchAppointments(savedEmail);
    }
  }, []);

  const fetchAppointments = async (emailToFetch) => {
    if (!emailToFetch || !emailToFetch.trim()) return;
    const cleanEmail = emailToFetch.trim().toLowerCase();

    setLoading(true);
    setError(null);
    setActiveEmail(cleanEmail);
    localStorage.setItem('disha_user_email', cleanEmail);

    try {
      const res = await appointmentService.getAppointmentsByEmail(cleanEmail);
      let upcoming = [];
      let past = [];
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          upcoming = res.data.filter(a => a.status?.toUpperCase() === 'CONFIRMED' || a.is_upcoming);
          past = res.data.filter(a => a.status?.toUpperCase() === 'CANCELLED' || (!a.is_upcoming && a.status?.toUpperCase() !== 'CONFIRMED'));
        } else {
          upcoming = res.data.upcoming || [];
          past = res.data.past || [];
        }
      }
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments for this email.');
      setUpcomingAppointments([]);
      setPastAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAppointments(emailInput);
  };

  const currentList = tab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div className="container py-2">
      {/* Email Search Header */}
      <div className="card shadow-sm border rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center g-3">
            <div className="col-lg-6">
              <h5 className="fw-bold text-dark mb-1">
                <i className="bi bi-calendar-range text-primary me-2"></i> My Appointments
              </h5>
              <p className="text-secondary small mb-0">
                Enter your email address below to view your upcoming and historical bookings.
              </p>
            </div>

            <div className="col-lg-6">
              <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter registered email..."
                    className="form-control border-start-0"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary fw-semibold flex-shrink-0 d-flex align-items-center gap-2"
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-search"></i>
                  )}
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Results */}
      {activeEmail && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <ul className="nav nav-pills gap-2">
              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setTab('upcoming')}
                  className={`nav-link btn-sm fw-semibold rounded-pill px-3 ${
                    tab === 'upcoming' ? 'active bg-primary' : 'bg-light text-dark'
                  }`}
                >
                  Upcoming ({upcomingAppointments.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => setTab('past')}
                  className={`nav-link btn-sm fw-semibold rounded-pill px-3 ${
                    tab === 'past' ? 'active bg-primary' : 'bg-light text-dark'
                  }`}
                >
                  Past ({pastAppointments.length})
                </button>
              </li>
            </ul>

            <span className="small text-muted d-none d-sm-inline">
              Showing bookings for: <strong className="text-dark">{activeEmail}</strong>
            </span>
          </div>

          {/* Error alert */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center justify-content-between rounded-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <span>{error}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => fetchAppointments(activeEmail)}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="row g-3">
              {[1, 2].map((n) => (
                <div key={n} className="col-12 col-md-6">
                  <div className="card border shadow-sm p-3 placeholder-glow">
                    <span className="placeholder col-4 mb-2"></span>
                    <span className="placeholder col-8 mb-3"></span>
                    <span className="placeholder col-6"></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && currentList.length === 0 && (
            <div className="card border-0 bg-light text-center p-5 rounded-4 my-3">
              <div className="card-body">
                <div className="bg-white rounded-circle d-inline-flex p-3 mb-3 shadow-sm text-muted">
                  <i className="bi bi-calendar-x fs-1"></i>
                </div>
                <h6 className="fw-bold text-dark">No {tab} appointments found</h6>
                <p className="text-muted small max-w-md mx-auto">
                  {tab === 'upcoming'
                    ? "You don't have any active upcoming reservations for this email."
                    : 'There are no completed or past appointment records for this email.'}
                </p>
              </div>
            </div>
          )}

          {/* Appointment Cards */}
          {!loading && !error && currentList.length > 0 && (
            <div className="row g-3">
              {currentList.map((app) => {
                const slot = app.slot;
                const isConfirmed = app.status?.toUpperCase() === 'CONFIRMED' || Boolean(app.is_upcoming);
                const isCancelled = app.status?.toUpperCase() === 'CANCELLED' || (!Boolean(app.is_upcoming) && app.status?.toUpperCase() !== 'CONFIRMED');

                return (
                  <div key={app.id} className="col-12 col-md-6">
                    <div className="card shadow-sm border rounded-3 h-100">
                      <div className="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small text-muted fw-semibold">
                              <i className="bi bi-clock me-1"></i> {slot?.duration_minutes || 60} mins
                            </span>

                            {isConfirmed ? (
                              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                                <i className="bi bi-check-circle-fill me-1"></i> Confirmed
                              </span>
                            ) : (
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">
                                <i className="bi bi-x-circle-fill me-1"></i> Cancelled
                              </span>
                            )}
                          </div>

                          <h5 className="fw-bold text-dark mb-1">
                            {slot?.formatted_start_time || slot?.start_time} - {slot?.formatted_end_time || slot?.end_time}
                          </h5>

                          <p className="text-secondary small mb-3">
                            <i className="bi bi-calendar-date me-1"></i> {slot?.formatted_date || slot?.start_time}
                          </p>

                          {isCancelled && app.cancellation_reason && (
                            <div className="bg-light p-2 rounded-2 small text-muted border mb-3">
                              <strong>Reason:</strong> {app.cancellation_reason}
                            </div>
                          )}
                        </div>

                        {tab === 'upcoming' && isConfirmed && (
                          <div className="pt-2 border-top">
                            <button
                              type="button"
                              onClick={() => onOpenCancelModal(app)}
                              className="btn btn-outline-danger btn-sm w-100 fw-semibold rounded-2 d-flex align-items-center justify-content-center gap-1"
                            >
                              <i className="bi bi-x-circle"></i>
                              <span>Cancel Appointment</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
