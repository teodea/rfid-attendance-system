async function download_time_by_attendance_per_class() {
  const instructorId = $('#instructor-id').val();
  const academicYear = $('#academic-year').val();
  const semesterId = $('#semester').val();
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/download-csv?instructorId=' + instructorId + '&academicYear=' + academicYear + '&semesterId=' + semesterId,
      type: 'GET',
      success: function(response) {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'data.csv';
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      },
      error: function(xhr, textStatus, errorThrown) {
        console.error('Error downloading CSV:', errorThrown);
        reject(errorThrown);
      }
    });
  });
}

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

function getCourseStatus(courseId, sectionId) {
  return new Promise((resolve, reject) => {
    const academicYear = $('#academic-year').val();
    const semesterId = $('#semester').val();
    $.ajax({
      url: '/get-course-status?courseId=' + courseId + '&sectionId=' + sectionId + '&academicYear=' + academicYear + '&semesterId=' + semesterId,
      type: 'GET',
      success: function(response) {
        const courseStatus = {
          daysOfTheWeek: response.daysOfTheWeek,
          instructionMode: response.instructionMode
        };
        resolve(courseStatus);
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

function getPercentageAttendanceCourseSemester(courseId, sectionId) {
  return new Promise((resolve, reject) => {
    const academicYear = $('#academic-year').val();
    const semesterId = $('#semester').val();
    $.ajax({
      url: '/get-percentage-attendance-course-semester?courseId=' + courseId + '&sectionId=' + sectionId + '&academicYear=' + academicYear + '&semesterId=' + semesterId,
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

function calculateNextDay(currentDay) {
  // currentDay = YYYY-MM-DD
  let year = String(currentDay).substring(0, 4);
  let month = String(currentDay).substring(5, 7);
  let day = String(currentDay).substring(8, 10);
  let isLeapYear = false;
  if (parseInt(year) % 4 === 0) {
    isLeapYear = true;
  }
  if (month === "12" && day === "31") {
    currentDay = `${parseInt(year) + 1}-01-01`;
    return currentDay;
  }
  const conditions = [
    {month: "01", day: "31", nextMonth: "02"},
    {month: "02", day: "28", nextMonth: "03", notLeap: true},
    {month: "02", day: "29", nextMonth: "03"},
    {month: "03", day: "31", nextMonth: "04"},
    {month: "04", day: "30", nextMonth: "05"},
    {month: "05", day: "31", nextMonth: "06"},
    {month: "06", day: "30", nextMonth: "07"},
    {month: "07", day: "31", nextMonth: "08"},
    {month: "08", day: "31", nextMonth: "09"},
    {month: "09", day: "30", nextMonth: "10"},
    {month: "10", day: "31", nextMonth: "11"},
    {month: "11", day: "30", nextMonth: "12"},
  ];
  
  for (const condition of conditions) {
    if (month === condition.month && day === condition.day && (!condition.notLeap || !isLeapYear)) {
      currentDay = `${year}-${condition.nextMonth}-01`;
      return currentDay;
    }
  }
  
  day = parseInt(day) + 1;
  currentDay = `${year}-${month}-${day.toString().padStart(2, '0')}`;
  return currentDay;
}

async function renderCourseSemester(course) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const attendanceContainer = document.getElementById('attendance-container');
  attendanceContainer.innerHTML = '';

  const attendance = document.createElement('div');
  attendance.className = 'attendance';

  const attendanceTitle = document.createElement('h2');
  const percentageAttendanceCourseSemester = await getPercentageAttendanceCourseSemester(course[0], course[1]);
  if (percentageAttendanceCourseSemester == "Online") {
    attendanceTitle.textContent = course[0] + ":";
  } else {
    attendanceTitle.textContent = course[0] + " (" + percentageAttendanceCourseSemester + "%)" + ":";
  }
  attendance.appendChild(attendanceTitle);

  const dayCourseContainer = document.createElement('div');
  dayCourseContainer.className = 'day-course';

  let currentDay = document.getElementById('start-day').value;
  const endDay = document.getElementById('end-day').value;

  const loadingTitle = document.createElement('h4');
  loadingTitle.textContent = 'Loading...';
  dayCourseContainer.appendChild(loadingTitle);
  attendance.appendChild(dayCourseContainer);
  attendanceContainer.appendChild(attendance);

  while(true) {
    let year = currentDay.substring(0, 4);
    let month = currentDay.substring(5, 7);
    let day = currentDay.substring(8, 10).padStart(2, '0');
    let monthIndex = parseInt(currentDay.substring(5, 7), 10);
    let monthName = months[monthIndex - 1];

    const courseStatus = await getCourseStatus(course[0], course[1]);

    const dayOfCourse = document.createElement('div');
    dayOfCourse.className = 'day-of-course';
    const dayOfCourseTitle = document.createElement('h4');

    if (courseStatus.instructionMode == 'Online') { 
      dayOfCourseTitle.textContent = "This is an online class.";
      dayOfCourse.append(dayOfCourseTitle);
      dayCourseContainer.appendChild(dayOfCourse);
      break; 
    } else {
      let formattedDay = new Date(year, month - 1, day);
      let dayOfWeek = daysOfWeek[formattedDay.getDay()];
      if (courseStatus.daysOfTheWeek.includes(dayOfWeek)) {
        const percentageAttendanceDay = await getPercentageAttendanceDay(course[0], course[1], day, monthName, year);
        dayOfCourseTitle.textContent = currentDay + " (" + percentageAttendanceDay + "%)" + ":";
        dayOfCourse.append(dayOfCourseTitle);
        const studentsAttendance = await getStudentsAttendance(course[0], course[1], day, monthName, year);
        studentsAttendance.forEach(student => {
          const studentRow = document.createElement('div');
          studentRow.className = 'row';
          dayOfCourse.append(studentRow);
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
        dayCourseContainer.appendChild(dayOfCourse);
      }
    }
    if (currentDay == endDay) { break; }
    currentDay = calculateNextDay(currentDay);
  }
  dayCourseContainer.removeChild(loadingTitle);

  attendance.appendChild(dayCourseContainer);
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

function handleDownloadClick() {
  console.log(`Download clicked`);
  download_time_by_attendance_per_class();
  //download_time_by_attendance_all_classes();
  //download_time_by_attendance_student_x();
  //download_class_x_by_attendance_student_x();
  //download_class_x_by_attendance_all_students();
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
  const buttonData = document.createElement('button');
  buttonData.innerHTML = "download data";
  buttonData.className = 'download-button';
  buttonData.onclick = () => handleDownloadClick();
  courses.appendChild(buttonData);

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