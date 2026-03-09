const isLoggedIn = localStorage.getItem("isLoggedIn");

if(isLoggedIn !== "true"){
window.location.href = "login.html";
}

let allIssuesData = [];
const issuesGrid = document.getElementById('issues-grid');
const loadingSpinner = document.getElementById('loading');
const issueCountElement = document.getElementById('issue-count');


const modal = document.getElementById('issue_detail_modal');
const modalContent = document.getElementById('modal-dynamic-content');
const modalBox = modal?.querySelector('.modal-box');

async function fetchIssues() {
    try {
        loadingSpinner.style.display = 'flex';
        issuesGrid.innerHTML = '';

        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await response.json();

    
        allIssuesData = Array.isArray(data) ? data : (data.data || []);
        
        displayIssues(allIssuesData);
        loadingSpinner.style.display = 'none';
    } catch (error) {
        console.error("Error fetching issues:", error);
        loadingSpinner.innerHTML = `<p class="text-red-500 font-bold py-10 text-center col-span-full">Failed to load data. Please try again.</p>`;
    }
}
