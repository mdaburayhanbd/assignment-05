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
