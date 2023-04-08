

const calendarContainer = document.getElementById('calendar-container');
calendarContainer.innerHTML = '';

let query = "SELECT * FROM Semesters;";
let read = read_query(connection, query);
const now = Date.now();
let selectedAcademicYear, selectedSemester;
for (let i = 0; i < read.length; i++) {
  if (read[i][1] >= now && read[i][2] <= now) {
    selectedAcademicYear = read[i][3];
    selectedSemester = read[i][0];
  }
}

const academicYearDropdown = document.getElementById('academic-year');
query = "SELECT DISTINCT academicYear FROM Semesters;";
read = read_query(connection, query);
for (let i = 0; i < read.length; i++) {
  const option = document.createElement('option');
  option.text = read[i].academicYear;
  academicYearDropdown.add(option);
}

const semesterDropdown = document.getElementById('semester');
query = `SELECT semesterId FROM Semesters WHERE academicYear='${selectedAcademicYear}';`;
read = read_query(connection, query);
for (let i = 0; i < read.length; i++) {
  const option = document.createElement('option');
  option.text = read[i].semesterId;
  semesterDropdown.add(option);
}

academicYearDropdown.value = selectedAcademicYear;
semesterDropdown.value = selectedSemester;
