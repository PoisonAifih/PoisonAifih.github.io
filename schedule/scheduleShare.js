const scheduleSharing = {
  loadInitialSchedules() {
    if (localStorage.getItem("schedules")) {
      console.log("Schedules already exist in localStorage");
      return;
    }

    console.log("Loading initial schedules from HTML");
    const defaultSchedules = [];
    document
      .querySelectorAll(".schedule-container .schedule-card")
      .forEach((card) => {
        if (!card.parentElement.classList.contains("main-panel")) {
          const timeText = card.querySelector(".schedule-time").textContent;
          const activity = card.querySelector(".schedule-info h3").textContent;
          const status = card.querySelector(".schedule-status").textContent;

          const isCompleted = card.hasAttribute("data-completed");
          const backgroundColor = card.style.backgroundColor || "";
          const isActive = card
            .querySelector(".schedule-status")
            .classList.contains("active");

          defaultSchedules.push({
            time: timeText,
            activity: activity,
            status: status,
            isActive: isActive,
            isCompleted: isCompleted,
            backgroundColor: backgroundColor,
          });
        }
      });

    if (defaultSchedules.length > 0) {
      console.log("Saving initial schedules:", defaultSchedules);
      localStorage.setItem("schedules", JSON.stringify(defaultSchedules));
    }
  },

  getCurrentSchedules() {
    const schedules = JSON.parse(localStorage.getItem("schedules") || "[]");
    const now = new Date();

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeValue = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;

    return schedules.map((schedule) => {
      const [startTime, endTime] = schedule.time.split(" - ");
      const isActive =
        this.isTimeBetween(currentTimeValue, startTime, endTime) &&
        !schedule.isCompleted;

      let status = "Upcoming";
      if (isActive) {
        status = "Active Now";
      } else if (schedule.isCompleted) {
        status = "Completed";
      }

      return {
        ...schedule,
        isActive: isActive,
        status: status,
      };
    });
  },

  isTimeBetween(time, start, end) {
    return (
      this.compareTimeStrings(time, start) >= 0 &&
      this.compareTimeStrings(time, end) <= 0
    );
  },

  compareTimeStrings(time1, time2) {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    if (hours1 !== hours2) {
      return hours1 - hours2;
    }
    return minutes1 - minutes2;
  },
  updateScheduleDisplays() {
    const dashboardScheduleContainer = document.querySelector(
      ".main-panel.schedule-container"
    );
    if (!dashboardScheduleContainer) return;

    const existingCards =
      dashboardScheduleContainer.querySelectorAll(".schedule-card");
    existingCards.forEach((card) => card.remove());

    const schedules = this.getCurrentSchedules();

    schedules.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;

      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;

      const aStartTime = a.time.split(" - ")[0];
      const bStartTime = b.time.split(" - ")[0];
      return this.compareTimeStrings(aStartTime, bStartTime);
    });

    const showCount = Math.min(3, schedules.length);
    for (let i = 0; i < showCount; i++) {
      const schedule = schedules[i];

      const scheduleCard = document.createElement("div");
      scheduleCard.className = schedule.isCompleted
        ? "schedule-card completed"
        : schedule.isActive
        ? "schedule-card"
        : "schedule-card upcoming";

      if (schedule.isCompleted) {
        scheduleCard.style.backgroundColor = "#4caf50";
        scheduleCard.style.color = "white";
      } else if (schedule.backgroundColor) {
        scheduleCard.style.backgroundColor = schedule.backgroundColor;
      }

      let statusDisplay = schedule.isCompleted
        ? "Completed"
        : schedule.isActive
        ? "Active Now"
        : "Upcoming";

      scheduleCard.innerHTML = `
        <div class="schedule-time">${schedule.time}</div>
        <div class="schedule-info">
          <h3>${schedule.activity}</h3>
          <div class="schedule-status${
            schedule.isActive && !schedule.isCompleted ? " active" : ""
          }">
            ${statusDisplay}
          </div>
        </div>
      `;

      dashboardScheduleContainer.appendChild(scheduleCard);
    }

    if (schedules.length === 0) {
      const noSchedulesMsg = document.createElement("p");
      noSchedulesMsg.textContent = "No schedules have been created yet.";
      noSchedulesMsg.style.textAlign = "center";
      noSchedulesMsg.style.padding = "20px";
      dashboardScheduleContainer.appendChild(noSchedulesMsg);
    }

    this.syncScheduleStatus();
  },

  syncScheduleStatus() {
    const updatedSchedules = this.getCurrentSchedules();

    const schedulePageCards = document.querySelectorAll(
      ".schedule-container .schedule-card:not(.main-panel .schedule-card)"
    );

    if (schedulePageCards.length > 0) {
      schedulePageCards.forEach((card) => {
        if (!card.hasAttribute("data-completed")) {
          const statusElement = card.querySelector(".schedule-status");
          statusElement.classList.remove("active");
          statusElement.textContent = "Upcoming";

          if (card.classList.contains("upcoming") === false) {
            card.classList.add("upcoming");
          }
        }
      });

      schedulePageCards.forEach((card) => {
        const timeText = card.querySelector(".schedule-time").textContent;
        const activity = card.querySelector(".schedule-info h3").textContent;

        const matchingSchedule = updatedSchedules.find(
          (s) => s.time === timeText && s.activity === activity
        );

        if (matchingSchedule && !card.hasAttribute("data-completed")) {
          const statusElement = card.querySelector(".schedule-status");

          if (matchingSchedule.isActive) {
            statusElement.classList.add("active");
            statusElement.textContent = "Active Now";
            card.classList.remove("upcoming");
          } else {
            statusElement.classList.remove("active");
            statusElement.textContent = "Upcoming";
            card.classList.add("upcoming");
          }
        }
      });
    }

    localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
  },

  forceUpdate() {
    this.syncScheduleStatus();
    this.updateScheduleDisplays();
  },
};

document.addEventListener("DOMContentLoaded", function () {
  scheduleSharing.loadInitialSchedules();

  setTimeout(() => {
    scheduleSharing.syncScheduleStatus();
    scheduleSharing.updateScheduleDisplays();
  }, 100);

  setInterval(() => {
    scheduleSharing.syncScheduleStatus();
    scheduleSharing.updateScheduleDisplays();
  }, 30000);

  window.addEventListener("storage", function (e) {
    if (e.key === "schedules") {
      scheduleSharing.syncScheduleStatus();
      scheduleSharing.updateScheduleDisplays();
    }
  });

  window.addEventListener("scheduleUpdated", function (e) {
    scheduleSharing.syncScheduleStatus();
    scheduleSharing.updateScheduleDisplays();
  });
});
