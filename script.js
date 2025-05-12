import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy 
} from "firebase/firestore";

const activityForm = document.getElementById('activity-form');
const activityList = document.getElementById('activity-list');
const noActivitiesMessage = document.getElementById('no-activities');

// Function to load activities from Firestore
async function loadActivities() {
    try {
        const activitiesQuery = query(collection(db, "activities"), orderBy("datetime"));
        const querySnapshot = await getDocs(activitiesQuery);
        const activities = [];
        
        querySnapshot.forEach((doc) => {
            activities.push({ id: doc.id, ...doc.data() });
        });

        activityList.innerHTML = '';
        
        if (activities.length === 0) {
            noActivitiesMessage.style.display = 'block';
        } else {
            noActivitiesMessage.style.display = 'none';
            activities.forEach(activity => addActivityToList(activity));
        }
    } catch (error) {
        console.error('Error loading activities:', error);
        alert('Failed to load activities. Please try again later.');
    }
}

// Function to add activity to the list
function addActivityToList(activity) {
    const activityItem = document.createElement('div');
    activityItem.classList.add('activity-item');
    
    const participantCount = activity.participants ? activity.participants.length : 1;
    
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
                <button class="join-button" onclick="joinActivity('${activity.id}')">Join</button>
                <button class="delete-button" onclick="deleteActivity('${activity.id}')">Delete</button>
            </div>
        </div>
    `;
    activityList.appendChild(activityItem);
}

// Function to handle form submission
activityForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const activity = event.target.activity.value;
    const location = event.target.location.value;
    const datetime = event.target.datetime.value;

    if (!name || !activity || !datetime) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        // Check if similar activity exists
        const activitiesQuery = query(collection(db, "activities"));
        const querySnapshot = await getDocs(activitiesQuery);
        const activities = [];
        querySnapshot.forEach((doc) => {
            activities.push({ id: doc.id, ...doc.data() });
        });

        const similarActivity = activities.find(a => 
            a.activity.toLowerCase() === activity.toLowerCase() && 
            a.location.toLowerCase() === location.toLowerCase() && 
            a.datetime === datetime
        );

        if (similarActivity) {
            if (confirm('A similar activity already exists! Would you like to join instead?')) {
                joinActivity(similarActivity.id, name);
                event.target.reset();
                return;
            }
        }

        const newActivity = { 
            name, 
            activity, 
            location, 
            datetime,
            participants: [name]
        };

        await addDoc(collection(db, "activities"), newActivity);
        loadActivities();
        event.target.reset();
    } catch (error) {
        console.error('Error adding activity:', error);
        alert('Failed to add activity. Please try again later.');
    }
});

// Function to join an activity
async function joinActivity(activityId, newParticipant = null) {
    try {
        if (!newParticipant) {
            newParticipant = prompt('Please enter your name to join:');
            if (!newParticipant) return;
        }

        const activityRef = doc(db, "activities", activityId);
        const activityDoc = await getDoc(activityRef);
        const activity = activityDoc.data();

        if (activity.participants.includes(newParticipant)) {
            alert('You are already participating in this activity!');
            return;
        }

        activity.participants.push(newParticipant);

        await updateDoc(activityRef, {
            participants: activity.participants
        });

        loadActivities();
    } catch (error) {
        console.error('Error joining activity:', error);
        alert('Failed to join activity. Please try again later.');
    }
}

// Function to delete an activity
async function deleteActivity(activityId) {
    try {
        await deleteDoc(doc(db, "activities", activityId));
        loadActivities();
    } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity. Please try again later.');
    }
}

// Function to format datetime
function formatDatetime(datetimeString) {
    const date = new Date(datetimeString);
    return date.toLocaleString(); // Adjust as needed for desired format
}

// Make functions available globally for onclick handlers
window.joinActivity = joinActivity;
window.deleteActivity = deleteActivity;

// Initial load of activities
loadActivities(); 