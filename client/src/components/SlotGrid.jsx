import React from 'react';

export default function SlotGrid({ slots, onSelectSlot }) {
  if (!slots || slots.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Section Header Bar */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold text-dark mb-0">Available Times</h5>
        <span className="small text-muted d-flex align-items-center gap-1">
          <i className="bi bi-clock text-primary"></i> All slots are 60 minutes
        </span>
      </div>

      {/* 4-Column Grid */}
      <div className="row g-3">
        {slots.map((slot) => {
          const isAvailable = slot.status === 'AVAILABLE' && !slot.is_past;
          const isPast = slot.is_past;

          return (
            <div key={slot.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                onClick={() => isAvailable && onSelectSlot(slot)}
                className={`card h-100 rounded-4 p-3 border transition-all ${
                  isAvailable
                    ? 'bg-white border-success-subtle shadow-sm cursor-pointer'
                    : 'bg-light border-light-subtle text-muted shadow-none'
                }`}
              >
                <div className="d-flex flex-column justify-content-between h-100">
                  {/* Time Header */}
                  <div>
                    <h6 className="fw-bold text-dark mb-1 fs-5">
                      {slot.formatted_start_time || slot.start_time}
                    </h6>

                    {/* Status Badge */}
                    {isAvailable ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill py-1 px-2 small">
                        <i className="bi bi-check-circle-fill me-1"></i> Available
                      </span>
                    ) : isPast ? (
                      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill py-1 px-2 small">
                        Past Slot
                      </span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill py-1 px-2 small">
                        <i className="bi bi-x-circle-fill me-1"></i> Booked
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-3">
                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSlot(slot);
                        }}
                        className="btn btn-outline-success btn-sm w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-1"
                      >
                        <span>Book Slot</span>
                        <i className="bi bi-arrow-right-short fs-5"></i>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="btn btn-outline-secondary btn-sm w-100 rounded-3 text-muted disabled"
                      >
                        {isPast ? 'Slot Ended' : 'Unavailable'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
