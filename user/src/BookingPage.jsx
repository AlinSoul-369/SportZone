import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import API from "./api/axios";
import "./BookingPage.css";

const BookingPage = () => {
  const { user } = useAuth();

  // ----- STATE لإدارة الأكورديون -----
  const [activeDay, setActiveDay] = useState(null);
  const [daysData, setDaysData] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState("");

  // ----- STATE للمودال -----
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1); // بالساعات
  const [advancePayment, setAdvancePayment] = useState(15);
  const [totalPrice, setTotalPrice] = useState(50.0);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");

  const ratePerHour = 50; // SYP (افتراضي)

  // ----- مرجع لمحتوى الأكورديون (لتحديث الارتفاع) -----
  const contentRefs = useRef({});

  // ----- دوال الأكورديون -----
  const toggleAccordion = (day) => {
    setActiveDay(activeDay === day ? null : day);
  };

  // تأثير لتحديث ارتفاع المحتوى عند تغيير activeDay
  useEffect(() => {
    Object.keys(contentRefs.current).forEach((key) => {
      const el = contentRefs.current[key];
      if (el) {
        if (activeDay === key) {
          el.style.maxHeight = el.scrollHeight + "px";
          el.style.opacity = "1";
        } else {
          el.style.maxHeight = "0px";
          el.style.opacity = "0";
        }
      }
    });
  }, [activeDay]);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      try {
        setSlotsError("");
        setLoadingSlots(true);
        const response = await API.get("/reserves/available-slots");

        const serverDays = response.data?.days || [];
        const formattedDays = serverDays.map((day) => ({
          day: formatDayLabel(day.date),
          date: day.date,
          slots: day.slots.map((slot) => `${slot.start} - ${slot.end}`),
          booked: []
        }));

        setDaysData(formattedDays);
      } catch (error) {
        setSlotsError(
          error?.response?.data?.message || error?.message ||
            "Failed to load available slots."
        );
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, []);

  const formatDayLabel = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });
  };

  const parseSlotTime = (dateString, label) => {
    const [timePart, period] = label.trim().split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    let hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day, hour, minute, 0);
  };

  const buildReserveDates = () => {
    if (!selectedDate || !selectedTime) return null;
    const [startLabel, endLabel] = selectedTime.split(" - ").map((part) => part.trim());
    return {
      startDate: parseSlotTime(selectedDate, startLabel),
      endDate: parseSlotTime(selectedDate, endLabel)
    };
  };

  const createReserve = async () => {
    if (!user) {
      setBookingError("Please log in to create a reservation.");
      return;
    }

    const userId = user._id || user.id || user.userId;
    if (!userId) {
      setBookingError("Unable to identify your user account.");
      return;
    }

    const dates = buildReserveDates();
    if (!dates || Number.isNaN(dates.startDate.getTime()) || Number.isNaN(dates.endDate.getTime())) {
      setBookingError("Selected time slot is invalid.");
      return;
    }

    if (advancePayment <= 0) {
      setBookingError("Advance payment must be greater than zero.");
      return;
    }

    const reserveBody = {
      userId,
      startDate: dates.startDate.toISOString(),
      endDate: dates.endDate.toISOString(),
      totalPrice,
      AdvancePayment: advancePayment,
      time: selectedTime
    };

    try {
      setBookingError("");
      setBookingLoading(true);

      const response = await API.post("/reserves", reserveBody);

      setBookingSuccess(
        response.data?.message ||
          `Booking confirmed for ${selectedDay} at ${selectedTime}.`
      );
      setBookingError("");
      closeModal();
    } catch (error) {
      setBookingError(
        error?.response?.data?.message || error?.message ||
          "Failed to create reservation."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ----- دوال المودال -----
  const openModal = (day, dayDate, time) => {
    setSelectedDay(day);
    setSelectedDate(dayDate);
    setSelectedTime(time);
    setSelectedDuration(1);
    setAdvancePayment(15);
    setBookingError("");
    updateTotalPrice(1);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const updateTotalPrice = (duration) => {
    const total = ratePerHour * duration;
    setTotalPrice(total);
  };

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    updateTotalPrice(duration);
  };

  const confirmBooking = async () => {
    await createReserve();
  };

  // ----- دالة عرض أزرار المواعيد -----
  const renderTimeSlots = (day, dayDate, slots, booked) => {
    return slots.map((time) => {
      const isBooked = booked.includes(time);
      return (
        <button
          key={time}
          className={`time-slot ${isBooked ? "booked" : ""}`}
          disabled={isBooked}
          onClick={(e) => {
            e.stopPropagation();
            if (!isBooked) {
              openModal(day, dayDate, time);
            }
          }}
        >
          {time}
        </button>
      );
    });
  };

  return (
    <Layout>
      <div className="booking-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-booking">
        <div
          className="hero-bg-image"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida/AP1WRLt93PxvY0hEZj3E1HCEFWX4zg3hBIx0DSLXXkcDkF0ln096wsd0U2SBc5Zh0UcuVYw9bLGQp3pnl7gHRV_w3sJjSWpp4wQWO2zOezmyaq_mclBekK-niX6Eq9k24GHNwa58KK15bdWpBXuM7sHzeZ59Z__-zfzbVE-yG0fAto3cpuih0EQXAYW1tQvjxPASJ__Mq78Oi4kw822UPacyw-exRpmWkVmguzNuFfl0IWViUtfZxHLRgLJECys")',
          }}
        ></div>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Al-Bayan Pitch{" "}
              <span className="hero-subtitle">(Al-Bayan Pitch)</span>
            </h1>
            <p className="hero-desc">
              Experience our premium FIFA-grade indoor facility. Engineered for
              speed, designed for athletes.
            </p>
            <a href="#booking" className="btn-primary hero-btn">
              Check Availability
              <span className="material-symbols-outlined">arrow_downward</span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== 3. BOOKING INTERFACE ===== */}
      <section className="booking-interface" id="booking">
        <div className="booking-header">
          <h2 className="section-title">Select Your Slot</h2>
          <div className="legend">
            <span className="legend-item">
              <span className="legend-dot available"></span> Available
            </span>
            <span className="legend-item">
              <span className="legend-dot selected"></span> Selected
            </span>
            <span className="legend-item">
              <span className="legend-dot booked"></span> Booked
            </span>
          </div>
        </div>

        {loadingSlots && (
          <p className="booking-status">Loading available slots...</p>
        )}
        {slotsError && (
          <p className="booking-status error">{slotsError}</p>
        )}
        {bookingSuccess && (
          <p className="booking-status success">{bookingSuccess}</p>
        )}
        {!loadingSlots && !slotsError && daysData.length === 0 && (
          <p className="booking-status">No available slots were found.
            Please check back later.
          </p>
        )}

        <div className="accordion-list">
          {daysData.map((item) => {
            const isActive = activeDay === item.day;
            return (
              <div
                key={item.day}
                className={`accordion-item ${isActive ? "active" : ""}`}
              >
                <div
                  className="accordion-header"
                  onClick={() => toggleAccordion(item.day)}
                >
                  <div className="accordion-left">
                    <span className="material-symbols-outlined">
                      calendar_today
                    </span>
                    <span className="day-label">{item.day}</span>
                  </div>
                  <div className="accordion-right">
                    <span className="rate-label">Rate: 500SYP / Hour</span>
                    <span
                      className={`chevron-icon ${isActive ? "rotated" : ""}`}
                    >
                      expand_more
                    </span>
                  </div>
                </div>
                <div
                  className="accordion-content"
                  ref={(el) => (contentRefs.current[item.day] = el)}
                  style={{ maxHeight: "0px", opacity: "0" }}
                >
                  <div className="slots-container">
                    {renderTimeSlots(item.day, item.date, item.slots, item.booked)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 4. STATS SECTION ===== */}
      <section className="stats-section">
        <div className="stats-card primary-card">
          <span className="material-symbols-outlined stats-icon">
            verified_user
          </span>
          <div>
            <h3 className="stats-title">Pro-Grade Experience</h3>
            <p className="stats-desc">
              Our pitches use high-density monofilament fibers and organic
              infill, reducing joint strain and maximizing ball roll accuracy.
            </p>
          </div>
        </div>
        <div className="stats-card secondary-card">
          <span className="stats-number">12+</span>
          <span className="stats-label">Local Tournaments Monthly</span>
        </div>
      </section>

      {/* ===== 5. BOOKING MODAL ===== */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">Confirm Booking</span>
                <h3 className="modal-title">Al-Bayan Pitch</h3>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-detail">
                <span className="material-symbols-outlined">
                  calendar_month
                </span>
                <span>
                  Date: <strong>{selectedDay}, June 2024</strong>
                </span>
              </div>
              <div className="modal-detail">
                <span className="material-symbols-outlined">schedule</span>
                <span>
                  Time: <strong>{selectedTime}</strong>
                </span>
              </div>
              <div className="modal-duration">
                <span className="duration-label">Select Duration</span>
                <div className="duration-options">
                  <label className="duration-option">
                    <input
                      type="radio"
                      name="duration"
                      value="1"
                      checked={selectedDuration === 1}
                      onChange={() => handleDurationChange(1)}
                    />
                    1 Hour
                  </label>
                  <label className="duration-option">
                    <input
                      type="radio"
                      name="duration"
                      value="1.5"
                      checked={selectedDuration === 1.5}
                      onChange={() => handleDurationChange(1.5)}
                    />
                    1.5 Hours
                  </label>
                  <label className="duration-option">
                    <input
                      type="radio"
                      name="duration"
                      value="2"
                      checked={selectedDuration === 2}
                      onChange={() => handleDurationChange(2)}
                    />
                    2 Hours
                  </label>
                </div>
              </div>
              <div className="modal-field">
                <label className="modal-field-label" htmlFor="advancePayment">
                  Advance Payment
                </label>
                <input
                  id="advancePayment"
                  type="number"
                  min="0"
                  step="1"
                  value={advancePayment}
                  onChange={(e) => setAdvancePayment(Number(e.target.value))}
                  className="modal-input"
                />
              </div>
              {bookingError && (
                <p className="booking-status error">{bookingError}</p>
              )}
              <div className="modal-summary">
                <div className="summary-row">
                  <span className="summary-label">Total Price</span>
                  <span className="summary-price">
                    {totalPrice.toFixed(2)} SYP
                  </span>
                </div>
                <div className="summary-row small">
                  <span>VAT INCLUDED</span>
                </div>
                <div className="summary-row deposit">
                  <span>Advance Deposit</span>
                  <span>{advancePayment.toFixed(2)} SYP</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary modal-confirm"
                onClick={confirmBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Confirm & Book Pitch Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </Layout>
  );
};

export default BookingPage;
