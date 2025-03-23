// Current date object
const today = new Date();

// Grab current month, and year
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

//load saved booking data
//local storage retrieves bookings item which becomes an object with JSON.parse
//const since saved bookings is a reference, won't point towards another object
const savedBookings = JSON.parse(localStorage.getItem("bookings")) || {};

// Function to populate calendar table with dates and a header
function fillCalendar(month, year) {
  // Reference variable for header and body of calendar based on ID in html file
  const calendarHeader = document.getElementById("calendar-header");
  const calendarBody = document.getElementById("calendar-body");

  // Array for month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Clear calendar body
  calendarBody.innerHTML = "";

  // Set the header text
  calendarHeader.innerText = monthNames[month] + " " + year;

  // Get the first day of the month, depends on arguments passed to fillCalendar function
  // new Date(year(int), month (0-11 with 0=January), day (1-31 depending on month and year))
  // getDay() returns date object as a day of the week (sun-sat, 0-6)
  const firstDay = new Date(year, month, 1).getDay();
  // Day 0 gives you last day of previous month (number of days)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  //Calendar date starts at 1
  let calendarDate = 1;

  // Create rows and cells for the dates
  // Each week is a row
  for (let i = 0; i < 6; i++) {
    // Calendars have a max of 6 weeks

    // Make the row
    const row = document.createElement("tr");

    // Each week has a max of 7 days in a week
    for (let j = 0; j < 7; j++) {
      const dateCell = document.createElement("td"); //Create a cell

      //Make empty cells for first row until day of week matches cell
      if (i == 0 && j < firstDay) {
        dateCell.innerText = ""; //date cell becomes empty
        dateCell.classList.add("empty"); // added a class for styling

        // if you click on an empty date (invalid), alert pops up
        dateCell.addEventListener("click", () => {
          alert("This date is empty. Please select a valid date.");
        });
      }

      //Make empty cells for last row when date passes the # of days in the month
      else if (calendarDate > daysInMonth) {
        dateCell.innerText = ""; //date cell is empty
        dateCell.classList.add("empty"); // added a class for styling

        // if you click on an empty date (invalid), alert pops up
        dateCell.addEventListener("click", () => {
          alert("This date is empty. Please select a valid date.");
        });
      }

      // else fill calendar
      else {
        dateCell.innerText = calendarDate;
        dateCell.classList.add("date-cell"); // added a class for styling
    
        // Capture the dateKey correctly
        let selectedDate = calendarDate; // Store current value at event binding
        const dateKey = year + "/" + (month + 1) + "/" + selectedDate;
    
        dateCell.addEventListener("click", () => {
            console.log("Date clicked:", dateKey); // Debugging log
    
            // Check if the date is already booked
            if (savedBookings[dateKey]) {
                const overwrite = confirm(
                    "This date is already booked. Do you want to replace the existing booking?"
                );
                if (!overwrite) {
                    return;
                }
            }
    
            const reason = prompt("Enter the reason for booking this date:");
            if (!reason || reason.trim() === "") {
                alert("Booking reason cannot be empty.");
                return;
            }

            // Update UI
            dateCell.classList.add("booked");
            dateCell.innerHTML = selectedDate + "<br> Booked: " + reason;
    
            // Save booking to localStorage
            savedBookings[dateKey] = { date: dateKey, reason: reason };
            try {
                localStorage.setItem("bookings", JSON.stringify(savedBookings));
            } catch (storageError) {
                console.error("Could not save booking to localStorage:", storageError);
                alert("Warning: Booking could not be saved for future sessions.");
            }
        });
    
        // Restore saved booking data
        if (savedBookings[dateKey]) {
            dateCell.classList.add("booked");
            dateCell.innerHTML =
                selectedDate + "<br> Booked: " + savedBookings[dateKey].reason;
        }
    
        calendarDate++; // Increment at the end
    }
    
      // add cell to row
      row.appendChild(dateCell);
    }

    // add row to calendar body
    calendarBody.appendChild(row);

    // Stop creating rows if all dates are added
    if (calendarDate > daysInMonth) {
      break;
    }
  }
}

// start running functions after page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the calendar with the current month and year
  fillCalendar(currentMonth, currentYear);

  //Change month with arrow button
  document.querySelector("#left-arrow").addEventListener("click", () => {
    currentMonth = (currentMonth - 1 + 12) % 12; // Go back one month
    if (currentMonth == 11) {
      // If going from January -> December
      currentYear -= 1; // go back one year
    }
    fillCalendar(currentMonth, currentYear); // fill calendar again with new dates
  });

  document.querySelector("#right-arrow").addEventListener("click", () => {
    currentMonth = (currentMonth + 1) % 12; // Go forward one month
    if (currentMonth == 0) {
      // If going from January -> December
      currentYear += 1; // go forward one year
    }
    fillCalendar(currentMonth, currentYear); // fill calendar again with new dates
  });
});
