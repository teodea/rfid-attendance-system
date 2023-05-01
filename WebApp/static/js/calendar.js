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

function getPercentageAttendanceDay(courseId, sectionId, day, month, year) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/get-percentage-attendance-day?courseId=' + courseId + '&sectionId=' + sectionId + '&year=' + year + '&month=' + month + '&day=' + day,
      type: 'GET',
      success: function(response) {
        resolve(response);
      }
    });
  });
}

async function createCourseOfDayElement(course, day, month, year) {
  const courseOfDay = document.createElement('div');
  courseOfDay.className = 'course-of-day';
  const courseOfDayTitle = document.createElement('h4');
  if (course[2] == true) {
    courseOfDayTitle.textContent = course[0] + " (Online)";
    courseOfDay.append(courseOfDayTitle);
  } else {
    const percentageAttendanceDay = await getPercentageAttendanceDay(course[0], course[1], day, month, year);
    courseOfDayTitle.textContent = course[0] + " (" + percentageAttendanceDay + "%)" + ":";
    courseOfDay.append(courseOfDayTitle);
    const studentsAttendance = await getStudentsAttendance(course[0], course[1], day, month, year);
    studentsAttendance.forEach(student => {
      const studentRow = document.createElement('div');
      studentRow.className = 'row';
      courseOfDay.append(studentRow);
      const studentNameColumn = document.createElement('div');
      studentNameColumn.className = 'column';
      studentRow.append(studentNameColumn);
      const checkInColumn = document.createElement('div');
      checkInColumn.className = 'column';
      studentRow.append(checkInColumn);
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
  return courseOfDay;
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

  const coursesDayContainer = document.createElement('div');
  coursesDayContainer.className = 'courses-day';
  
  classListDay.forEach(async course => {
    const courseOfDay = await createCourseOfDayElement(course, day, month, year);
    coursesDayContainer.appendChild(courseOfDay);
  });

  attendance.appendChild(coursesDayContainer);
  attendanceContainer.appendChild(attendance);
}

function renderCourseSemester(course) {
  const attendanceContainer = document.getElementById('attendance-container');
  attendanceContainer.innerHTML = '';

  const attendance = document.createElement('div');
  attendance.className = 'attendance';

  const attendanceTitle = document.createElement('h2');
  attendanceTitle.textContent = `${course[0]}:`;
  attendance.appendChild(attendanceTitle);

  

  attendanceContainer.appendChild(attendance);
}

function handleDayClick(day, month, year, months) {
  console.log(`Day clicked: ${day} ${months[month-1]} ${year}`);
  renderAttendanceDay(day, months[month-1], year);
}

function handleCourseClick(course) {
  console.log(`Course clicked: ${course[0]}`);
  renderCourseSemester(course);
}

async function renderCourses() {
  const coursesContainer = document.getElementById('courses-container');
  coursesContainer.innerHTML = '';

  const courses = document.createElement('div');
  courses.className = 'courses';

  const classListAll = await getClassesAll();
  classListAll.forEach(course => {
    const button = document.createElement('button');
    button.innerHTML = course[0];
    button.className = 'course-button';
    button.onclick = () => handleCourseClick(course);
    courses.appendChild(button);
  });

  coursesContainer.appendChild(courses);
}


function renderCalendar() {
  renderCourses();

  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = '';
  
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