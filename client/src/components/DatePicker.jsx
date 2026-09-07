import React, { useRef } from 'react';

export default function DatePicker({ dates, selectedDate, onSelectDate }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-4">
      {/* Title Bar */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-0">Select a Date</h5>
          <small className="text-muted">Next 7 days</small>
        </div>
      </div>

      {/* Date Pill Carousel with Arrow Buttons */}
      <div className="d-flex align-items-center gap-2">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="btn btn-light border rounded-circle flex-shrink-0 p-2 d-flex align-items-center justify-content-center shadow-sm"
          aria-label="Scroll Left"
        >
          <i className="bi bi-chevron-left fs-6 text-secondary"></i>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="d-flex gap-2 overflow-x-auto py-1 px-1 flex-grow-1 no-scrollbar"
        >
          {dates.map((item) => {
            const isSelected = item.isoDate === selectedDate;
            return (
              <button
                key={item.isoDate}
                type="button"
                onClick={() => onSelectDate(item.isoDate)}
                className={`btn flex-shrink-0 d-flex flex-column align-items-center justify-content-center rounded-4 border p-3 transition-all ${
                  isSelected
                    ? 'btn-primary shadow text-white border-primary'
                    : 'btn-outline-secondary bg-white text-dark shadow-sm'
                }`}
                style={{ width: '80px', height: '95px' }}
              >
                <span className={`small text-uppercase fw-bold d-block mb-1 ${isSelected ? 'text-white-50' : 'text-muted'}`}>
                  {item.dayOfWeek}
                </span>
                <span className="fs-4 fw-extrabold lh-1 d-block mb-1">
                  {item.dayOfMonth}
                </span>
                <span className={`small text-uppercase fw-semibold d-block ${isSelected ? 'text-white-50' : 'text-secondary'}`}>
                  {item.month}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="btn btn-light border rounded-circle flex-shrink-0 p-2 d-flex align-items-center justify-content-center shadow-sm"
          aria-label="Scroll Right"
        >
          <i className="bi bi-chevron-right fs-6 text-secondary"></i>
        </button>
      </div>
    </div>
  );
}
