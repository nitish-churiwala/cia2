let currentPageUs = 1;
let currentPageOther = 1;
const itemsPerPage = 3;
let coursesUs = [];
let coursesOther = [];

// Fetch the courses from the GitHub raw JSON for "Courses Offered by Us"
fetch('https://raw.githubusercontent.com/nitish-churiwala/cia2/main/courseData.json')
  .then(response => response.json())
  .then(data => {
    coursesUs = data; // Assign fetched data to coursesUs array
    displayCourses('us', currentPageUs); // Display the first page of courses offered by us
  })
  .catch(error => console.error('Error fetching courses from us:', error));

// Fetch courses from the Coursera API for "Courses Offered by Other Platforms"
async function fetchOtherPlatformCourses() {
  // Fetching courses from Coursera API
  await fetch('https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b')
    .then(response => response.json())
    .then(data => {
      // Map the API response to fit the existing course structure
      coursesOther = data.results.books.map(course => ({
        title: course.title,
        instructor: course.publisher, // Coursera API doesn't provide instructor name in this endpoint
        duration: 'Varies', // The duration field isn't available in this API endpoint
        price: course.price, // Assume free unless specified otherwise
        enrolled: 'Not Available', // Enrollment data isn't available in this API endpoint
        rating: 'Not Available' // Rating isn't provided by the API directly
      }));

      displayCourses('other', currentPageOther); // Display the first page of courses from other platform
    })
    .catch(error => console.error('Error fetching courses from Coursera API:', error));
}

// Call this function to load the other platform's data
fetchOtherPlatformCourses();

// Function to display courses for either "us" or "other" platform
function displayCourses(type, page) {
  let courseList, courses, currentPageElement;

  if (type === 'us') {
    courseList = document.getElementById('course-list-us');
    courses = coursesUs;
    currentPageElement = document.getElementById('current-page-us');
  } else {
    courseList = document.getElementById('course-list-other');
    courses = coursesOther;
    currentPageElement = document.getElementById('current-page-other');
  }

  courseList.innerHTML = ''; // Clear existing course list before displaying new ones

  // Paginate the courses based on the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;
  const paginatedCourses = courses.slice(startIndex, endIndex);

  // Display each course in the list
  paginatedCourses.forEach(course => {
    const courseCard = `
      <div class="course-card">
        <h2>${course.title}</h2>
        <p>Instructor: ${course.instructor}</p>
        <p>Duration: ${course.duration}</p>
        <p>Price: ${course.price}</p>
        <p>Enrolled: ${course.enrolled}</p>
        <p>Rating: ${course.rating}</p>
      </div>`;
    courseList.innerHTML += courseCard;
  });

  // Update the current page number in the UI
  currentPageElement.textContent = page;
}

// Function to handle the "Next" page button click
function nextPage(type) {
  if (type === 'us') {
    if (currentPageUs * itemsPerPage < coursesUs.length) {
      currentPageUs++;
      displayCourses('us', currentPageUs);
    }
  } else {
    if (currentPageOther * itemsPerPage < coursesOther.length) {
      currentPageOther++;
      displayCourses('other', currentPageOther);
    }
  }
}

// Function to handle the "Previous" page button click
function previousPage(type) {
  if (type === 'us') {
    if (currentPageUs > 1) {
      currentPageUs--;
      displayCourses('us', currentPageUs);
    }
  } else {
    if (currentPageOther > 1) {
      currentPageOther--;
      displayCourses('other', currentPageOther);
    }
  }
}

// Function to sort courses by name or duration
function sortCourses(type) {
  let sortOption, courses;

  if (type === 'us') {
    sortOption = document.getElementById('sort-us').value;
    courses = coursesUs;
  } else {
    sortOption = document.getElementById('sort-other').value;
    courses = coursesOther;
  }

  if (sortOption === 'name') {
    // Sort courses alphabetically by title
    courses.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === 'duration') {
    // Sort courses by duration (not fully applicable for Coursera API)
    courses.sort((a, b) => a.duration.localeCompare(b.duration));
  }

  displayCourses(type, 1); // Refresh the course list on the first page
}

// Function to filter courses based on a search query
function filterCourses(type) {
  let searchQuery, filteredCourses, courseList;

  if (type === 'us') {
    searchQuery = document.getElementById('search-us').value.toLowerCase();
    filteredCourses = coursesUs.filter(course =>
      course.title.toLowerCase().includes(searchQuery)
    );
    courseList = document.getElementById('course-list-us');
  } else {
    searchQuery = document.getElementById('search-other').value.toLowerCase();
    filteredCourses = coursesOther.filter(course =>
      course.title.toLowerCase().includes(searchQuery)
    );
    courseList = document.getElementById('course-list-other');
  }

  // Clear existing course list and display filtered courses
  courseList.innerHTML = '';

  filteredCourses.forEach(course => {
    const courseCard = `
      <div class="course-card">
        <h2>${course.title}</h2>
        <p>Instructor: ${course.instructor}</p>
        <p>Duration: ${course.duration}</p>
        <p>Price: ${course.price}</p>
        <p>Enrolled: ${course.enrolled}</p>
        <p>Rating: ${course.rating}</p>
      </div>`;
    courseList.innerHTML += courseCard;
  });
}
