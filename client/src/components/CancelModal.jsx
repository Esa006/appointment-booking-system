import React, { useState, useEffect } from 'react';

export default function CancelModal({ appointment, isOpen, onClose, onCancel }) {
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCancellationReason('');
      setErrorMessage(null);
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onCancel(appointment.id, cancellationReason.trim());
    } catch (err) {
      setErrorMessage(err.message || 'Unable to cancel appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slot = appointment.slot;

  return (
    <div>
      {/* Bootstrap 5 Backdrop Overlay */}
      <div className="modal-backdrop fade show opacity-50"></div>

      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-4">
            <div className="modal-header bg-light border-bottom rounded-top-4 px-4 py-3">
              <div>
                <h5 className="modal-title fw-bold text-danger mb-0">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> Cancel Appointment
                </h5>
                <p className="small text-muted mb-0">Are you sure you want to cancel this reservation?</p>
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
                {/* Appointment summary card */}
                <div className="card bg-danger-subtle border-danger-subtle rounded-3 mb-3">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-danger text-white">Confirmed Booking</span>
                      <small className="text-muted fw-semibold">ID: {appointment.id?.substring(0, 8)}...</small>
                    </div>
                    <h6 className="fw-bold text-danger-emphasis mb-1">
                      {slot?.formatted_start_time || slot?.start_time} - {slot?.formatted_end_time || slot?.end_time}
                    </h6>
                    <small className="text-secondary d-block">{slot?.formatted_date}</small>
                  </div>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 rounded-3 py-2 px-3 small">
                    <i className="bi bi-x-circle-fill fs-5"></i>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <p className="small text-muted mb-3">
                  Cancelling this appointment will automatically release the slot making it available for other users to book immediately.
                </p>

                {/* Cancellation Reason input */}
                <div className="mb-2">
                  <label htmlFor="cancel-reason" className="form-label fw-semibold text-dark small mb-1">
                    Reason for Cancellation <span className="text-muted font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="cancel-reason"
                    rows="3"
                    disabled={isSubmitting}
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="e.g. Schedule conflict, work emergency..."
                    className="form-control"
                    maxLength={500}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer bg-light border-top px-4 py-3 rounded-bottom-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3 fw-semibold"
                  disabled={isSubmitting}
                  onClick={onClose}
                >
                  Keep Appointment
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-danger btn-sm px-4 fw-bold d-flex align-items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-lg fs-6"></i>
                      <span>Confirm Cancellation</span>
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
