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
    
    // Count participants
    const participantCount = activity.participants ? activity.participants.length : 1;
    
    // Create participant text
    let participantText = '';
    if (participantCount === 1) {
        participantText = activity.name;
    } else if (participantCount === 2) {
        participantText = `${activity.participants[0]} and ${activity.participants[1]}`;
    } else {
        participantText = `${activity.participants[0]} and ${participantCount - 1} others`;
    }

    activityItem.innerHTML = `
        <div class="activity-content">
            <div class="activity-details">
                <p class="activity-name">${participantText}</p>
                <p class="activity-text">${activity.activity}</p>
                <p class="activity-location"><span>Location:</span> ${activity.location}</p>
                <p class="activity-time">${formatDatetime(activity.datetime)}</p>
            </div>
            <div class="activity-actions">
                <button class="join-button" onclick="joinActivity('${activity.datetime}')">Join</button>
                <button class="delete-button" onclick="deleteActivity('${activity.datetime}')">Delete</button>
            </div>
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
        alert('Please fill in all fields.');
        return;
    }

    // Check if similar activity exists
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    const similarActivity = activities.find(a => 
        a.activity.toLowerCase() === activity.toLowerCase() && 
        a.location.toLowerCase() === location.toLowerCase() && 
        a.datetime === datetime
    );

    if (similarActivity) {
        if (confirm('A similar activity already exists! Would you like to join instead?')) {
            joinActivity(similarActivity.datetime, name);
            event.target.reset();
            return;
        }
    }

    const newActivity = { 
        name, 
        activity, 
        location, 
        datetime,
        participants: [name] // Initialize participants array
    };

    activities.push(newActivity);
    activities.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    localStorage.setItem('activities', JSON.stringify(activities));

    loadActivities();
    event.target.reset();
});

// Function to join an activity
function joinActivity(datetime, newParticipant = null) {
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    const activityIndex = activities.findIndex(a => a.datetime === datetime);
    
    if (activityIndex === -1) return;

    if (!newParticipant) {
        newParticipant = prompt('Please enter your name to join:');
        if (!newParticipant) return;
    }

    // Check if user is already a participant
    if (activities[activityIndex].participants.includes(newParticipant)) {
        alert('You are already participating in this activity!');
        return;
    }

    activities[activityIndex].participants.push(newParticipant);
    localStorage.setItem('activities', JSON.stringify(activities));
    loadActivities();
}

// Function to delete an activity
function deleteActivity(datetime) {
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities = activities.filter(activity => activity.datetime !== datetime);
    localStorage.setItem('activities', JSON.stringify(activities));
    loadActivities(); // Reload the list after deletion
}

// Initial load of activities
loadActivities(); 