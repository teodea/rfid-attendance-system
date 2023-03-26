function renderCalendar() {
    const year = document.getElementById('year').value;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const calendar = document.getElementById('calendar-container');
    calendar.innerHTML = '';
    for (let i=0; i<monthNames.length; i++) {
        let numberOfDaysInMonth = new Date(year, i+1, 0).getDate();
        let firstDayOfTheWeek = new Date(year, i, 1).getDay();
        let monthName = monthNames[i];

        let monthDiv = document.createElement('div');
        monthDiv.classList.add('calendar-month');

        let monthHeaderDiv = document.createElement('div');
        monthHeaderDiv.classList.add('calendar-month-header');
        let monthHeader = document.createElement('h3');
        monthHeader.textContent = monthName;
        monthHeaderDiv.appendChild(monthHeader);
        monthDiv.appendChild(monthHeaderDiv);

        for (let j=0; j<daysOfWeek.length; j++) {
            let dayOfWeekHeaderDiv = document.createElement('div');
            dayOfWeekHeaderDiv.classList.add('calendar-dayOfWeek-header');
            let dayOfWeekHeader = document.createElement('h5');
            dayOfWeekHeader.textContent = daysOfWeek[j]
            dayOfWeekHeaderDiv.appendChild(dayOfWeekHeader)
            monthDiv.appendChild(dayOfWeekHeaderDiv);
        }

        for (let j=0; j<firstDayOfTheWeek; j++) {
            let emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day');
            monthDiv.appendChild(emptyDay);
        }

        for (let j=0; j<numberOfDaysInMonth; j++) {
            let dayNumber = document.createElement('p');
            dayNumber.classList.add('calendar-day');
            dayNumber.textContent = j+1;
            monthDiv.appendChild(dayNumber);
        }

        calendar.appendChild(monthDiv);
    }
}