const activityForm = document.getElementById('activity-form');
const activityList = document.getElementById('activity-list');
const noActivitiesMessage = document.getElementById('no-activities');

// Function to load activities from localStorage
function loadActivities() {
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.sort((a, b) => new Date(a.datetime) - new Date(b.datetime)); // Sort by date
    activityList.innerHTML = ''; // Clear existing list
    if (activities.length === 0) {
        noActivitiesMessage.style.display = 'block';
    } else {
        noActivitiesMessage.style.display = 'none';
        activities.forEach(activity => addActivityToList(activity));
    }
}

// Function to add activity to the list
function addActivityToList(activity) {
    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');
    activityItem.innerHTML = `
        <div class="activity-content">
            <div class="activity-details">
                <p class="activity-name">${activity.name}</p>
                <p class="activity-text">${activity.activity}</p>
                <p class="activity-location"><span>Location:</span> ${activity.location}</p>
                <p class="activity-time">${formatDatetime(activity.datetime)}</p>
            </div>
            <button class="delete-button" onclick="deleteActivity('${activity.datetime}')">Delete</button>
        </div>
    `;
    activityList.appendChild(activityItem);
}

// Function to format datetime
function formatDatetime(datetimeString) {
    const date = new Date(datetimeString);
    return date.toLocaleString(); // Adjust as needed for desired format
}

// Function to handle form submission
activityForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const activity = event.target.activity.value;
    const location = event.target.location.value;
    const datetime = event.target.datetime.value;

    if (!name || !activity || !datetime) {
        alert('Please fill in all fields.'); // Basic validation
        return;
    }

    const newActivity = { name, activity, location, datetime };

    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.push(newActivity);
    activities.sort((a, b) => new Date(a.datetime) - new Date(b.datetime)); // Keep sorted
    localStorage.setItem('activities', JSON.stringify(activities));

    loadActivities(); // Reload and refresh the list

    event.target.reset(); // Clear the form
});

// Function to delete an activity
function deleteActivity(datetime) {
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities = activities.filter(activity => activity.datetime !== datetime);
    localStorage.setItem('activities', JSON.stringify(activities));
    loadActivities(); // Reload the list after deletion
}

// Initial load of activities
loadActivities(); 