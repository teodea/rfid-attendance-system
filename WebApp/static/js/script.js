function renderCalendar() {
    const yearSelect = document.getElementById('year');
    const calendarContainer = document.getElementById('calendar-container');
    const selectedYear = parseInt(yearSelect.value);
  
    calendarContainer.innerHTML = ''; // Clear the container
  
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
  
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
    for (let month = 0; month < 12; month++) {
      const calendar = document.createElement('div');
      calendar.className = 'calendar';
  
      const monthTitle = document.createElement('h2');
      monthTitle.textContent = `${months[month]} ${selectedYear}`;
      monthTitle.onclick = function () {
        // Add your custom code to handle month clicks here
        console.log(`Month clicked: ${months[month]} ${selectedYear}`);
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
  
      const firstDayOfMonth = new Date(selectedYear, month, 1).getDay();
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
  
      for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        const calendarDay = document.createElement('div');
        calendarDay.className = 'calendar-day';
  
        if (
          day === new Date().getDate() &&
          month === new Date().getMonth() &&
          selectedYear === new Date().getFullYear()
        ) {
          calendarDay.classList.add('today');
        }
  
        calendarDay.textContent = day;
        calendarDay.onclick = function () {
          // Add your custom code to handle day clicks here
          console.log(`Day clicked: ${day} ${months[month]} ${selectedYear}`);
        };
        calendarGrid.appendChild(calendarDay);
      }
  
      calendar.appendChild(calendarGrid);
      calendarContainer.appendChild(calendar);
    }
  }