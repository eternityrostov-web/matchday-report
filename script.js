// FIFA World Cup 2026 Matchday Report Application
class MatchdayApp {
    constructor() {
        this.reports = JSON.parse(localStorage.getItem('fifa-reports') || '[]');
        this.functionalAreas = [
            { code: 'ACS', name: 'Access Control System' },
            { code: 'BRO', name: 'Broadcast' },
            { code: 'CAT', name: 'Catering' },
            { code: 'CER', name: 'Ceremonies' },
            { code: 'CLW', name: 'Cleaning/Waste' },
            { code: 'CPM', name: 'Competition Management' },
            { code: 'DOP', name: 'Doping Control' },
            { code: 'FTI', name: 'Field Technical Infrastructure' },
            { code: 'GMT', name: 'Ground Maintenance Team' },
            { code: 'HOS', name: 'Hospitality' },
            { code: 'INF', name: 'Information' },
            { code: 'ITT', name: 'IT & Telecommunications' },
            { code: 'LAN', name: 'Language Services' },
            { code: 'LOG', name: 'Logistics' },
            { code: 'MED', name: 'Medical' },
            { code: 'MEO', name: 'Media Operations' },
            { code: 'MRD', name: 'Marketing & Rights Delivery' },
            { code: 'OVL', name: 'Overlay' },
            { code: 'PIT', name: 'Protocol & International Transport' },
            { code: 'PLI', name: 'Players Liaison' },
            { code: 'REF', name: 'Referee Services' },
            { code: 'SEC', name: 'Security' },
            { code: 'SGN', name: 'Signage' },
            { code: 'SPS', name: 'Spectator Services' },
            { code: 'STM', name: 'Stadium Management' },
            { code: 'SUS', name: 'Sustainability' },
            { code: 'TCS', name: 'Team Services' },
            { code: 'TKT', name: 'Ticketing' },
            { code: 'MOB', name: 'Mobility' },
            { code: 'TSV', name: 'Team Services (Visiting)' },
            { code: 'VUM', name: 'Venue Management' },
            { code: 'WKF', name: 'Workforce' },
            { code: 'HSE', name: 'Health, Safety & Environment' },
            { code: 'F&B', name: 'Food & Beverage' },
            { code: 'SFM', name: 'Stadium Facility Management' }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderFunctionalAreas();
        this.updateStats();
        this.renderReports();
        this.setCurrentDateTime();
        this.setupDRSToggle();
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                this.showTab(targetTab);
            });
        });

        // Form submission
        const form = document.getElementById('report-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Search and filter
        const searchInput = document.getElementById('search-reports');
        const filterSelect = document.getElementById('filter-status');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterReports());
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.filterReports());
        }
    }

    showTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Update content if needed
        if (tabName === 'reports') {
            this.renderReports();
        } else if (tabName === 'statistics') {
            this.renderStatistics();
        }
    }

    setCurrentDateTime() {
        const now = new Date();
        const dateInput = document.querySelector('input[name="date"]');
        const timeInput = document.querySelector('input[name="time"]');
        
        if (dateInput) {
            dateInput.value = now.toISOString().split('T')[0];
        }
        
        if (timeInput) {
            timeInput.value = now.toTimeString().split(' ')[0].slice(0, 5);
        }
    }

    setupDRSToggle() {
        const drsToggle = document.querySelector('input[name="drsCompliant"]');
        const drsComment = document.querySelector('.drs-comment');
        
        if (drsToggle && drsComment) {
            drsToggle.addEventListener('change', () => {
                drsComment.style.display = drsToggle.checked ? 'none' : 'block';
            });
        }
    }

    renderFunctionalAreas() {
        const container = document.getElementById('functional-areas');
        if (!container) return;

        container.innerHTML = this.functionalAreas.map(area => `
            <div class="functional-area" data-code="${area.code}">
                <div class="area-info">
                    <div class="area-name">${area.name}</div>
                    <div class="area-code">${area.code}</div>
                </div>
                <div class="area-controls">
                    <div class="status-toggle">
                        <button type="button" class="status-btn ok active" onclick="app.setAreaStatus('${area.code}', 'OK')">
                            OK
                        </button>
                        <button type="button" class="status-btn issue" onclick="app.setAreaStatus('${area.code}', 'ISSUE')">
                            ISSUE
                        </button>
                    </div>
                    <input type="text" placeholder="Comment (if issue)" class="area-comment" style="display: none;" />
                </div>
            </div>
        `).join('');
    }

    setAreaStatus(code, status) {
        const area = document.querySelector(`[data-code="${code}"]`);
        const okBtn = area.querySelector('.status-btn.ok');
        const issueBtn = area.querySelector('.status-btn.issue');
        const comment = area.querySelector('.area-comment');

        // Reset buttons
        okBtn.classList.remove('active');
        issueBtn.classList.remove('active');

        // Set active button
        if (status === 'OK') {
            okBtn.classList.add('active');
            comment.style.display = 'none';
            comment.value = '';
            area.classList.remove('issue');
        } else {
            issueBtn.classList.add('active');
            comment.style.display = 'block';
            area.classList.add('issue');
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const report = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            matchInfo: {
                matchNumber: formData.get('matchNumber'),
                date: formData.get('date'),
                time: formData.get('time'),
                tournament: formData.get('tournament'),
                stadium: formData.get('stadium'),
                homeTeam: formData.get('homeTeam'),
                awayTeam: formData.get('awayTeam'),
                finalScore: formData.get('finalScore'),
                venueManagerName: formData.get('venueManagerName')
            },
            clientGroups: {
                spectators: parseInt(formData.get('spectators')) || 0,
                vipGuests: parseInt(formData.get('vipGuests')) || 0,
                vvipGuests: parseInt(formData.get('vvipGuests')) || 0,
                mediaRepresentatives: parseInt(formData.get('mediaRepresentatives')) || 0,
                photographers: parseInt(formData.get('photographers')) || 0
            },
            generalIssues: formData.get('generalIssues') || '',
            functionalAreas: this.getFunctionalAreasStatus(),
            drsCompliance: {
                isCompliant: formData.get('drsCompliant') === 'on',
                comment: formData.get('drsComment') || ''
            },
            additionalComments: formData.get('additionalComments') || ''
        };

        // Validate required fields
        if (!report.matchInfo.matchNumber || !report.matchInfo.finalScore || !report.matchInfo.venueManagerName) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        this.reports.push(report);
        this.saveReports();
        this.updateStats();
        
        this.showNotification('Report created successfully!', 'success');
        
        // Reset form
        e.target.reset();
        this.renderFunctionalAreas();
        this.setCurrentDateTime();
        
        // Show reports tab
        setTimeout(() => {
            this.showTab('reports');
        }, 1500);
    }

    getFunctionalAreasStatus() {
        const areas = [];
        document.querySelectorAll('.functional-area').forEach(area => {
            const code = area.dataset.code;
            const isOk = area.querySelector('.status-btn.ok').classList.contains('active');
            const comment = area.querySelector('.area-comment').value;
            
            areas.push({
                code,
                name: this.functionalAreas.find(a => a.code === code).name,
                status: isOk ? 'OK' : 'ISSUE',
                comment: comment || ''
            });
        });
        return areas;
    }

    updateStats() {
        const totalReports = this.reports.length;
        const problemReports = this.reports.filter(report => 
            report.functionalAreas.some(area => area.status === 'ISSUE') || 
            !report.drsCompliance.isCompliant
        ).length;
        
        const today = new Date().toISOString().split('T')[0];
        const todayReports = this.reports.filter(report => 
            report.createdAt.split('T')[0] === today
        ).length;
        
        const completedReports = this.reports.filter(report => 
            report.functionalAreas.every(area => area.status === 'OK') && 
            report.drsCompliance.isCompliant
        ).length;

        // Update dashboard stats
        document.getElementById('total-reports').textContent = totalReports;
        document.getElementById('problem-reports').textContent = problemReports;
        document.getElementById('today-reports').textContent = todayReports;
        document.getElementById('completed-reports').textContent = completedReports;

        // Show/hide recent section
        const recentSection = document.getElementById('recent-section');
        if (totalReports > 0) {
            recentSection.style.display = 'block';
            this.renderRecentReports();
        } else {
            recentSection.style.display = 'none';
        }
    }

    renderRecentReports() {
        const recentList = document.getElementById('recent-list');
        const recentReports = this.reports.slice(-3).reverse();
        
        recentList.innerHTML = recentReports.map(report => `
            <div class="report-item" onclick="app.showReportDetails('${report.id}')">
                <div class="report-info">
                    <div class="report-title">Match #${report.matchInfo.matchNumber}</div>
                    <div class="report-match">${report.matchInfo.homeTeam || 'TBD'} vs ${report.matchInfo.awayTeam || 'TBD'}</div>
                    <div class="report-date">${new Date(report.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }

    renderReports() {
        const reportsList = document.getElementById('reports-list');
        if (!reportsList) return;

        if (this.reports.length === 0) {
            reportsList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <span class="material-icons" style="font-size: 64px; margin-bottom: 1rem;">description</span>
                    <h3>No Reports Yet</h3>
                    <p>Create your first match report to get started</p>
                    <button onclick="app.showTab('create')" class="action-btn primary" style="margin-top: 1rem; display: inline-flex;">
                        Create Report
                    </button>
                </div>
            `;
            return;
        }

        reportsList.innerHTML = this.reports.map(report => {
            const hasIssues = report.functionalAreas.some(area => area.status === 'ISSUE') || !report.drsCompliance.isCompliant;
            const statusClass = hasIssues ? 'issues' : 'completed';
            const statusText = hasIssues ? 'Has Issues' : 'Completed';

            return `
                <div class="report-item ${hasIssues ? 'has-issues' : ''}" onclick="app.showReportDetails('${report.id}')">
                    <div class="report-header">
                        <div>
                            <div class="report-title">Match #${report.matchInfo.matchNumber}</div>
                            <div class="report-match">${report.matchInfo.homeTeam || 'TBD'} vs ${report.matchInfo.awayTeam || 'TBD'}</div>
                            <div class="report-date">${new Date(report.createdAt).toLocaleDateString('en-US')}</div>
                        </div>
                        <span class="report-status ${statusClass}">${statusText}</span>
                    </div>
                    <div style="color: #666; font-size: 14px;">
                        ${report.matchInfo.tournament || 'Tournament TBD'} • ${report.matchInfo.stadium || 'Stadium TBD'}
                    </div>
                </div>
            `;
        }).join('');
    }

    filterReports() {
        const searchTerm = document.getElementById('search-reports').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        
        const filteredReports = this.reports.filter(report => {
            const matchesSearch = 
                report.matchInfo.matchNumber.toLowerCase().includes(searchTerm) ||
                (report.matchInfo.homeTeam || '').toLowerCase().includes(searchTerm) ||
                (report.matchInfo.awayTeam || '').toLowerCase().includes(searchTerm) ||
                (report.matchInfo.tournament || '').toLowerCase().includes(searchTerm);
            
            if (!matchesSearch) return false;
            
            if (statusFilter === 'completed') {
                return report.functionalAreas.every(area => area.status === 'OK') && report.drsCompliance.isCompliant;
            }
            
            if (statusFilter === 'issues') {
                return report.functionalAreas.some(area => area.status === 'ISSUE') || !report.drsCompliance.isCompliant;
            }
            
            return true;
        });

        // Render filtered reports
        const reportsList = document.getElementById('reports-list');
        reportsList.innerHTML = filteredReports.map(report => {
            const hasIssues = report.functionalAreas.some(area => area.status === 'ISSUE') || !report.drsCompliance.isCompliant;
            const statusClass = hasIssues ? 'issues' : 'completed';
            const statusText = hasIssues ? 'Has Issues' : 'Completed';

            return `
                <div class="report-item ${hasIssues ? 'has-issues' : ''}" onclick="app.showReportDetails('${report.id}')">
                    <div class="report-header">
                        <div>
                            <div class="report-title">Match #${report.matchInfo.matchNumber}</div>
                            <div class="report-match">${report.matchInfo.homeTeam || 'TBD'} vs ${report.matchInfo.awayTeam || 'TBD'}</div>
                            <div class="report-date">${new Date(report.createdAt).toLocaleDateString('en-US')}</div>
                        </div>
                        <span class="report-status ${statusClass}">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    showReportDetails(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        const modal = document.getElementById('report-modal');
        const modalBody = document.getElementById('modal-body');
        
        const hasIssues = report.functionalAreas.some(area => area.status === 'ISSUE') || !report.drsCompliance.isCompliant;
        const issueAreas = report.functionalAreas.filter(area => area.status === 'ISSUE');

        modalBody.innerHTML = `
            <div class="report-details">
                <div class="detail-section">
                    <h4>Match Information</h4>
                    <div class="detail-grid">
                        <div><strong>Match Number:</strong> ${report.matchInfo.matchNumber}</div>
                        <div><strong>Date:</strong> ${report.matchInfo.date}</div>
                        <div><strong>Time:</strong> ${report.matchInfo.time}</div>
                        <div><strong>Tournament:</strong> ${report.matchInfo.tournament || 'Not specified'}</div>
                        <div><strong>Stadium:</strong> ${report.matchInfo.stadium || 'Not specified'}</div>
                        <div><strong>Teams:</strong> ${report.matchInfo.homeTeam || 'TBD'} vs ${report.matchInfo.awayTeam || 'TBD'}</div>
                        <div><strong>Final Score:</strong> ${report.matchInfo.finalScore}</div>
                        <div><strong>Venue Manager:</strong> ${report.matchInfo.venueManagerName}</div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Client Groups</h4>
                    <div class="detail-grid">
                        <div><strong>Spectators:</strong> ${report.clientGroups.spectators}</div>
                        <div><strong>VIP Guests:</strong> ${report.clientGroups.vipGuests}</div>
                        <div><strong>VVIP Guests:</strong> ${report.clientGroups.vvipGuests}</div>
                        <div><strong>Media:</strong> ${report.clientGroups.mediaRepresentatives}</div>
                        <div><strong>Photographers:</strong> ${report.clientGroups.photographers}</div>
                    </div>
                </div>

                ${issueAreas.length > 0 ? `
                    <div class="detail-section">
                        <h4 style="color: #FF6B6B;">Areas with Issues</h4>
                        ${issueAreas.map(area => `
                            <div class="issue-item">
                                <strong>${area.name} (${area.code})</strong>
                                ${area.comment ? `<p>${area.comment}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${!report.drsCompliance.isCompliant ? `
                    <div class="detail-section">
                        <h4 style="color: #FF6B6B;">DRS Compliance Issue</h4>
                        <p>${report.drsCompliance.comment}</p>
                    </div>
                ` : ''}

                ${report.generalIssues ? `
                    <div class="detail-section">
                        <h4>General Comments</h4>
                        <p>${report.generalIssues}</p>
                    </div>
                ` : ''}

                ${report.additionalComments ? `
                    <div class="detail-section">
                        <h4>Additional Comments</h4>
                        <p>${report.additionalComments}</p>
                    </div>
                ` : ''}

                <div class="detail-section">
                    <h4>Report Status</h4>
                    <div class="status-badge ${hasIssues ? 'issues' : 'completed'}">
                        ${hasIssues ? '⚠️ Has Issues' : '✅ All Good'}
                    </div>
                    <div style="margin-top: 1rem; color: #666; font-size: 14px;">
                        Created: ${new Date(report.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>

            <style>
                .detail-section { margin-bottom: 2rem; }
                .detail-section h4 { margin-bottom: 1rem; color: #333; }
                .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem; }
                .issue-item { background: #FFF5F5; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; border-left: 4px solid #FF6B6B; }
                .status-badge { padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: 500; }
                .status-badge.completed { background: #E8F5E8; color: #4CAF50; }
                .status-badge.issues { background: #FFE8E8; color: #FF6B6B; }
            </style>
        `;
        
        modal.style.display = 'block';
    }

    renderStatistics() {
        const detailedStats = document.getElementById('detailed-stats');
        if (!detailedStats) return;

        const totalReports = this.reports.length;
        const completedReports = this.reports.filter(report => 
            report.functionalAreas.every(area => area.status === 'OK') && 
            report.drsCompliance.isCompliant
        ).length;
        
        const issueReports = totalReports - completedReports;
        
        // Count issues by functional area
        const areaIssues = {};
        this.reports.forEach(report => {
            report.functionalAreas.forEach(area => {
                if (area.status === 'ISSUE') {
                    areaIssues[area.code] = (areaIssues[area.code] || 0) + 1;
                }
            });
        });

        const topIssues = Object.entries(areaIssues)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        detailedStats.innerHTML = `
            <div class="stats-summary">
                <div class="stat-item">
                    <h4>Completion Rate</h4>
                    <div class="stat-value">${totalReports ? Math.round(completedReports / totalReports * 100) : 0}%</div>
                </div>
                <div class="stat-item">
                    <h4>Total Reports</h4>
                    <div class="stat-value">${totalReports}</div>
                </div>
                <div class="stat-item">
                    <h4>Issue Rate</h4>
                    <div class="stat-value">${totalReports ? Math.round(issueReports / totalReports * 100) : 0}%</div>
                </div>
            </div>
            
            ${topIssues.length > 0 ? `
                <div class="top-issues">
                    <h4>Most Common Issues</h4>
                    ${topIssues.map(([code, count]) => {
                        const area = this.functionalAreas.find(a => a.code === code);
                        return `
                            <div class="issue-stat">
                                <span class="issue-name">${area ? area.name : code}</span>
                                <span class="issue-count">${count} reports</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}

            <style>
                .stats-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
                .stat-item { background: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .stat-value { font-size: 2rem; font-weight: bold; color: #007AFF; margin-top: 0.5rem; }
                .top-issues { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .issue-stat { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
                .issue-stat:last-child { border-bottom: none; }
                .issue-count { color: #FF6B6B; font-weight: 500; }
            </style>
        `;
    }

    saveReports() {
        localStorage.setItem('fifa-reports', JSON.stringify(this.reports));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#FF6B6B' : '#007AFF'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app when page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MatchdayApp();
});

// Global functions for onclick handlers
function showTab(tabName) {
    app.showTab(tabName);
}

function closeModal() {
    document.getElementById('report-modal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('report-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);