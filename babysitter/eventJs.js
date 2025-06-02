document.addEventListener("DOMContentLoaded", function () {
  const calendarData = {
    currentMonth: 4,
    currentYear: 2025,
    selectedDate: "2025-05-10",
    events: {
      "2025-05-03": { hasEvent: true },
      "2025-05-10": { hasEvent: true },
      "2025-05-15": { hasEvent: true },
      "2025-05-22": { hasEvent: true },
      "2025-04-05": { hasEvent: true },
      "2025-04-18": { hasEvent: true },
      "2025-06-08": { hasEvent: true },
      "2025-06-17": { hasEvent: true },
      "2025-06-25": { hasEvent: true },
    },
  };

  const scheduleData = {
    "2025-05-03": {
      clientName: "Jotaro K.",
      time: "09:00-14:00",
      date: "03/05/2025",
      price: "Rp. 750.000",
    },
    "2025-05-10": {
      clientName: "Pika Pika",
      time: "08:00-17:00",
      date: "10/05/2025",
      price: "Rp. 1.000.000",
    },
    "2025-05-15": {
      clientName: "Kodok",
      time: "13:00-18:00",
      date: "15/05/2025",
      price: "Rp. 650.000",
    },
    "2025-05-22": {
      clientName: "Naruto U.",
      time: "10:00-16:00",
      date: "22/05/2025",
      price: "Rp. 850.000",
    },
    "2025-04-05": {
      clientName: "Sasuke U.",
      time: "09:00-15:00",
      date: "05/04/2025",
      price: "Rp. 800.000",
    },
    "2025-04-18": {
      clientName: "Sakura H.",
      time: "14:00-19:00",
      date: "18/04/2025",
      price: "Rp. 600.000",
    },
    "2025-06-08": {
      clientName: "Kakashi H.",
      time: "08:00-16:00",
      date: "08/06/2025",
      price: "Rp. 950.000",
    },
    "2025-06-17": {
      clientName: "Hinata H.",
      time: "10:00-15:00",
      date: "17/06/2025",
      price: "Rp. 700.000",
    },
    "2025-06-25": {
      clientName: "Shikamaru N.",
      time: "12:00-17:00",
      date: "25/06/2025",
      price: "Rp. 750.000",
    },
  };

  function updateOrderInfo(date) {
    const schedule = scheduleData[date];
    if (!schedule) return;

    updateOrderCard(document.getElementById("order-card-1"), schedule);

    const secondSchedule = {
      clientName:
        schedule.clientName === "Kodok"
          ? "Kaeru"
          : schedule.clientName === "Pika Pika"
          ? "Chu Chu"
          : schedule.clientName.split(" ")[0] + " Friend",
      date: schedule.date,
      price: adjustPrice(schedule.price),
      time: adjustTimeSlot(schedule.time),
    };

    updateOrderCard(document.getElementById("order-card-2"), secondSchedule);
  }

  function updateOrderCard(cardElement, scheduleData) {
    if (!cardElement) return;

    const clientNameElement = cardElement.querySelector(".order-header h4");
    if (clientNameElement) {
      clientNameElement.textContent = scheduleData.clientName;
    }

    const dateElement = cardElement.querySelector(".order-date");
    if (dateElement) {
      dateElement.textContent = scheduleData.date;
    }

    const priceElement = cardElement.querySelector(".order-amount");
    if (priceElement) {
      priceElement.textContent = scheduleData.price;
    }

    const timeSlotElement = cardElement.querySelector(".time-slot");
    if (timeSlotElement) {
      timeSlotElement.textContent = scheduleData.time;
    }

    const progressPercent = Math.floor(Math.random() * 91) + 10;
    const progressBar = cardElement.querySelector(".progress-bar");
    const progressText = cardElement.querySelector(".progress-text");

    if (progressBar && progressText) {
      progressBar.style.width = `${progressPercent}%`;
      progressText.textContent = `${progressPercent}% Complete`;
    }
  }

  function adjustTimeSlot(timeSlot) {
    const parts = timeSlot.split("-");
    if (parts.length !== 2) return timeSlot;

    const [startHour, startMin = "00"] = parts[0].split(".");
    const [endHour, endMin = "00"] = parts[1].split(".");

    const newStartHour = Math.max(8, Math.min(17, parseInt(startHour) + 1));
    const newEndHour = Math.max(12, Math.min(21, parseInt(endHour) + 2));

    return `${newStartHour
      .toString()
      .padStart(
        2,
        "0"
      )}.${startMin}-${newEndHour.toString().padStart(2, "0")}.${endMin}`;
  }

  function adjustPrice(price) {
    const numericPart = price.replace(/[^\d]/g, "");
    const priceValue = parseInt(numericPart);

    const adjustmentFactor = 0.8 + Math.random() * 0.4;
    const newPrice = Math.round(priceValue * adjustmentFactor);

    return `Rp. ${formatWithDots(newPrice)}`;
  }

  function formatWithDots(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function setupCalendarListeners() {
    document.querySelectorAll(".calendar-date").forEach((dateCell) => {
      dateCell.addEventListener("click", function () {
        const date = this.getAttribute("data-date");

        document.querySelectorAll(".calendar-date").forEach((cell) => {
          cell.classList.remove("selected-date");
        });

        this.classList.add("selected-date");
        calendarData.selectedDate = date;

        if (calendarData.events[date]?.hasEvent) {
          updateOrderInfo(date);
        }
      });
    });

    const prevMonthBtn = document.querySelector(".prev-month");
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", function () {
        if (calendarData.currentMonth > 3) {
          calendarData.currentMonth--;
          generateCalendar();
        }
      });
    }

    const nextMonthBtn = document.querySelector(".next-month");
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", function () {
        if (calendarData.currentMonth < 5) {
          calendarData.currentMonth++;
          generateCalendar();
        }
      });
    }
  }

  function generateCalendar() {
    const calendarContainer = document.getElementById("calendar-container");
    if (!calendarContainer) return;

    const firstDay = new Date(
      calendarData.currentYear,
      calendarData.currentMonth,
      1
    );
    const lastDay = new Date(
      calendarData.currentYear,
      calendarData.currentMonth + 1,
      0
    );
    const daysInMonth = lastDay.getDate();
    const startDayIndex = firstDay.getDay();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonthName = monthNames[calendarData.currentMonth];

    let calendarHTML = `
          <div class="calendar-header">
            <button class="prev-month" ${
              calendarData.currentMonth === 3 ? "disabled" : ""
            }>❮</button>
            <h3>${currentMonthName} ${calendarData.currentYear}</h3>
            <button class="next-month" ${
              calendarData.currentMonth === 5 ? "disabled" : ""
            }>❯</button>
          </div>
          <div class="calendar-days">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div class="calendar-dates">`;

    const prevMonth =
      calendarData.currentMonth === 0 ? 11 : calendarData.currentMonth - 1;
    const prevYear =
      calendarData.currentMonth === 0
        ? calendarData.currentYear - 1
        : calendarData.currentYear;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = 0; i < startDayIndex; i++) {
      const day = daysInPrevMonth - startDayIndex + i + 1;
      calendarHTML += `<div class="prev-month-date">${day}</div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${calendarData.currentYear}-${String(
        calendarData.currentMonth + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasEvent = calendarData.events[date]?.hasEvent;
      const isSelected =
        calendarData.selectedDate === date ? "selected-date" : "";

      calendarHTML += `
            <div class="calendar-date${hasEvent ? " has-event" : ""}${
        isSelected ? " selected-date" : ""
      }" 
                 data-date="${date}">
              ${day}
              ${hasEvent ? '<span class="event-indicator"></span>' : ""}
            </div>`;
    }

    calendarHTML += `</div>`;
    calendarContainer.innerHTML = calendarHTML;

    setupCalendarListeners();

    if (!calendarData.selectedDate) {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${calendarData.currentYear}-${String(
          calendarData.currentMonth + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (calendarData.events[date]?.hasEvent) {
          const dateCell = document.querySelector(
            `.calendar-date[data-date="${date}"]`
          );
          if (dateCell) {
            dateCell.classList.add("selected-date");
            calendarData.selectedDate = date;
            updateOrderInfo(date);
            break;
          }
        }
      }
    } else {
      updateOrderInfo(calendarData.selectedDate);
    }
  }

  setupCalendarListeners();

  const selectedDate = document.querySelector(".calendar-date.selected-date");
  if (selectedDate) {
    const date = selectedDate.getAttribute("data-date");
    if (date) {
      updateOrderInfo(date);
    }
  }
});
