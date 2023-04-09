function getSemesterDates() {
  const academicYear = $('#academic-year').val();
  const semester = $('#semester').val();
  $.ajax({
    url: '/get-semester-dates?academicYear=' + academicYear + '&semester=' + semester,
    type: 'GET',
    success: function(response) {
      $('#start-day').val(response.startDay.substr(0, 10));
      $('#end-day').val(response.endDay.substr(0, 10));
      renderCalendar();
    }
  })
}

function getSemesterList() {
  const academicYear = $('#academic-year').val();
  $.ajax({
    url: '/get-semester-list?academicYear=' + academicYear,
    type: 'GET',
    success: function(response) {
      $('#semester').empty();
      $.each(response, function(index, value) {
        if (index == 0) {
          $('#semester').append('<option value="' + value + '" selected>' + value + '</option>');
        } else {
          $('#semester').append('<option value="' + value + '">' + value + '</option>');
        }
      });
      getSemesterDates();
    }
  });
}

function renderCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = '';
  
  const academicYear = document.getElementById('academic-year').value;
  const semester = document.getElementById('semester').value;
  const startDay = document.getElementById('start-day').value;
  const endDay = document.getElementById('end-day').value;

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  startingMonth = parseInt(startDay.substr(5, 2), 10);
  endingMonth = parseInt(endDay.substr(5, 2), 10);

  for (let month = startingMonth-1; month < endingMonth-1; month++) {
    const calendar = document.createElement('div');
    calendar.className = 'calendar';

    const monthTitle = document.createElement('h2');
    monthTitle.textContent = `${months[month]}`;
    monthTitle.onclick = function () {
      console.log(`Month clicked: ${months[month]} ${academicYear}`);
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

    const firstDayOfMonth = new Date(academicYear.substr(0, 4), month, 1).getDay();
    const daysInMonth = new Date(academicYear.substr(0, 4), month+1, 0).getDate();

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
        console.log(`Day clicked: ${day} ${months[month]} ${academicYear}`);
      };
      calendarGrid.appendChild(calendarDay);
    }

    calendar.appendChild(calendarGrid);
    calendarContainer.appendChild(calendar);
  }
}