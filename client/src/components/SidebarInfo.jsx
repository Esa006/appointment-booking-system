import React from 'react';

export default function SidebarInfo() {
  return (
    <div className="d-flex flex-column gap-4">
      {/* Quote & Value Proposition Card */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="border-start border-4 border-primary ps-3 mb-3">
          <h6 className="fw-bold text-dark mb-0 fs-6">
            "Your time is valuable. We make it easy to manage."
          </h6>
        </div>

        <hr className="my-3 border-light-subtle" />

        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-start gap-3">
            <div className="bg-light text-primary rounded-3 p-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-calendar-event fs-5"></i>
            </div>
            <div>
              <strong className="d-block text-dark small">Flexible Scheduling</strong>
              <span className="text-muted fs-8">Pick a time that works for you</span>
            </div>
          </div>

          <div className="d-flex align-items-start gap-3">
            <div className="bg-light text-primary rounded-3 p-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-bell fs-5"></i>
            </div>
            <div>
              <strong className="d-block text-dark small">Instant Confirmation</strong>
              <span className="text-muted fs-8">Get notified right away</span>
            </div>
          </div>

          <div className="d-flex align-items-start gap-3">
            <div className="bg-light text-primary rounded-3 p-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-heart-pulse fs-5"></i>
            </div>
            <div>
              <strong className="d-block text-dark small">Quality Care</strong>
              <span className="text-muted fs-8">We're committed to you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Health Message Card */}
      <div className="card border-0 bg-success-subtle rounded-4 p-3 shadow-sm d-flex flex-row align-items-center gap-3">
        <div className="bg-white rounded-circle p-2 text-success shadow-sm d-flex align-items-center justify-content-center">
          <i className="bi bi-flower1 fs-3"></i>
        </div>
        <div>
          <strong className="d-block text-success-emphasis small">Take care of today</strong>
          <span className="text-success-emphasis fs-8">for a healthier tomorrow. Because your well-being matters.</span>
        </div>
      </div>
    </div>
  );
}
