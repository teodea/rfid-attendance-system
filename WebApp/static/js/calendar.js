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

  console.clear();
  console.log(academicYear);
  console.log(semester);
  console.log(startDay);
  console.log(endDay);

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

    
  }
}