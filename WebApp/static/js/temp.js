import mysql from 'mysql';

function create_db_connection(host_name, user_name, user_password, db_name) {
  const connection = mysql.createConnection({
    host: host_name,
    user: user_name,
    password: user_password,
    database: db_name
  });
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      return;
    }
    console.log("MySQL Database connection successful");
  });
  return connection;
}

function execute_query(connection, query) {
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return;
    }
    console.log("Query successful");
  });
}

function read_query(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.error("Error reading from database: " + error.stack);
        reject(error);
      } else {
        console.log("Read query successful");
        resolve(results);
      }
    });
  });
}



const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

for (let month = 0; month < 12; month++) {
const calendar = document.createElement('div');
calendar.className = 'calendar';
const monthTitle = document.createElement('h2');
monthTitle.textContent = `${months[month]} ${selectedYear}`;
monthTitle.onclick = function () {
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
    if (day === new Date().getDate() && month === new Date().getMonth() && selectedYear === new Date().getFullYear()) {
    calendarDay.classList.add('today');
    }
    calendarDay.textContent = day;
    calendarDay.onclick = function() {
    console.log(`Day clicked: ${day} ${months[month]} ${selectedYear}`);
    };
    calendarGrid.appendChild(calendarDay);
}
calendar.appendChild(calendarGrid);
calendarContainer.appendChild(calendar);
  }