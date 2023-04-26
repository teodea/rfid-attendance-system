function getClassesAll() {
  return new Promise((resolve, reject) => {
    const instructorId = $('#instructor-id').val();
    const academicYear = $('#academic-year').val();
    const semesterId = $('#semester').val();
    let classListAll = [];
    $.ajax({
      url: '/get-classes-all?instructorId=' + instructorId + '&academicYear=' + academicYear + '&semesterId=' + semesterId,
      type: 'GET',
      success: function(response) {
        $.each(response, function(index, value) {
          classListAll.push([value.courseId, value.sectionId]);
        });
        resolve(classListAll);
      }
    });
  });
}

async function getClassesDay(day, month, year) {
  const classListAll = await getClassesAll();
  const academicYear = $('#academic-year').val();
  const semesterId = $('#semester').val();
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/get-classes-day?classListAll=' + JSON.stringify(classListAll) + '&year=' + year + '&month=' + month + '&day=' + day + '&academicYear=' + academicYear + '&semesterId=' + semesterId,
      type: 'GET',
      success: function(response) {
        const classListDay = [];
        $.each(response, function(index, value) {
          classListDay.push([value.courseId, value.sectionId, value.online]);
        });
        resolve(classListDay);
      }
    });
  });
}

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
  });
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

function getStudentsAttendance(courseId, sectionId, day, month, year) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/get-attendance-day?courseId=' + courseId + '&sectionId=' + sectionId + '&year=' + year + '&month=' + month + '&day=' + day,
      type: 'GET',
      success: function(response) {
        const studentsAttendance = [];
        $.each(response, function(index, value) {
          studentsAttendance.push([value.studentName, value.checkIn]);
        });
        resolve(studentsAttendance);
      }
    });
  });
}

async function renderAttendanceDay(day, month, year) {
  const attendanceContainer = document.getElementById('attendance-container');
  attendanceContainer.innerHTML = '';

  const attendance = document.createElement('div');
  attendance.className = 'attendance';

  const attendanceTitle = document.createElement('h2');
  attendanceTitle.textContent = `${day} ${month} ${year}:`;
  attendance.appendChild(attendanceTitle);

  const classListDay = await getClassesDay(day, month, year);
  console.log(classListDay);

  const coursesContainer = document.createElement('div');
  coursesContainer.className = 'courses';
  
  classListDay.forEach(async course => {
    const courseOfDay = document.createElement('div');
    courseOfDay.className = 'course-of-day';
    courseOfDayTitle = document.createElement('h4');
    courseOfDayTitle.textContent = course[0] + ":";
    courseOfDay.append(courseOfDayTitle);
    if (course[2] == true) {
      const remotePrint = document.createElement('div');
      remotePrint.className = 'remoteMessage';
      remotePrint.textContent = "Online";
      courseOfDay.append(remotePrint);
    } else {
      studentsAttendance = await getStudentsAttendance(course[0], course[1], day, month, year);
      studentsAttendance.forEach(student => {
        const studentTable = document.createElement('div');
        studentTable.className = 'table';
        courseOfDay.append(studentTable);
        const studentNameColumn = document.createElement('div');
        studentNameColumn.className = 'column';
        studentTable.append(studentNameColumn);
        const checkInColumn = document.createElement('div');
        checkInColumn.className = 'column';
        studentTable.append(checkInColumn);
        const studentRowName = document.createElement('div');
        studentRowName.className = 'attendance-cell';
        studentRowName.textContent = student[0];
        studentNameColumn.append(studentRowName);
        const studentRowCheckIn = document.createElement('div');
        studentRowCheckIn.className = 'attendance-cell';
        studentRowCheckIn.textContent = student[1];
        checkInColumn.append(studentRowCheckIn);
      });
    }
    coursesContainer.appendChild(courseOfDay);
  });

  attendance.appendChild(coursesContainer);
  attendanceContainer.appendChild(attendance);
}

function handleDayClick(day, month, year, months) {
  console.log(`Day clicked: ${day} ${months[month-1]} ${year}`);
  renderAttendanceDay(day, months[month-1], year);
}

function handleMonthTitleClick(month, year, months) {
  console.log(`Month clicked: ${months[month - 1]} ${year}`);
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
  startingYear = parseInt(startDay.substr(0, 4), 10);
  endingYear = parseInt(endDay.substr(0, 4), 10);

  for (let month = startingMonth, year = startingYear; year < endingYear || (year == endingYear && month <= endingMonth); month++) {
    (function(month, year) {
      const calendar = document.createElement('div');
      calendar.className = 'calendar';
  
      const monthTitle = document.createElement('h2');
      monthTitle.textContent = `${months[month-1]}`;
      monthTitle.onclick = () => handleMonthTitleClick(month, year, months);
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
  
      const firstDayOfMonth = new Date(year, month-1, 1).getDay();
      const daysInMonth = new Date(year, month, 0).getDate();
  
      for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        const calendarDay = document.createElement('div');
        calendarDay.className = 'calendar-day';
        calendarDay.textContent = day;
        calendarDay.onclick = () => handleDayClick(day, month, year, months);
        calendarGrid.appendChild(calendarDay);
      }
  
      calendar.appendChild(calendarGrid);
      calendarContainer.appendChild(calendar);
    })(month, year);
  
    if (month == 12 && endingMonth != 12) {
      year++;
      month = 0;
    }
  }  
}