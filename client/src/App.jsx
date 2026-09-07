import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import DatePicker from './components/DatePicker';
import SlotGrid from './components/SlotGrid';
import SidebarInfo from './components/SidebarInfo';
import BookingModal from './components/BookingModal';
import AppointmentsList from './components/AppointmentsList';
import CancelModal from './components/CancelModal';
import { SkeletonSlots, EmptySlots, ErrorBanner, SuccessToast } from './components/StateBanners';
import { slotService, appointmentService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'my-appointments'

  // Date selection logic (Next 7 days)
  const dateOptions = useMemo(() => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayOfMonth = d.getDate().toString().padStart(2, '0');
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const formattedLabel = `${dayOfWeek} ${dayOfMonth} ${month}`;
      options.push({ isoDate, dayOfWeek, dayOfMonth, month, formattedLabel });
    }
    return options;
  }, []);

  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.isoDate || '');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Modals & Banners state
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [appointmentForCancellation, setAppointmentForCancellation] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch slots whenever selectedDate changes
  const fetchSlots = async (dateStr) => {
    if (!dateStr) return;
    setLoadingSlots(true);
    setSlotsError(null);

    try {
      const res = await slotService.getSlotsByDate(dateStr);
      setSlots(res.data || []);
    } catch (err) {
      setSlotsError(err.message || 'Failed to fetch appointment slots for this date.');
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'book' && selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, activeTab]);

  // Handle slot selection for booking
  const handleSelectSlot = (slot) => {
    setSelectedSlotForBooking(slot);
    setIsBookingModalOpen(true);
  };

  // Handle booking submission
  const handleBookingSubmit = async (bookingData) => {
    const res = await appointmentService.bookAppointment(bookingData);
    setIsBookingModalOpen(false);
    setSelectedSlotForBooking(null);
    setSuccessMessage('Appointment booked successfully! Your slot has been reserved.');

    // Save email to localStorage
    localStorage.setItem('disha_user_email', bookingData.email);

    // Refresh server slots
    fetchSlots(selectedDate);

    setTimeout(() => setSuccessMessage(null), 6000);
    return res;
  };

  // Handle cancellation modal trigger
  const handleOpenCancelModal = (appointment) => {
    setAppointmentForCancellation(appointment);
    setIsCancelModalOpen(true);
  };

  // Handle cancellation submit
  const handleCancelSubmit = async (appointmentId, reason) => {
    const res = await appointmentService.cancelAppointment(appointmentId, reason);
    setIsCancelModalOpen(false);
    setAppointmentForCancellation(null);
    setSuccessMessage('Appointment cancelled successfully. The slot has been reopened.');

    if (selectedDate) fetchSlots(selectedDate);

    setTimeout(() => setSuccessMessage(null), 6000);
    return res;
  };

  const selectedDateObject = dateOptions.find((d) => d.isoDate === selectedDate);

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="container py-4 flex-grow-1">
        {/* Success Toast */}
        <SuccessToast message={successMessage} onClose={() => setSuccessMessage(null)} />

        {/* Tab 1: Book Appointment Screen */}
        {activeTab === 'book' && (
          <div>
            {/* Hero Header Section */}
            <HeroBanner />

            {/* 2-Column Main Layout */}
            <div className="row g-4">
              {/* Left Column: Date Carousel + Slot Grid */}
              <div className="col-lg-8">
                {/* Date Carousel Selector */}
                <DatePicker
                  dates={dateOptions}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => setSelectedDate(d)}
                />

                {/* Error Banner */}
                {slotsError && (
                  <ErrorBanner
                    title="Error Loading Slots"
                    message={slotsError}
                    onRetry={() => fetchSlots(selectedDate)}
                  />
                )}

                {/* Loading Skeletons */}
                {loadingSlots && <SkeletonSlots />}

                {/* Empty State */}
                {!loadingSlots && !slotsError && slots.length === 0 && (
                  <EmptySlots date={selectedDateObject?.formattedLabel || selectedDate} />
                )}

                {/* 4-Column Time Slot Grid */}
                {!loadingSlots && !slotsError && slots.length > 0 && (
                  <SlotGrid slots={slots} onSelectSlot={handleSelectSlot} />
                )}
              </div>

              {/* Right Column: Sidebar Value Proposition */}
              <div className="col-lg-4">
                <SidebarInfo />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Appointments Screen */}
        {activeTab === 'my-appointments' && (
          <AppointmentsList onOpenCancelModal={handleOpenCancelModal} />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        slot={selectedSlotForBooking}
        selectedDate={selectedDateObject?.formattedLabel || selectedDate}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleBookingSubmit}
      />

      {/* Cancellation Modal */}
      <CancelModal
        appointment={appointmentForCancellation}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onCancel={handleCancelSubmit}
      />
    </div>
  );
}
