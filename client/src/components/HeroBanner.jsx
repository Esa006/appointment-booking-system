import React from 'react';

export default function HeroBanner() {
  return (
    <div className="card border-0 bg-primary-subtle rounded-4 p-4 p-lg-5 mb-4 shadow-sm position-relative overflow-hidden">
      <div className="row align-items-center g-4">
        {/* Left Text Content */}
        <div className="col-lg-7 col-xl-8">
          <span className="text-primary text-uppercase fw-bold tracking-wider small mb-2 d-block">
            SCHEDULE YOUR VISIT
          </span>
          <h1 className="display-6 fw-extrabold text-dark mb-2">
            Book Your Appointment
          </h1>
          <p className="text-secondary fs-6 mb-4 max-w-xl">
            Choose a date and a convenient time. We're here when you need us.
          </p>

          {/* Benefit Badges Row */}
          <div className="d-flex flex-wrap gap-3">
            <div className="bg-white rounded-3 p-2 px-3 shadow-sm border d-flex align-items-center gap-2">
              <div className="bg-primary-subtle text-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                <i className="bi bi-clock-history fs-6"></i>
              </div>
              <div>
                <strong className="d-block text-dark small lh-1">Quick & Easy</strong>
                <span className="text-muted fs-8">Book in minutes</span>
              </div>
            </div>

            <div className="bg-white rounded-3 p-2 px-3 shadow-sm border d-flex align-items-center gap-2">
              <div className="bg-primary-subtle text-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                <i className="bi bi-shield-check fs-6"></i>
              </div>
              <div>
                <strong className="d-block text-dark small lh-1">Secure</strong>
                <span className="text-muted fs-8">Your data is safe</span>
              </div>
            </div>

            <div className="bg-white rounded-3 p-2 px-3 shadow-sm border d-flex align-items-center gap-2">
              <div className="bg-primary-subtle text-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                <i className="bi bi-people-fill fs-6"></i>
              </div>
              <div>
                <strong className="d-block text-dark small lh-1">Better Care</strong>
                <span className="text-muted fs-8">Your time matters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Graphic Banner */}
        <div className="col-lg-5 col-xl-4 text-center d-none d-lg-block">
          <div className="card border-0 bg-white shadow-sm rounded-4 p-4 text-center">
            <div className="mb-3">
              <img
                src="/logo.png"
                alt="my-booking-app"
                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                className="rounded-circle shadow-sm"
              />
            </div>
            <h6 className="fw-bold text-dark mb-1">my-booking-app</h6>
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
              Book • Manage • Stay Organized
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
