let currentPage = 1;
const itemsPerPage = 3;
const courses = [
  { name: 'Web Development', duration: '3 months' },
  { name: 'Data Science', duration: '6 months' },
  { name: 'Graphic Design', duration: '4 months' },
  { name: 'Cybersecurity', duration: '5 months' },
  { name: 'Machine Learning', duration: '6 months' },
  { name: 'Mobile App Development', duration: '4 months' }
];

function displayCourses(page) {
  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;
  const paginatedCourses = courses.slice(startIndex, endIndex);

  paginatedCourses.forEach(course => {
    const courseCard = `
      <div class="course-card">
        <h2>${course.name}</h2>
        <p>Duration: ${course.duration}</p>
      </div>`;
    courseList.innerHTML += courseCard;
  });

  document.getElementById('current-page').textContent = page;
}

function nextPage() {
  if (currentPage * itemsPerPage < courses.length) {
    currentPage++;
    displayCourses(currentPage);
  }
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayCourses(currentPage);
  }
}

function sortCourses() {
  const sortOption = document.getElementById('sort').value;
  if (sortOption === 'name') {
    courses.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'duration') {
    courses.sort((a, b) => a.duration.localeCompare(b.duration));
  }
  displayCourses(currentPage);
}

function filterCourses() {
  const searchQuery = document.getElementById('search').value.toLowerCase();
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery)
  );
  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';
  filteredCourses.forEach(course => {
    const courseCard = `
      <div class="course-card">
        <h2>${course.name}</h2>
        <p>Duration: ${course.duration}</p>
      </div>`;
    courseList.innerHTML += courseCard;
  });
}

displayCourses(currentPage);