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


function displayIssues(issues) {
    issuesGrid.innerHTML = '';
    issueCountElement.innerText = issues.length;

    if (!issues || issues.length === 0) {
        issuesGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">No issues found.</p>`;
        return;
    }

    issues.forEach(issue => {
        const status = (issue.status || 'open').toLowerCase();
        const borderClass = status === 'open' ? 'border-t-[#22C55E]' : 'border-t-[#A855F7]';
        const priority = (issue.priority || 'LOW').toUpperCase();
        
        let priorityStyle = "";
        if (priority === 'HIGH') priorityStyle = "text-[#EF4444] bg-[#FEECEC]";
        else if (priority === 'MEDIUM') priorityStyle = "text-[#F59E0B] bg-[#FFF6D1]";
        else priorityStyle = "text-[#9CA3AF] bg-[#EEEFF2]";

        const card = document.createElement('div');
        card.className = `card bg-white shadow-sm border border-[#E4E4E7] border-t-4 ${borderClass} p-5 hover:shadow-md transition-all h-full flex flex-col cursor-pointer rounded-xl`;
        
        card.onclick = () => openIssueModal(issue);

        card.innerHTML = `
            <div class="flex justify-between items-center mb-4">

                <img src="assets/open.png" class="w-6 h-6">
                <span class="px-3 py-1 rounded-full text-[12px] font-medium uppercase ${priorityStyle}">${priority}</span>
            </div>
            <h3 class="text-[14px] font-semibold text-[#1F2937] mb-1 line-clamp-2 leading-tight">${issue.title || 'Untitled Issue'}</h3>
            <p class="text-[12px] font-normal text-[#64748B] mb-4 line-clamp-2">${issue.description || 'No description provided.'}</p>
            <div class="flex items-center gap-[4px] mb-6">
                <div class="flex items-center gap-1 px-3 py-1 bg-[#FEECEC] border border-[#FECACA] rounded-[100px] text-[#EF4444]">
                    <img src="assets/bug.png">
                    <span class="text-[12px] font-medium uppercase">BUG</span>
                </div>
                <div class="flex items-center gap-1 px-3 py-1 bg-[#FFF8DB] border border-[#FDE68A] rounded-[100px] text-[#D97706]">
                    <img src="assets/life.png">
                    <span class="text-[12px] font-medium uppercase">HELP WANTED</span>
                </div>
            </div>
            <div class="mt-auto pt-4 border-t border-[#E4E4E7]">
                <div class="flex flex-col text-[12px] text-[#64748B]">
                    <span class="font-normal text-[#1F2937]">By ${issue.author || 'unknown'}</span>
                    <span class="font-normal">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>
        `;
        issuesGrid.appendChild(card);
    });
}


function filterIssues(status) {
    const tabs = ['all-tab', 'open-tab', 'closed-tab'];
    tabs.forEach(tabId => {
        const tab = document.getElementById(tabId);
        if (tab) tab.classList.remove('tab-active-custom');
    });
    
    const activeTab = document.getElementById(`${status}-tab`);
    if (activeTab) activeTab.classList.add('tab-active-custom');

    if (status === 'all') {
        displayIssues(allIssuesData);
    } else {
        const filtered = allIssuesData.filter(i => (i.status || '').toLowerCase() === status);
        displayIssues(filtered);
    }
}

document.getElementById('search-input').addEventListener('input', async (e) => {
    const searchText = e.target.value.trim().toLowerCase();
    

    if (searchText.length >= 1) { 
        try {
            const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
            const data = await response.json();
            
            const searchResult = Array.isArray(data) ? data : (data.data || []);
            displayIssues(searchResult);
            
        } catch (error) {
            console.error("Search Error:", error);
        }
    } else {
        displayIssues(allIssuesData);
    }
});
