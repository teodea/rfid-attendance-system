function renderCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = '';

  const academicYearSelect = document.getElementById('academic-year');
  const selectedAcademicYear = parseInt(academicYearSelect.value);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let month = 0; month < 12; month++) {
    const calendar = document.createElement('div');
    calendar.className = 'calendar';

    const monthTitle = document.createElement('h2');
    monthTitle.textContent = `${months[month]} ${selectedAcademicYear}`;
    monthTitle.onclick = function () {
      console.log(`Month clicked: ${months[month]} ${selectedAcademicYear}`);
    };
    calendar.appendChild(monthTitle);

    const daysOfWeekContainer = document.createElement('div');
    daysOfWeekContainer.className = 'days-of-week';

    daysOfWeek.forEach(day => {
      const dayOfWeek = document.createElement('div');
      dayOfWeek.className = 'day-of-week';
      dayOfWeek.textContent = day;
      daysOfWeekContainer.appendChild(dayOfWeek);
    });

    calendar.appendChild(daysOfWeekContainer);

    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';

    const firstDayOfMonth = new Date(selectedAcademicYear, month, 1).getDay();
    const daysInMonth = new Date(selectedAcademicYear, month+1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day';
      calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const calendarDay = document.createElement('div');
      calendarDay.className = 'calendar-day';
      calendarDay.textContent = day;
      calendarDay.onclick = function () {
        console.log(`Day clicked: ${day} ${months[month]} ${selectedAcademicYear}`);
      };
      calendarGrid.appendChild(calendarDay);
    }

    calendar.appendChild(calendarGrid);
    calendarContainer.appendChild(calendar);
  }
}