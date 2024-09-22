const { ipcRenderer } = require('electron');

function navigateTo(page) {
    console.log(`Navigating to: ${page}`);
    ipcRenderer.send('navigate', page);

    setActiveSidebarItem(page);
}

function setActiveSidebarItem(page) {
    const links = document.querySelectorAll('.sidebar-menu li a');

    links.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.sidebar-menu li a[data-page="${page}"]`);
    console.log(activeLink);  

    if (activeLink) {
        activeLink.classList.add('active'); 
        console.log(`Active link set for ${page}`);
    } else {
        console.log(`No active link found for ${page}`); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentPageId = document.body.id;

    let currentPage;
    if (currentPageId === 'dashboard-page') {
        currentPage = 'dashboard';
    } else if (currentPageId === 'users-page') {
        currentPage = 'users';
    } else if (currentPageId === 'courses-page') {
        currentPage = 'courses';
    }

    if (currentPage) {
        setActiveSidebarItem(currentPage);
    }
});


async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:8000/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            console.error('Failed to fetch users', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function displayUsers(users) {
    const tableBody = document.querySelector('#users-page table tbody');

    if (tableBody) {
        tableBody.innerHTML = ''; 

        users.forEach(user => {
            const row = document.createElement('tr');

            const profileImage = user.profile_image
                ? `http://127.0.0.1:8000/${user.profile_image}`
                : "./assets/defaultpfp.jpg";

            row.innerHTML = `
                <td><img src="${profileImage}" alt="${user.name}'s profile" class="profile-img"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.country ? user.country : 'N/A'}</td>
                <td>${user.city ? user.city : 'N/A'}</td>
                <td>${user.phone_number ? user.phone_number : 'N/A'}</td>
                <td>${user.bio ? user.bio : 'N/A'}</td>
            `;

            tableBody.appendChild(row);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const usersPage = document.querySelector('#users-page');
    if (usersPage) {
        fetchUsers();
    }
});


async function fetchCourses() {
    try {
        const response = await fetch('http://localhost:8000/api/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayCourses(data.courses);
        } else {
            console.error('Failed to fetch courses', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

function displayCourses(courses) {
    const tableBody = document.querySelector('#courses-page table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';

        courses.forEach(course => {
            const row = document.createElement('tr');

            row.innerHTML = `
          <td>${course.name}</td>
          <td>${course.description}</td>
          <td>${course.owner}</td>
          <td>${course.students_count}</td>
          <td>${course.instructors_count}</td>
        `;

            tableBody.appendChild(row);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const coursesPage = document.querySelector('#courses-page');
    if (coursesPage) {
        fetchCourses();
    }
});


async function fetchDashboardStats() {
    try {
        const response = await fetch('http://localhost:8000/api/dashboard-stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayDashboardStats(data);
        } else {
            console.error('Failed to fetch dashboard stats', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }
}

function displayDashboardStats(stats) {
    document.querySelector('#total-users').textContent = stats.total_users;
    document.querySelector('#total-instructors').textContent = stats.total_instructors;
    document.querySelector('#total-students').textContent = stats.total_students;
    document.querySelector('#total-classes').textContent = stats.total_classes;
    document.querySelector('#avg-students-per-class').textContent = stats.avg_students_per_class.toFixed(2);
    document.querySelector('#avg-instructors-per-class').textContent = stats.avg_instructors_per_class.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    const dashboardpage = document.querySelector('#dashboard-page');
    if (dashboardpage) {
        fetchDashboardStats(); 
    }
});
