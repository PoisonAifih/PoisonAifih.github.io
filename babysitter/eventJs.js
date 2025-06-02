// Create a new file called calendar.js

// Calendar and Schedule Data
const calendarData = {
  currentMonth: 4, // May (0-indexed)
  currentYear: 2025,
  selectedDate: null,
  events: {
    // May events
    "2025-05-03": { hasEvent: true },
    "2025-05-10": { hasEvent: true },
    "2025-05-15": { hasEvent: true },
    "2025-05-22": { hasEvent: true },
    // April events
    "2025-04-05": { hasEvent: true },
    "2025-04-18": { hasEvent: true },
    // June events
    "2025-06-08": { hasEvent: true },
    "2025-06-17": { hasEvent: true },
    "2025-06-25": { hasEvent: true },
  },
};

// Schedule data for each date with an event
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

// Improved setupCalendarListeners function

function setupCalendarListeners() {
  // Add event listeners to date cells
  document.querySelectorAll(".calendar-date").forEach((dateCell) => {
    dateCell.addEventListener("click", function () {
      const date = this.getAttribute("data-date");

      // Remove selected class from all dates
      document.querySelectorAll(".calendar-date").forEach((cell) => {
        cell.classList.remove("selected-date");
      });

      // Add selected class to the clicked date
      this.classList.add("selected-date");

      // Update the selected date
      calendarData.selectedDate = date;

      // If this date has a schedule, update the order info
      if (calendarData.events[date]?.hasEvent) {
        updateOrderInfo(date);
      }
    });
  });

  // Add event listeners to month navigation buttons
  const prevMonthBtn = document.querySelector(".prev-month");
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", function () {
      if (calendarData.currentMonth > 3) {
        // Only allow going back to April (month index 3)
        calendarData.currentMonth--;
        generateCalendar();
      }
    });
  }

  const nextMonthBtn = document.querySelector(".next-month");
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", function () {
      if (calendarData.currentMonth < 5) {
        // Only allow going forward to June (month index 5)
        calendarData.currentMonth++;
        generateCalendar();
      }
    });
  }
}
// Update the updateOrderInfo function to modify both cards
function updateOrderInfo(date) {
  const schedule = scheduleData[date];
  if (!schedule) return;

  console.log(
    "Updating order info for date:",
    date,
    "with schedule:",
    schedule
  );

  // Update both order cards with the same date information
  updateOrderCard(document.getElementById("order-card-1"), schedule);

  // Create slightly modified data for the second card
  const secondSchedule = {
    clientName:
      schedule.clientName === "Kodok"
        ? "Kaeru"
        : schedule.clientName === "Pika Pika"
        ? "Chu Chu"
        : schedule.clientName.split(" ")[0] + " Friend",
    date: schedule.date, // Same date
    price: adjustPrice(schedule.price),
    time: adjustTimeSlot(schedule.time),
  };

  // Update the second order card
  updateOrderCard(document.getElementById("order-card-2"), secondSchedule);
}

// Helper function to update a single order card
function updateOrderCard(cardElement, scheduleData) {
  if (!cardElement) return;

  // Update client name
  const clientNameElement = cardElement.querySelector(".order-header h4");
  if (clientNameElement) {
    clientNameElement.textContent = scheduleData.clientName;
  }

  // Update date
  const dateElement = cardElement.querySelector(".order-date");
  if (dateElement) {
    dateElement.textContent = scheduleData.date;
  }

  // Update price
  const priceElement = cardElement.querySelector(".order-amount");
  if (priceElement) {
    priceElement.textContent = scheduleData.price;
  }

  // Update time slot
  const timeSlotElement = cardElement.querySelector(".time-slot");
  if (timeSlotElement) {
    timeSlotElement.textContent = scheduleData.time;
  }

  // Update progress bar with random progress
  const progressPercent = Math.floor(Math.random() * 91) + 10; // Random between 10% and 100%
  const progressBar = cardElement.querySelector(".progress-bar");
  const progressText = cardElement.querySelector(".progress-text");

  if (progressBar && progressText) {
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${progressPercent}% Complete`;
  }
}

// Helper functions for creating variations in the second card
function adjustTimeSlot(timeSlot) {
  const parts = timeSlot.split("-");
  if (parts.length !== 2) return timeSlot;

  const [startHour, startMin = "00"] = parts[0].split(".");
  const [endHour, endMin = "00"] = parts[1].split(".");

  // Adjust the hours slightly
  const newStartHour = Math.max(8, Math.min(17, parseInt(startHour) + 1));
  const newEndHour = Math.max(12, Math.min(21, parseInt(endHour) + 2));

  return `${newStartHour.toString().padStart(2, "0")}.${startMin}-${newEndHour
    .toString()
    .padStart(2, "0")}.${endMin}`;
}

function adjustPrice(price) {
  // Extract the number part from the price string
  const numericPart = price.replace(/[^\d]/g, "");
  const priceValue = parseInt(numericPart);

  // Adjust by ±20%
  const adjustmentFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
  const newPrice = Math.round(priceValue * adjustmentFactor);

  // Format back to Indonesian Rupiah
  return `Rp. ${formatWithDots(newPrice)}`;
}

function formatWithDots(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Improved generateCalendar function with better event marking
function generateCalendar() {
  const calendarContainer = document.getElementById("calendar-container");
  if (!calendarContainer) return;

  // Get the first day of the month
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
  const startDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Get month name
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

  // Create calendar HTML
  let calendarHTML = `
    <div class="calendar-header">
      <button class="prev-month" ${
        calendarData.currentMonth === 3 ? "" : "disabled"
      }>❮</button>
      <h3>${currentMonthName} ${calendarData.currentYear}</h3>
      <button class="next-month" ${
        calendarData.currentMonth === 5 ? "" : "disabled"
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
    <div class="calendar-dates">
  `;

  // Add days from the previous month
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

  // Add days for the current month
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
      </div>
    `;
  }

  // Calculate days needed from the next month
  const totalCells = 42; // 6 rows x 7 days
  const remainingCells = totalCells - (startDayIndex + daysInMonth);

  // Add days from the next month
  for (let day = 1; day <= remainingCells && day <= 14; day++) {
    // Only show up to 2 rows of next month
    calendarHTML += `<div class="next-month-date">${day}</div>`;
  }

  calendarHTML += `</div>`;
  calendarContainer.innerHTML = calendarHTML;

  // Add event listeners to the calendar
  setupCalendarListeners();

  // Set a default selected date if none is selected
  if (!calendarData.selectedDate) {
    // Try to find the first date with an event in the current month
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
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Rest of your existing DOMContentLoaded code

  // Initialize calendar after components are loaded
  setTimeout(() => {
    const contentDiv = document.querySelector(".content");
    if (contentDiv) {
      // Insert the calendar panel after the first section-row
      const firstRow = document.querySelector(".section-row");
      if (firstRow) {
        const calendarSection = document.createElement("div");
        calendarSection.className = "section-row";
        calendarSection.innerHTML = calendarPanelHTML;
        firstRow.after(calendarSection);

        // Generate the initial calendar
        generateCalendar();
      }
    }
  }, 200);
});
