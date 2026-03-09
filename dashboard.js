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

function openIssueModal(issue) {
    if (!modal) return;
    
    const status = (issue.status || 'open').toLowerCase();
    const statusBg = status === 'open' ? 'bg-[#00B86B]' : 'bg-[#8B5CF6]';
    const priority = (issue.priority || 'LOW').toUpperCase();

    modalBox.style.width = '700px';
    modalBox.style.height = '414px';
    modalBox.style.maxWidth = 'none';
    modalBox.className = `modal-box p-8 bg-white rounded-2xl shadow-2xl relative overflow-hidden flex flex-col border-none`;

    modalContent.innerHTML = `
        <h2 class="text-[24px] font-bold text-[#1F2937] leading-tight mb-2">${issue.title}</h2>

        <div class="flex items-center gap-2 text-[14px] text-[#64748B] mb-4">
            <span class="px-3 py-0.5 rounded-full text-white font-medium text-[12px] ${statusBg}">
                ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span class="flex items-center gap-1.5">
                <span class="w-1 h-1 bg-[#CBD5E1] rounded-full"></span>
                Opened by <span class="font-medium text-[#1F2937]">${issue.author}</span>
                <span class="w-1 h-1 bg-[#CBD5E1] rounded-full"></span>
                ${new Date(issue.createdAt).toLocaleDateString('en-GB')}
            </span>
        </div>

        <div class="flex items-center gap-2 mb-6">
            <div class="flex items-center gap-1.5 px-3 py-1 bg-[#FEECEC] border border-[#FECACA] rounded-full text-[#EF4444] font-bold text-[11px]">
                <div class="w-2 h-2 rounded-full"></div>
                BUG
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1 bg-[#FFF8DB] border border-[#FDE68A] rounded-full text-[#D97706] font-bold text-[11px]">
                <div class="w-2 h-2 rounded-full"></div>
                HELP WANTED
            </div>
        </div>

        <div class="mb-6 text-[15px] text-[#64748B] leading-[1.5] font-normal line-clamp-3">
            <p>${issue.description}</p>
        </div>

        <div class="grid grid-cols-2 gap-4 p-5 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] mb-6">
            <div>
                <h4 class="text-[13px] text-[#64748B] font-medium mb-1">Assignee:</h4>
                <p class="text-[16px] font-bold text-[#1F2937]">${issue.author}</p>
            </div>
            <div>
                <h4 class="text-[13px] text-[#64748B] font-medium mb-1">Priority:</h4>
                <span class="inline-block px-3 py-1 bg-[#EF4444] text-white rounded-full text-[11px] font-bold uppercase">${priority}</span>
            </div>
        </div>

        <div class="flex justify-end mt-auto">
            <form method="dialog">
                <button class="px-8 py-2.5 bg-[#4A00FF] text-white rounded-lg font-bold text-[14px] hover:bg-[#3B00CC] transition-colors">Close</button>
            </form>
        </div>
    `;

    modal.showModal();
}

fetchIssues();