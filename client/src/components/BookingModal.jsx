import React, { useState, useEffect } from 'react';

export default function BookingModal({ slot, selectedDate, isOpen, onClose, onBookingSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConflict, setIsConflict] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsConflict(false);
      setValidationErrors({});
      // Auto-load saved user email from localStorage
      const savedEmail = localStorage.getItem('disha_user_email');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [isOpen, slot]);

  if (!isOpen || !slot) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsConflict(false);
    setValidationErrors({});

    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required.';
    if (!email.trim()) errors.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email address is required.';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onBookingSuccess({
        slot_id: slot.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        formatted_start_time: slot.formatted_start_time || slot.start_time,
        formatted_end_time: slot.formatted_end_time || slot.end_time,
        formatted_date: selectedDate || slot.formatted_date,
      });
    } catch (err) {
      if (err.status === 409 || err.code === 'SLOT_ALREADY_BOOKED') {
        setIsConflict(true);
        setErrorMessage(err.message || 'This slot was just booked by another user. Please choose another time.');
      } else if (err.status === 422 && err.errors) {
        setValidationErrors(err.errors);
      } else {
        setErrorMessage(err.message || 'Unable to book appointment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Bootstrap 5 Backdrop Overlay */}
      <div className="modal-backdrop fade show opacity-50"></div>

      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-4">
            <div className="modal-header bg-light border-bottom rounded-top-4 px-4 py-3">
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">Confirm Appointment</h5>
                <p className="small text-muted mb-0">Complete your details to lock in this slot</p>
              </div>
              <button
                type="button"
                className="btn-close"
                disabled={isSubmitting}
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {/* Selected Slot Summary */}
                <div className="card bg-primary-subtle border-primary-subtle rounded-3 mb-4">
                  <div className="card-body p-3 d-flex align-items-center justify-content-between">
                    <div>
                      <span className="badge bg-primary text-white mb-1">Selected Slot</span>
                      <h6 className="fw-bold text-primary-emphasis mb-0">
                        {slot.formatted_start_time || slot.start_time} - {slot.formatted_end_time || slot.end_time}
                      </h6>
                      <small className="text-secondary">{selectedDate}</small>
                    </div>
                    <i className="bi bi-calendar-check text-primary fs-2 opacity-75"></i>
                  </div>
                </div>

                {/* Conflict / Error Banner */}
                {errorMessage && (
                  <div className={`alert ${isConflict ? 'alert-warning border-warning' : 'alert-danger border-danger'} d-flex align-items-start gap-2 mb-3 rounded-3 shadow-sm`}>
                    <i className={`bi ${isConflict ? 'bi-exclamation-triangle-fill text-warning' : 'bi-exclamation-octagon-fill text-danger'} fs-5 flex-shrink-0 mt-1`}></i>
                    <div>
                      <strong className="d-block">{isConflict ? 'Slot Already Booked' : 'Booking Error'}</strong>
                      <span className="small">{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Name Field */}
                <div className="mb-3">
                  <label htmlFor="booking-name" className="form-label fw-semibold text-dark small mb-1">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      id="booking-name"
                      type="text"
                      disabled={isSubmitting}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className={`form-control border-start-0 ${validationErrors.name ? 'is-invalid' : ''}`}
                    />
                    {validationErrors.name && (
                      <div className="invalid-feedback">{Array.isArray(validationErrors.name) ? validationErrors.name[0] : validationErrors.name}</div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="booking-email" className="form-label fw-semibold text-dark small mb-1">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      id="booking-email"
                      type="email"
                      disabled={isSubmitting}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className={`form-control border-start-0 ${validationErrors.email ? 'is-invalid' : ''}`}
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback">{Array.isArray(validationErrors.email) ? validationErrors.email[0] : validationErrors.email}</div>
                    )}
                  </div>
                  <small className="form-text text-muted">We will use this email to retrieve your appointment history.</small>
                </div>
              </div>

              <div className="modal-footer bg-light border-top px-4 py-3 rounded-bottom-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3 fw-semibold"
                  disabled={isSubmitting}
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm px-4 fw-bold d-flex align-items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle fs-6"></i>
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
