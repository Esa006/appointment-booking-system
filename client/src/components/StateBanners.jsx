import React from 'react';

export function SkeletonSlots() {
  return (
    <div className="row g-3">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <div key={n} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card shadow-sm border rounded-3 p-3 placeholder-glow h-100">
            <div className="d-flex justify-content-between mb-2">
              <span className="placeholder col-4 rounded"></span>
              <span className="placeholder col-3 rounded-pill"></span>
            </div>
            <span className="placeholder col-7 fs-5 mb-2 rounded"></span>
            <span className="placeholder col-5 mb-3 rounded"></span>
            <div className="pt-2 border-top">
              <span className="placeholder col-12 btn btn-primary disabled rounded-2"></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptySlots({ date }) {
  return (
    <div className="card border-0 bg-light text-center p-5 rounded-4 my-2">
      <div className="card-body">
        <div className="bg-white rounded-circle d-inline-flex p-3 mb-3 shadow-sm text-primary">
          <i className="bi bi-calendar-event fs-1"></i>
        </div>
        <h5 className="fw-bold text-dark mb-1">No Available Slots</h5>
        <p className="text-secondary small mb-0">
          There are no appointment slots scheduled for <strong>{date}</strong>. Please select another date.
        </p>
      </div>
    </div>
  );
}

export function ErrorBanner({ title, message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between rounded-3 p-3 shadow-sm border-danger my-3">
      <div className="d-flex align-items-center gap-3">
        <i className="bi bi-exclamation-octagon-fill fs-3 text-danger"></i>
        <div>
          <h6 className="fw-bold mb-0 text-danger">{title || 'Unable to load data'}</h6>
          <span className="small text-danger-emphasis">{message}</span>
        </div>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-outline-danger btn-sm fw-semibold">
          <i className="bi bi-arrow-clockwise me-1"></i> Try Again
        </button>
      )}
    </div>
  );
}

export function SuccessToast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 shadow rounded-3 border-success mb-4" role="alert">
      <i className="bi bi-check-circle-fill text-success fs-5"></i>
      <div>
        <strong className="d-block">Success!</strong>
        <span className="small">{message}</span>
      </div>
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
}
