// ACT Performance Evaluation System - Complete App.js
// 360-Degree Evaluation System with Bilingual Support

// Sample users data - In production, this would come from a database
const sampleUsers = [
    {
        id: 'EMP001',
        username: 'john.doe',
        password: 'password123',
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'employee',
        department: 'IT',
        managerId: 'MGR001',
    supervisorId: 'SUP001'
    },
    {
        id: 'EMP002',
        username: 'jane.smith',
        password: 'password123',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        role: 'employee',
        department: 'Marketing',
        managerId: 'MGR001',
    supervisorId: 'SUP001'
    },
    {
        id: 'EMP003',
        username: 'mike.johnson',
        password: 'password123',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        role: 'employee',
        department: 'Finance',
        managerId: 'MGR001',
    supervisorId: 'SUP001'
    },
    {
        id: 'SUP001',
        username: 'alice.wilson',
        password: 'password123',
        name: 'Alice Wilson',
        email: 'alice.wilson@company.com',
        role: 'supervisor',
        department: 'IT',
        managerId: 'MGR001',
        supervisorId: null
    },
    {
        id: 'SUP002',
        username: 'bob.brown',
        password: 'password123',
        name: 'Bob Brown',
        email: 'bob.brown@company.com',
        role: 'supervisor',
        department: 'Marketing',
        managerId: 'MGR001',
        supervisorId: null
    },
   
    {
        id: 'MGR001',
        username: 'sarah.davis',
        password: 'password123',
        name: 'Sarah Davis',
        email: 'sarah.davis@company.com',
        role: 'manager',
        department: 'Executive',
        managerId: null,
        supervisorId: 'SUP001'
    },
    {
        id: 'HR001',
        username: 'hr.admin',
        password: 'password123',
        name: 'HR Administrator',
        email: 'hr@company.com',
        role: 'hr',
        department: 'Human Resources',
        managerId: null,
        supervisorId: null
    }
];

// Global error handlers to catch runtime errors and unhandled promise rejections
window.addEventListener('error', function (evt) {
    try {
        console.error('Global error:', evt);
            // Avoid showing toasts for generic 'Script error.' or when served via file:// (browser hides details)
            var isFileProtocol = (typeof location !== 'undefined' && location.protocol === 'file:');
            var msg = evt && evt.message ? String(evt.message) : '';
            if (!isFileProtocol && msg && msg !== 'Script error.') {
                setTimeout(function() {
                    if (typeof showToast === 'function') showToast('An unexpected error occurred: ' + msg, 'danger');
                }, 0);
            }
    } catch (e) {
        // swallow
    }
});

window.addEventListener('unhandledrejection', function (evt) {
    try {
        console.error('Unhandled promise rejection:', evt.reason);
        setTimeout(function() {
            if (typeof showToast === 'function') showToast('An unexpected error occurred (promise): ' + (evt.reason && evt.reason.message ? evt.reason.message : String(evt.reason)), 'danger');
        }, 0);
    } catch (e) {}
});

// Bilingual Questions
window.questions = window.questions || [
    {
        en: "How effectively do you communicate with your team members and colleagues?",
        ar: "ما مدى فعاليتك في التواصل مع أعضاء فريقك وزملائك؟"
    },
    {
        en: "How well do you manage your time and prioritize tasks?",
        ar: "ما مدى جودة إدارتك للوقت وترتيب الأولويات؟"
    },
    {
        en: "How successfully do you adapt to changes in the workplace?",
        ar: "ما مدى نجاحك في التكيف مع التغييرات في مكان العمل؟"
    },
    {
        en: "How effectively do you collaborate with others on team projects?",
        ar: "ما مدى فعاليتك في التعاون مع الآخرين في المشاريع الجماعية؟"
    },
    {
        en: "How well do you demonstrate leadership qualities in your role?",
        ar: "ما مدى جودة إظهارك لصفات القيادة في دورك؟"
    },
    {
        en: "How effectively do you solve problems and make decisions?",
        ar: "ما مدى فعاليتك في حل المشكلات واتخاذ القرارات؟"
    },
    {
        en: "How well do you contribute to achieving organizational goals?",
        ar: "ما مدى جودة مساهمتك في تحقيق الأهداف التنظيمية؟"
    },
    {
        en: "How effectively do you handle feedback and criticism?",
        ar: "ما مدى فعاليتك في التعامل مع التغذية الراجعة والنقد؟"
    }
];

// Rating Options (English only)
window.ratingOptions = window.ratingOptions || ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'];

// Initialize sample data if not exists
function initializeSampleData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
    
    if (!localStorage.getItem('evaluations')) {
        const evaluations = sampleUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            managerId: user.managerId,
            supervisorId: user.supervisorId,
            selfEvaluation: null,
            managerEvaluation: null,
            supervisorEvaluation: null,
            evaluatesManager: null,
            evaluatesSupervisor: null
        }));
        localStorage.setItem('evaluations', JSON.stringify(evaluations));
    }
}

// User Authentication
function login(username, password) {
    // Ensure localStorage users are normalized against canonical sampleUsers
    normalizeUsers();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
    // Prefer the canonical user record from getUsers() in case localStorage was modified
    const canonical = getUserByUsername(user.username) || user;
    localStorage.setItem('currentUser', JSON.stringify(canonical));
    localStorage.setItem('username', canonical.username);
    localStorage.setItem('name', canonical.name);
    localStorage.setItem('role', canonical.role);
    localStorage.setItem('userId', canonical.id);
    return canonical;
    }
    return null;
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('evaluationType');
    localStorage.removeItem('evaluationTarget');
    window.location.href = 'login.html';
}

// Normalize localStorage users against canonical sampleUsers.
// Keeps localStorage users in sync with the in-file sampleUsers list.
function normalizeUsers() {
    try {
        const stored = JSON.parse(localStorage.getItem('users')) || [];
        const byUsername = {};
        stored.forEach(u => { if (u && u.username) byUsername[u.username] = u; });

        sampleUsers.forEach(su => {
            const existing = byUsername[su.username];
            if (existing) {
                existing.id = su.id;
                existing.password = su.password;
                existing.name = su.name;
                existing.email = su.email;
                existing.role = su.role;
                existing.department = su.department;
                existing.managerId = su.managerId || null;
                existing.supervisorId = su.supervisorId || null;
            } else {
                stored.push(Object.assign({}, su));
            }
        });

        localStorage.setItem('users', JSON.stringify(stored));
    } catch (e) {
        console.error('normalizeUsers error', e);
    }
}

// Helper / Lookup functions (used by many pages) ---------------------------
function getUsers() {
    // Return users from localStorage if present, otherwise the in-file sampleUsers
    try {
        return JSON.parse(localStorage.getItem('users')) || sampleUsers.slice();
    } catch (e) {
        return sampleUsers.slice();
    }
}

function getUserById(id) {
    if (!id) return null;
    return getUsers().find(u => u.id === id) || null;
}

function getUserByUsername(username) {
    if (!username) return null;
    return getUsers().find(u => u.username === username) || null;
}

function getCurrentUser() {
    try {
        const cu = JSON.parse(localStorage.getItem('currentUser'));
        if (cu) return cu;
    } catch (e) {
        // ignore
    }
    const username = localStorage.getItem('username');
    if (username) return getUserByUsername(username) || null;
    return null;
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function saveEvaluations(evaluations) {
    try {
        localStorage.setItem('evaluations', JSON.stringify(evaluations || []));
    } catch (e) {
        console.error('saveEvaluations error', e);
    }
}

function getEvaluationById(id) {
    if (!id) return null;
    return getEvaluations().find(e => e.id === id) || null;
}

function getEmployeesByManager(managerId) {
    if (!managerId) return [];
    return getEvaluations().filter(e => e.managerId === managerId);
}

function getSubordinatesBySupervisor(supervisorId) {
    if (!supervisorId) return [];
    return getEvaluations().filter(e => e.supervisorId === supervisorId);
}


// Evaluation Data Management
function getEvaluations() {
    return JSON.parse(localStorage.getItem('evaluations')) || [];
}

function exportToExcelDetailed() {
    // Generate a simplified Excel detailed sheet: Name, Department, Status, Avg. rating
    try {
        const evaluations = getEvaluations().filter(e => e.role !== 'hr');

        const labelToNumber = v => {
            if (v === null || v === undefined) return null;
            const s = String(v).trim();
            if (/^\d+(?:\.\d+)?$/.test(s)) return parseFloat(s);
            if (/strongly agree/i.test(s)) return 5;
            if (/agree/i.test(s)) return 4;
            if (/neutral/i.test(s)) return 3;
            if (/disagree/i.test(s)) return 2;
            if (/strongly disagree/i.test(s)) return 1;
            if (/أوافق بشدة/.test(s)) return 5;
            if (/أوافق/.test(s)) return 4;
            if (/لا أوافق/.test(s)) return 2;
            if (/لا أوافق بشدة/.test(s)) return 1;
            return null;
        };

        function computeAvg(emp) {
            const selfRatings = emp.selfEvaluation?.ratings;
            if (selfRatings) {
                let vals = [];
                if (Array.isArray(selfRatings)) vals = selfRatings.map(labelToNumber).filter(x => x !== null);
                else if (typeof selfRatings === 'object') vals = Object.values(selfRatings).map(labelToNumber).filter(x => x !== null);
                if (vals.length) return (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2);
            }
            const mgr = emp.managerEvaluation?.overallRating;
            if (mgr !== undefined && mgr !== null && /^\d+(?:\.\d+)?$/.test(String(mgr))) return parseFloat(mgr).toFixed(2);
            const sup = emp.supervisorEvaluation?.overallRating;
            if (sup !== undefined && sup !== null && /^\d+(?:\.\d+)?$/.test(String(sup))) return parseFloat(sup).toFixed(2);
            return 'N/A';
        }

        const wb = XLSX.utils.book_new();
        const detailedData = [ ['Name', 'Department', 'Status', 'Avg. rating'] ];

        evaluations.forEach(emp => {
            const status = (emp.selfEvaluation?.completed && emp.managerEvaluation?.completed && emp.supervisorEvaluation?.completed) ? 'Complete' : 'Incomplete';
            detailedData.push([
                emp.name || emp.id || 'N/A',
                emp.department || 'N/A',
                status,
                computeAvg(emp)
            ]);
        });

        const detailedWS = XLSX.utils.aoa_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(wb, detailedWS, 'Detailed Evaluations');

        XLSX.writeFile(wb, `ACT_Performance_Detailed_${new Date().toISOString().split('T')[0]}.xlsx`);
        const currentLanguage = localStorage.getItem('currentLanguage') || 'en';
        const message = currentLanguage === 'ar' ? 'تم إنشاء تقرير Excel المفصل بنجاح' : 'Detailed Excel report generated successfully';
        showToast(message, 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
        if (modal) modal.hide();
    } catch (err) {
        console.error('exportToExcelDetailed error', err);
        showToast('Export failed: ' + (err?.message || err), 'danger');
    }
}

function getEvaluationProgress(userId) {
    const evaluation = getEvaluationById(userId);
    if (!evaluation) return { total: 0, completed: 0, percentage: 0 };

    let total = 1; // Self evaluation
    let completed = 0;

    if (evaluation.selfEvaluation?.completed) completed++;

    // Add manager evaluation if user has manager
    if (evaluation.managerId) {
        total++;
        if (evaluation.evaluatesManager?.completed) completed++;
    }

    // Add supervisor evaluation if user has supervisor
    if (evaluation.supervisorId) {
        total++;
        if (evaluation.evaluatesSupervisor?.completed) completed++;
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
}

function getManagerEvaluationProgress(managerId) {
    const employees = getEmployeesByManager(managerId);
    let completed = 0;
    
    employees.forEach(emp => {
        if (emp.managerEvaluation?.completed) {
            completed++;
        }
    });
    
    return {
        total: employees.length,
        completed,
        percentage: employees.length > 0 ? Math.round((completed / employees.length) * 100) : 0
    };
}

function getSupervisorEvaluationProgress(supervisorId) {
    const subordinates = getSubordinatesBySupervisor(supervisorId);
    let completed = 0;
    
    subordinates.forEach(emp => {
        if (emp.supervisorEvaluation?.completed) {
            completed++;
        }
    });
    
    return {
        total: subordinates.length,
        completed,
        percentage: subordinates.length > 0 ? Math.round((completed / subordinates.length) * 100) : 0
    };
}

// Toast Notification System
function showToast(message, type = 'info') {
    // simple dedupe: avoid showing same message repeatedly within short window
    try { if (!showToast._last) showToast._last = { msg: null, ts: 0 }; } catch(e){}
    const nowTs = Date.now();
    if (showToast._last && showToast._last.msg === message && (nowTs - showToast._last.ts) < 3000) {
        return; // skip duplicate
    }
    showToast._last.msg = message; showToast._last.ts = nowTs;

    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;

    const toastId = 'toast-' + Date.now();
    const iconClass = {
        success: 'fa-check-circle',
        danger: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';

    const bgClass = {
        success: 'bg-success',
        danger: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info'
    }[type] || 'bg-info';

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${iconClass} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
    
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Form Validation
function validateEvaluationForm(formData) {
    const errors = [];
    
    if (!formData.ratings || formData.ratings.length === 0) {
        errors.push('At least one rating is required');
    }
    
    formData.ratings.forEach((rating, index) => {
        if (!rating) {
            errors.push(`Rating for question ${index + 1} is required`);
        }
    });
    
    if (formData.answers && formData.answers.length > 0) {
        formData.answers.forEach((answer, index) => {
            if (!validateRequired(answer)) {
                errors.push(`Answer for question ${index + 1} is required`);
            }
        });
    }
    
    if (formData.comments && formData.comments.length > 0) {
        formData.comments.forEach((comment, index) => {
            if (!validateRequired(comment)) {
                errors.push(`Comment for question ${index + 1} is required`);
            }
        });
    }
    
    if (formData.hasOwnProperty('reason') && !validateRequired(formData.reason)) {
        errors.push('Overall reason is required');
    }
    
    return errors;
}

// Data Export Functions
function exportEvaluationData() {
    const evaluations = getEvaluations();
    const exportData = {
        timestamp: new Date().toISOString(),
        data: evaluations.map(evaluation => ({
            id: evaluation.id,
            name: evaluation.name,
            department: evaluation.department,
            role: evaluation.role,
            selfEvaluation: evaluation.selfEvaluation ? {
                completed: evaluation.selfEvaluation.completed,
                ratings: evaluation.selfEvaluation.ratings,
                timestamp: evaluation.selfEvaluation.timestamp
            } : null,
            managerEvaluation: evaluation.managerEvaluation ? {
                completed: evaluation.managerEvaluation.completed,
                overallRating: evaluation.managerEvaluation.overallRating,
                timestamp: evaluation.managerEvaluation.timestamp
            } : null,
            supervisorEvaluation: evaluation.supervisorEvaluation ? {
                completed: evaluation.supervisorEvaluation.completed,
                overallRating: evaluation.supervisorEvaluation.overallRating,
                timestamp: evaluation.supervisorEvaluation.timestamp
            } : null
        }))
    };
    
    return exportData;
}

function generateCSVReport() {
    const evaluations = getEvaluations();
    const headers = [
        'Employee ID',
        'Name',
        'Department',
        'Role',
        'Self Evaluation Status',
        'Manager Evaluation Status',
        'Supervisor Evaluation Status',
        'Self Evaluation Rating Average',
        'Manager Overall Rating',
        'Supervisor Overall Rating',
        'Completion Status',
        'Last Updated'
    ];
    
    const rows = evaluations.map(emp => {
        const selfStatus = emp.selfEvaluation?.completed ? 'Completed' : 'Pending';
        const managerStatus = emp.managerEvaluation?.completed ? 'Completed' : 'Pending';
        const supervisorStatus = emp.supervisorEvaluation?.completed ? 'Completed' : 'Pending';
        
        const selfAverage = emp.selfEvaluation?.ratings ? 
            calculateRatingAverage(emp.selfEvaluation.ratings) : 'N/A';
        const managerOverall = emp.managerEvaluation?.overallRating || 'N/A';
        const supervisorOverall = emp.supervisorEvaluation?.overallRating || 'N/A';
        
        const isComplete = emp.selfEvaluation?.completed && 
                          emp.managerEvaluation?.completed && 
                          emp.supervisorEvaluation?.completed;
        
        const lastUpdated = getLastUpdateDate(emp);
        
        return [
            emp.id,
            emp.name,
            emp.department,
            emp.role,
            selfStatus,
            managerStatus,
            supervisorStatus,
            selfAverage,
            managerOverall,
            supervisorOverall,
            isComplete ? 'Complete' : 'Incomplete',
            lastUpdated
        ];
    });
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    
    return csvContent;
}

function calculateRatingAverage(ratings) {
    if (!ratings || ratings.length === 0) return 'N/A';
    
    const ratingValues = {
        'Strongly Agree': 4,
        'Agree': 3,
        'Disagree': 2,
        'Strongly Disagree': 1,
        'أوافق بشدة': 4,
        'أوافق': 3,
        'لا أوافق': 2,
        'لا أوافق بشدة': 1
    };
    
    const total = ratings.reduce((sum, rating) => {
        return sum + (ratingValues[rating] || 0);
    }, 0);
    
    return (total / ratings.length).toFixed(2);
}

function getLastUpdateDate(evaluation) {
    const dates = [];
    
    if (evaluation.selfEvaluation?.timestamp) {
        dates.push(new Date(evaluation.selfEvaluation.timestamp));
    }
    if (evaluation.managerEvaluation?.timestamp) {
        dates.push(new Date(evaluation.managerEvaluation.timestamp));
    }
    if (evaluation.supervisorEvaluation?.timestamp) {
        dates.push(new Date(evaluation.supervisorEvaluation.timestamp));
    }
    
    if (dates.length === 0) return 'Never';
    
    const latestDate = new Date(Math.max(...dates));
    return latestDate.toLocaleDateString();
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getProgressColor(percentage) {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    if (percentage >= 40) return 'info';
    return 'danger';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search and Filter Functions
function searchEvaluations(searchTerm) {
    const evaluations = getEvaluations();
    const term = searchTerm.toLowerCase();
    
    return evaluations.filter(emp => 
        emp.name.toLowerCase().includes(term) ||
        emp.id.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.role.toLowerCase().includes(term)
    );
}

function filterEvaluationsByStatus(status) {
    const evaluations = getEvaluations();
    
    return evaluations.filter(emp => {
        switch (status) {
            case 'completed':
                return emp.selfEvaluation?.completed && 
                       emp.managerEvaluation?.completed && 
                       emp.supervisorEvaluation?.completed;
            case 'pending':
                return !(emp.selfEvaluation?.completed && 
                        emp.managerEvaluation?.completed && 
                        emp.supervisorEvaluation?.completed);
            case 'self-pending':
                return !emp.selfEvaluation?.completed;
            case 'manager-pending':
                return !emp.managerEvaluation?.completed;
            case 'supervisor-pending':
                return !emp.supervisorEvaluation?.completed;
            default:
                return true;
        }
    });
}

function filterEvaluationsByDepartment(department) {
    const evaluations = getEvaluations();
    return evaluations.filter(emp => emp.department === department);
}

// Statistics Functions
function getSystemStatistics() {
    const evaluations = getEvaluations();
    const total = evaluations.length;
    
    let selfCompleted = 0;
    let managerCompleted = 0;
    let supervisorCompleted = 0;
    let fullyCompleted = 0;
    
    evaluations.forEach(emp => {
        if (emp.selfEvaluation?.completed) selfCompleted++;
        if (emp.managerEvaluation?.completed) managerCompleted++;
        if (emp.supervisorEvaluation?.completed) supervisorCompleted++;
        if (emp.selfEvaluation?.completed && 
            emp.managerEvaluation?.completed && 
            emp.supervisorEvaluation?.completed) {
            fullyCompleted++;
        }
    });
    
    return {
        total,
        selfCompleted,
        managerCompleted,
        supervisorCompleted,
        fullyCompleted,
        selfCompletionRate: total > 0 ? Math.round((selfCompleted / total) * 100) : 0,
        managerCompletionRate: total > 0 ? Math.round((managerCompleted / total) * 100) : 0,
        supervisorCompletionRate: total > 0 ? Math.round((supervisorCompleted / total) * 100) : 0,
        overallCompletionRate: total > 0 ? Math.round((fullyCompleted / total) * 100) : 0
    };
}

function getDepartmentStatistics() {
    const evaluations = getEvaluations();
    const departments = {};
    
    evaluations.forEach(emp => {
        if (!departments[emp.department]) {
            departments[emp.department] = {
                total: 0,
                completed: 0,
                employees: []
            };
        }
        
        departments[emp.department].total++;
        departments[emp.department].employees.push(emp);
        
        if (emp.selfEvaluation?.completed && 
            emp.managerEvaluation?.completed && 
            emp.supervisorEvaluation?.completed) {
            departments[emp.department].completed++;
        }
    });
    
    Object.keys(departments).forEach(dept => {
        const deptData = departments[dept];
        deptData.completionRate = deptData.total > 0 ? 
            Math.round((deptData.completed / deptData.total) * 100) : 0;
    });
    
    return departments;
}

// Role-based Access Control
function hasAccess(requiredRole, userRole) {
    const roleHierarchy = {
        'employee': 1,
        'manager': 2,
        'supervisor': 3,
        'hr': 4
    };
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

function canViewEvaluation(viewerId, targetId) {
    const viewer = getUserById(viewerId);
    const target = getUserById(targetId);
    
    if (!viewer || !target) return false;
    
    // Users can always view their own evaluations
    if (viewerId === targetId) return true;
    
    // Managers can view their employees' evaluations
    if (viewer.role === 'manager' && target.managerId === viewerId) return true;
    
    // Supervisors can view all subordinates' evaluations
    if (viewer.role === 'supervisor' && 
        (target.supervisorId === viewerId || target.managerId && getUserById(target.managerId)?.supervisorId === viewerId)) {
        return true;
    }
    
    // HR can view all evaluations
    if (viewer.role === 'hr') return true;
    
    return false;
}

function canEditEvaluation(editorId, targetId, evaluationType) {
    const editor = getUserById(editorId);
    const target = getUserById(targetId);
    
    if (!editor || !target) return false;
    
    // Self evaluations
    if (evaluationType === 'self' && editorId === targetId) return true;
    
    // Manager evaluations
    if (evaluationType === 'manager' && editor.role === 'manager' && target.managerId === editorId) return true;
    
    // Supervisor evaluations
    if (evaluationType === 'supervisor' && editor.role === 'supervisor' && target.supervisorId === editorId) return true;
    
    // HR can edit any evaluation (admin privileges)
    if (editor.role === 'hr') return true;
    
    return false;
}

// Notification System
function getNotifications(userId) {
    const user = getUserById(userId);
    if (!user) return [];
    
    const notifications = [];
    const evaluation = getEvaluationById(userId);
    
    // Self-evaluation reminders
    if (!evaluation?.selfEvaluation?.completed) {
        notifications.push({
            type: 'reminder',
            message: 'Complete your self-evaluation',
            priority: 'high',
            action: 'self-evaluation'
        });
    }
    
    // Manager evaluation reminders
    if (user.role === 'manager') {
        const employees = getEmployeesByManager(userId);
        const pendingCount = employees.filter(emp => !emp.managerEvaluation?.completed).length;
        
        if (pendingCount > 0) {
            notifications.push({
                type: 'reminder',
                message: `${pendingCount} employee evaluation(s) pending`,
                priority: 'medium',
                action: 'employee-evaluations'
            });
        }
    }
    
    // Supervisor evaluation reminders
    if (user.role === 'supervisor') {
        const subordinates = getSubordinatesBySupervisor(userId);
        const pendingCount = subordinates.filter(emp => !emp.supervisorEvaluation?.completed).length;
        
        if (pendingCount > 0) {
            notifications.push({
                type: 'reminder',
                message: `${pendingCount} subordinate evaluation(s) pending`,
                priority: 'medium',
                action: 'subordinate-evaluations'
            });
        }
    }
    
    return notifications;
}


// Performance Monitoring
function logPerformance(action, duration) {
    const performanceLog = JSON.parse(localStorage.getItem('performanceLog')) || [];
    performanceLog.push({
        action,
        duration,
        timestamp: new Date().toISOString(),
        user: localStorage.getItem('username')
    });
    
    // Keep only last 100 entries
    if (performanceLog.length > 100) {
        performanceLog.splice(0, performanceLog.length - 100);
    }
    
    localStorage.setItem('performanceLog', JSON.stringify(performanceLog));
}

function measurePerformance(func, actionName) {
    const start = performance.now();
    const result = func();
    const duration = performance.now() - start;
    logPerformance(actionName, duration);
    return result;
}

// Initialize the application
function initializeApp() {
    initializeSampleData();
    
    // Set default language if not set
    if (!localStorage.getItem('currentLanguage')) {
        localStorage.setItem('currentLanguage', 'en');
    }
    
    // Check authentication on protected pages
    const protectedPages = [
        'employee_home_page.html',
        'manager_home_page.html',
        'supervisorrr_home_page.html',
        'hr_dashboard.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Auto-logout after inactivity (30 minutes)
    let inactivityTimer;
    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (isLoggedIn()) {
                showToast('Session expired due to inactivity', 'warning');
                setTimeout(logout, 2000);
            }
        }, 30 * 60 * 1000); // 30 minutes
    };
    
    // Reset timer on user activity
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer);
    
    resetInactivityTimer();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showToast('An unexpected error occurred. Please try again.', 'danger');
});

// Employee Page Functions
function startSelfEvaluation() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast('Please log in first', 'danger');
        return;
    }
    
    localStorage.setItem('evaluationType', 'self');
    localStorage.setItem('evaluationTarget', currentUser.id);
    window.location.href = 'employee_evaluation_page.html';
}

function evaluateManager() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast('Please log in first', 'danger');
        return;
    }
    
    if (!currentUser.managerId) {
        showToast('No manager assigned to evaluate', 'warning');
        return;
    }
    
    localStorage.setItem('evaluationType', 'manager');
    localStorage.setItem('evaluationTarget', currentUser.managerId);
    window.location.href = 'employee_evaluation_page.html';
}

function evaluateSupervisor() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast('Please log in first', 'danger');
        return;
    }
    
    if (!currentUser.supervisorId) {
        showToast('No supervisor assigned to evaluate', 'warning');
        return;
    }
    
    localStorage.setItem('evaluationType', 'supervisor');
    localStorage.setItem('evaluationTarget', currentUser.supervisorId);
    window.location.href = 'employee_evaluation_page.html';
}

// Language Toggle Functions

// Progress Update Functions
function updateProgress() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const progress = getEvaluationProgress(currentUser.id);
    
    // Update progress bar
    const progressBar = document.getElementById('overallProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${progress.percentage}%`;
        progressText.textContent = `${progress.percentage}% Complete`;
        
        // Update progress bar color
        progressBar.className = `progress-bar bg-${getProgressColor(progress.percentage)}`;
    }
    
    // Update status badges
    updateStatusBadges(currentUser);
}

function updateStatusBadges(user) {
    // Self evaluation status
    const selfStatus = document.getElementById('selfStatus');
    if (selfStatus) {
        if (user.selfEvaluation?.completed) {
            selfStatus.textContent = 'Completed';
            selfStatus.className = 'status-badge status-completed';
        } else {
            selfStatus.textContent = 'Pending';
            selfStatus.className = 'status-badge status-pending';
        }
    }
    
    // Manager evaluation status
    const managerStatus = document.getElementById('managerStatus');
    if (managerStatus) {
        if (user.evaluatesManager?.completed) {
            managerStatus.textContent = 'Completed';
            managerStatus.className = 'status-badge status-completed';
        } else {
            managerStatus.textContent = 'Pending';
            managerStatus.className = 'status-badge status-pending';
        }
    }
    
    // Supervisor evaluation status
    const supervisorStatus = document.getElementById('supervisorStatus');
    if (supervisorStatus) {
        if (user.evaluatesSupervisor?.completed) {
            supervisorStatus.textContent = 'Completed';
            supervisorStatus.className = 'status-badge status-completed';
        } else {
            supervisorStatus.textContent = 'Pending';
            supervisorStatus.className = 'status-badge status-pending';
        }
    }
}

// Manager Page Functions
function viewEmployeeList() {
    window.location.href = 'manager_employee_list.html';
}

function startManagerEvaluation(employeeId) {
    localStorage.setItem('evaluationType', 'manager');
    localStorage.setItem('evaluationTarget', employeeId);
    window.location.href = 'manager_evaluation_page.html';
}

// Supervisor Page Functions
function viewManagerList() {
    window.location.href = 'maneger_supervisor_list.html';
}

function viewEmployeeListSupervisor() {
    window.location.href = 'supervisorrr_employee_list.html';
}

function startSupervisorEvaluation(targetId) {
    localStorage.setItem('evaluationType', 'supervisor');
    localStorage.setItem('evaluationTarget', targetId);
    window.location.href = 'supervisorrr_evaluation_page.html';
}

// HR Dashboard Functions
function viewAllEvaluations() {
    // This would typically show a comprehensive view
    showToast('Viewing all evaluations', 'info');
}

// Export Functions
function exportData() {
    showExportOptions();
}

function showExportOptions() {
    const currentLanguage = localStorage.getItem('currentLanguage') || 'en';
    const isArabic = currentLanguage === 'ar';
    
    const exportModal = `
        <div class="modal fade" id="exportModal" tabindex="-1" aria-labelledby="exportModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exportModalLabel">
                            <i class="fas fa-download me-2"></i>${isArabic ? 'خيارات التصدير' : 'Export Options'}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="card h-100" onclick="exportToPDF()" style="cursor: pointer;">
                                    <div class="card-body text-center">
                                        <i class="fas fa-file-pdf fa-3x text-danger mb-3"></i>
                                        <h5 class="card-title">${isArabic ? 'تقرير PDF' : 'PDF Report'}</h5>
                                        <p class="card-text">${isArabic ? 'تقرير شامل بتنسيق PDF' : 'Complete evaluation report in PDF format'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100" onclick="exportToExcelDetailed()" style="cursor: pointer;">
                                    <div class="card-body text-center">
                                        <i class="fas fa-file-excel fa-3x text-success mb-3"></i>
                                        <h5 class="card-title">${isArabic ? 'Excel مفصل' : 'Excel Detailed'}</h5>
                                        <p class="card-text">${isArabic ? 'بيانات شاملة بتنسيق Excel' : 'Comprehensive data in Excel format'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100" onclick="exportToExcelSummary()" style="cursor: pointer;">
                                    <div class="card-body text-center">
                                        <i class="fas fa-file-excel fa-3x text-info mb-3"></i>
                                        <h5 class="card-title">${isArabic ? 'Excel ملخص' : 'Excel Summary'}</h5>
                                        <p class="card-text">${isArabic ? 'بيانات مختصرة بتنسيق Excel' : 'Summary data in Excel format'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100" onclick="exportToCSV()" style="cursor: pointer;">
                                    <div class="card-body text-center">
                                        <i class="fas fa-file-csv fa-3x text-warning mb-3"></i>
                                        <h5 class="card-title">${isArabic ? 'تقرير CSV' : 'CSV Report'}</h5>
                                        <p class="card-text">${isArabic ? 'بيانات أساسية بتنسيق CSV' : 'Basic data in CSV format'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('exportModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', exportModal);
    const modal = new bootstrap.Modal(document.getElementById('exportModal'));
    modal.show();
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('ACT Performance Evaluation Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Get evaluations data
    const evaluations = getEvaluations();
    const stats = getSystemStatistics();
    
    // Add summary statistics
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, 50);
    
    const summaryData = [
        ['Total Employees', stats.total],
        ['Completed Evaluations', stats.fullyCompleted],
        ['Pending Evaluations', stats.total - stats.fullyCompleted],
        ['Completion Rate', `${stats.overallCompletionRate}%`]
    ];
    
    doc.autoTable({
        head: [['Metric', 'Value']],
        body: summaryData,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [255, 102, 0] },
        styles: { fontSize: 10 }
    });
    
    // Add detailed evaluations table
    doc.setFontSize(14);
    doc.text('Detailed Evaluations', 20, doc.lastAutoTable.finalY + 20);
    
    const tableData = evaluations.map(emp => [
        emp.id,
        emp.name,
        emp.department,
        emp.role,
        emp.selfEvaluation?.completed ? 'Yes' : 'No',
        emp.managerEvaluation?.completed ? 'Yes' : 'No',
        emp.supervisorEvaluation?.completed ? 'Yes' : 'No',
        emp.selfEvaluation?.completed && emp.managerEvaluation?.completed && emp.supervisorEvaluation?.completed ? 'Complete' : 'Incomplete'
    ]);
    
    doc.autoTable({
        head: [['ID', 'Name', 'Department', 'Role', 'Self Eval', 'Manager Eval', 'Supervisor Eval', 'Status']],
        body: tableData,
        startY: doc.lastAutoTable.finalY + 30,
        theme: 'grid',
        headStyles: { fillColor: [255, 102, 0] },
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 20 },
            4: { cellWidth: 15 },
            5: { cellWidth: 15 },
            6: { cellWidth: 15 },
            7: { cellWidth: 20 }
        }
    });
    
    // Add department statistics
    doc.setFontSize(14);
    doc.text('Department Statistics', 20, doc.lastAutoTable.finalY + 20);
    
    const deptStats = getDepartmentStatistics();
    const deptData = Object.keys(deptStats).map(dept => [
        dept,
        deptStats[dept].total,
        deptStats[dept].completed,
        `${deptStats[dept].completionRate}%`
    ]);
    
    doc.autoTable({
        head: [['Department', 'Total', 'Completed', 'Completion Rate']],
        body: deptData,
        startY: doc.lastAutoTable.finalY + 30,
        theme: 'grid',
        headStyles: { fillColor: [255, 102, 0] },
        styles: { fontSize: 10 }
    });
    
    // Save the PDF
    doc.save(`ACT_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    const currentLanguage = localStorage.getItem('currentLanguage') || 'en';
    const message = currentLanguage === 'ar' ? 'تم إنشاء تقرير PDF بنجاح' : 'PDF report generated successfully';
    showToast(message, 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
    if (modal) modal.hide();
}

function exportToExcelDetailed() {
    // Export only Name, Department, Status, Avg. rating for all users except HR
    try {
        const evaluations = getEvaluations().filter(e => e.role !== 'hr');

        // Helper to compute average similar to top implementation
        const labelToNumber = v => {
            if (v === null || v === undefined) return null;
            const s = String(v).trim();
            if (/^\d+(?:\.\d+)?$/.test(s)) return parseFloat(s);
            if (/strongly agree/i.test(s)) return 5;
            if (/agree/i.test(s)) return 4;
            if (/neutral/i.test(s)) return 3;
            if (/disagree/i.test(s)) return 2;
            if (/strongly disagree/i.test(s)) return 1;
            if (/أوافق بشدة/.test(s)) return 5;
            if (/أوافق/.test(s)) return 4;
            if (/لا أوافق/.test(s)) return 2;
            if (/لا أوافق بشدة/.test(s)) return 1;
            return null;
        };

        function computeAvg(emp) {
            const selfRatings = emp.selfEvaluation?.ratings;
            if (selfRatings) {
                let vals = [];
                if (Array.isArray(selfRatings)) vals = selfRatings.map(labelToNumber).filter(x => x !== null);
                else if (typeof selfRatings === 'object') vals = Object.values(selfRatings).map(labelToNumber).filter(x => x !== null);
                if (vals.length) return (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2);
            }
            const mgr = emp.managerEvaluation?.overallRating;
            if (mgr !== undefined && mgr !== null && /^\d+(?:\.\d+)?$/.test(String(mgr))) return parseFloat(mgr).toFixed(2);
            const sup = emp.supervisorEvaluation?.overallRating;
            if (sup !== undefined && sup !== null && /^\d+(?:\.\d+)?$/.test(String(sup))) return parseFloat(sup).toFixed(2);
            return 'N/A';
        }

        const wb = XLSX.utils.book_new();
        const detailedData = [ ['Name', 'Department', 'Status', 'Avg. rating'] ];

        evaluations.forEach(emp => {
            const status = (emp.selfEvaluation?.completed && emp.managerEvaluation?.completed && emp.supervisorEvaluation?.completed) ? 'Complete' : 'Incomplete';
            detailedData.push([
                emp.name || emp.id || 'N/A',
                emp.department || 'N/A',
                status,
                computeAvg(emp)
            ]);
        });

        const detailedWS = XLSX.utils.aoa_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(wb, detailedWS, 'Detailed Evaluations');

        // Save file
        XLSX.writeFile(wb, `ACT_Performance_Detailed_${new Date().toISOString().split('T')[0]}.xlsx`);
        const currentLanguage = localStorage.getItem('currentLanguage') || 'en';
        const message = currentLanguage === 'ar' ? 'تم إنشاء تقرير Excel المفصل بنجاح' : 'Detailed Excel report generated successfully';
        showToast(message, 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
        if (modal) modal.hide();
    } catch (err) {
        console.error('exportToExcelDetailed (final) error', err);
        showToast('Export failed: ' + (err?.message || err), 'danger');
    }
}

function exportToExcelSummary() {
    const evaluations = getEvaluations();
    const stats = getSystemStatistics();
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary data
    const summaryData = [
        ['ACT Performance Evaluation System - Summary Report'],
        ['Generated on:', new Date().toLocaleString()],
        [''],
        ['Overall Statistics'],
        ['Total Employees', stats.total],
        ['Completed Evaluations', stats.fullyCompleted],
        ['Pending Evaluations', stats.total - stats.fullyCompleted],
        ['Overall Completion Rate', `${stats.overallCompletionRate}%`],
        [''],
        ['Evaluation Type Completion Rates'],
        ['Self Evaluations', `${stats.selfCompletionRate}%`],
        ['Manager Evaluations', `${stats.managerCompletionRate}%`],
        ['Supervisor Evaluations', `${stats.supervisorCompletionRate}%`]
    ];
    
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
    
    // Employee summary sheet
    const employeeData = [
        ['Employee ID', 'Name', 'Department', 'Role', 'Self Eval', 'Manager Eval', 'Supervisor Eval', 'Overall Status', 'Completion %']
    ];
    
    evaluations.forEach(emp => {
        const selfEval = emp.selfEvaluation?.completed ? 'Yes' : 'No';
        const managerEval = emp.managerEvaluation?.completed ? 'Yes' : 'No';
        const supervisorEval = emp.supervisorEvaluation?.completed ? 'Yes' : 'No';
        const overallStatus = (selfEval === 'Yes' && managerEval === 'Yes' && supervisorEval === 'Yes') ? 'Complete' : 'Incomplete';
        
        let completionCount = 0;
        if (selfEval === 'Yes') completionCount++;
        if (managerEval === 'Yes') completionCount++;
        if (supervisorEval === 'Yes') completionCount++;
        const completionPercent = Math.round((completionCount / 3) * 100);
        
        employeeData.push([
            emp.id,
            emp.name,
            emp.department,
            emp.role,
            selfEval,
            managerEval,
            supervisorEval,
            overallStatus,
            `${completionPercent}%`
        ]);
    });
    
    const employeeWS = XLSX.utils.aoa_to_sheet(employeeData);
    XLSX.utils.book_append_sheet(wb, employeeWS, 'Employee Summary');
    
    // Department summary
    const deptStats = getDepartmentStatistics();
    const deptData = [
        ['Department', 'Total', 'Completed', 'Pending', 'Completion Rate']
    ];
    
    Object.keys(deptStats).forEach(dept => {
        const deptInfo = deptStats[dept];
        deptData.push([
            dept,
            deptInfo.total,
            deptInfo.completed,
            deptInfo.total - deptInfo.completed,
            `${deptInfo.completionRate}%`
        ]);
    });
    
    const deptWS = XLSX.utils.aoa_to_sheet(deptData);
    XLSX.utils.book_append_sheet(wb, deptWS, 'Department Summary');
    
    // Save the file
    XLSX.writeFile(wb, `ACT_Performance_Summary_${new Date().toISOString().split('T')[0]}.xlsx`);
    const currentLanguage = localStorage.getItem('currentLanguage') || 'en';
    const message = currentLanguage === 'ar' ? 'تم إنشاء تقرير Excel الملخص بنجاح' : 'Summary Excel report generated successfully';
    showToast(message, 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
    if (modal) modal.hide();
}

function exportToCSV() {
    const csvData = generateCSVReport();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ACT_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    const currentLanguage = localStorage.getItem('currentLanguage') || 'en';
    const message = currentLanguage === 'ar' ? 'تم إنشاء تقرير CSV بنجاح' : 'CSV report generated successfully';
    showToast(message, 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
    if (modal) modal.hide();
}

// Helper functions for export
function calculateRatingAverage(ratings) {
    if (!ratings || Object.keys(ratings).length === 0) return 'N/A';
    const values = Object.values(ratings).filter(val => val !== null && val !== undefined);
    if (values.length === 0) return 'N/A';
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(2);
}

function getLastUpdateDate(employee) {
    const dates = [];
    if (employee.selfEvaluation?.timestamp) dates.push(new Date(employee.selfEvaluation.timestamp));
    if (employee.managerEvaluation?.timestamp) dates.push(new Date(employee.managerEvaluation.timestamp));
    if (employee.supervisorEvaluation?.timestamp) dates.push(new Date(employee.supervisorEvaluation.timestamp));
    
    if (dates.length === 0) return 'N/A';
    const latestDate = new Date(Math.max(...dates));
    return latestDate.toLocaleDateString();
}

// Evaluation Form Functions
function saveEvaluation() {
    const evaluationType = localStorage.getItem('evaluationType');
    const targetId = localStorage.getItem('evaluationTarget');
    const currentUser = getCurrentUser();
    
    if (!evaluationType || !targetId || !currentUser) {
        showToast('Invalid evaluation session', 'danger');
        return;
    }
    
    // Get form data
    const formData = collectFormData();
    
    // Validate form
    const errors = validateEvaluationForm(formData);
    if (errors.length > 0) {
        showToast(errors.join(', '), 'danger');
        return;
    }
    
    // Save evaluation
    const evaluations = getEvaluations();
    const evaluation = evaluations.find(e => e.id === targetId);
    
    if (!evaluation) {
        showToast('Target evaluation not found', 'danger');
        return;
    }
    
    // Update evaluation based on type
    const evaluationData = {
        completed: true,
        ratings: formData.ratings,
        answers: formData.answers || [],
        comments: formData.comments || [],
        reason: formData.reason || '',
        timestamp: new Date().toISOString(),
        evaluatorId: currentUser.id,
        evaluatorName: currentUser.name
    };
    
    switch (evaluationType) {
        case 'self':
            evaluation.selfEvaluation = evaluationData;
            break;
        case 'manager':
            evaluation.managerEvaluation = evaluationData;
            break;
        case 'supervisor':
            evaluation.supervisorEvaluation = evaluationData;
            break;
        default:
            showToast('Invalid evaluation type', 'danger');
            return;
    }
    
    saveEvaluations(evaluations);
    showToast('Evaluation saved successfully', 'success');
    
    // Redirect based on user role
    setTimeout(() => {
        const role = currentUser.role;
        switch (role) {
            case 'employee':
                window.location.href = 'employee_home_page.html';
                break;
            case 'manager':
                window.location.href = 'manager_home_page.html';
                break;
            case 'supervisor':
                window.location.href = 'supervisor_home_page.html';
                break;
            case 'hr':
                window.location.href = 'hr_dashboard.html';
                break;
            default:
                window.location.href = 'employee_home_page.html';
        }
    }, 1500);
}

function collectFormData() {
    const formData = {
        ratings: [],
        answers: [],
        comments: [],
        reason: ''
    };
    
    // Collect ratings
    const ratingInputs = document.querySelectorAll('input[name^="rating"]');
    ratingInputs.forEach(input => {
        if (input.checked) {
            formData.ratings.push(input.value);
        }
    });
    
    // Collect answers
    const answerInputs = document.querySelectorAll('textarea[name^="answer"]');
    answerInputs.forEach(input => {
        formData.answers.push(input.value);
    });
    
    // Collect comments
    const commentInputs = document.querySelectorAll('textarea[name^="comment"]');
    commentInputs.forEach(input => {
        formData.comments.push(input.value);
    });
    
    // Collect overall reason
    const reasonInput = document.querySelector('textarea[name="reason"]');
    if (reasonInput) {
        formData.reason = reasonInput.value;
    }
    
    return formData;
}

function saveManagerEvaluation() {
    // اجمع بيانات التقييم من النموذج واحفظها في localStorage أو أرسلها للسيرفر
    // يمكنك التعديل حسب طريقة الحفظ عندك
    showToast('Manager evaluation saved!', 'success');
}

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
///////////////
//////////////
let editingRow = null;

// Function to show toast notifications
function showToast(arg1, arg2, arg3) {
    // Supports two call signatures used across the app:
    //  - showToast(message, type)
    //  - showToast(title, message, type)
    // Be defensive: if specific DOM elements are missing, use the .toast-container approach
    let title = null, message = '', type = 'info';
    const knownTypes = ['success', 'danger', 'warning', 'info', 'error'];

    if (typeof arg3 !== 'undefined') {
        // signature: title, message, type
        title = arg1;
        message = arg2 || '';
        type = arg3 || 'info';
    } else if (typeof arg2 !== 'undefined' && knownTypes.includes(String(arg2))) {
        // signature: message, type
        message = arg1 || '';
        type = arg2 || 'info';
    } else if (typeof arg2 !== 'undefined') {
        // signature: title, message (no type)
        title = arg1;
        message = arg2 || '';
        type = 'success';
    } else {
        // signature: message
        message = arg1 || '';
        type = 'info';
    }

    // Prefer the modern toast-container approach if present
    const toastContainer = document.querySelector('.toast-container');
    if (toastContainer) {
        const toastId = 'toast-' + Date.now();
        const iconClass = {
            success: 'fa-check-circle',
            danger: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        }[type] || 'fa-info-circle';

        const bgClass = {
            success: 'bg-success',
            danger: 'bg-danger',
            warning: 'bg-warning',
            info: 'bg-info'
        }[type] || 'bg-info';

        const inner = title ? `<strong>${title}</strong> ${message}` : message;

        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas ${iconClass} me-2"></i>
                        ${inner}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastElement = document.getElementById(toastId);
        try {
            const bsToast = new bootstrap.Toast(toastElement, { delay: 5000 });
            bsToast.show();
            toastElement.addEventListener('hidden.bs.toast', function() { toastElement.remove(); });
        } catch (e) {
            console.error('showToast bootstrap error', e);
        }

        return;
    }

    // Fallback: try legacy notification elements (notificationToast/toastTitle/toastBody)
    const toast = document.getElementById('notificationToast');
    const toastTitle = toast ? document.getElementById('toastTitle') : null;
    const toastBody = toast ? document.getElementById('toastBody') : null;

    if (toast && toastTitle && toastBody) {
        toastTitle.textContent = title || '';
        toastBody.textContent = message;
        toast.classList.remove('toast-success', 'toast-error');
        toast.classList.add(type === 'success' ? 'toast-success' : 'toast-error');
        try {
            const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
            bsToast.show();
        } catch (e) {
            console.error('showToast bootstrap error', e);
        }
        return;
    }

    // Last resort: console and alert
    console.log('Toast:', title ? (title + ' - ' + message) : message, 'type:', type);
    try { if (typeof alert !== 'undefined') alert((title ? title + ' - ' : '') + message); } catch (e) {}
}

function getRoleBadge(role) {
  switch(role) {
    case "Employee": return '<span class="badge bg-primary">Employee</span>';
    case "Manager": return '<span class="badge bg-warning">Manager</span>';
    case "HR": return '<span class="badge bg-info">HR</span>';
    default: return role;
  }
}

function getStatusBadge(status) {
  switch(status.trim().toLowerCase()) {
    case "registered": return '<span class="status-badge bg-primary text-white">Registered</span>';
    case "validated": return '<span class="status-badge bg-success text-white">Validated</span>';
    case "not validated": return '<span class="status-badge bg-danger text-white">Not Validated</span>';
    default: return '<span class="status-badge bg-secondary text-white">Unknown</span>';
  }
}

function openModal() {
  editingRow = null;
  document.getElementById("dataForm").reset();
  document.getElementById("created").value = new Date().toISOString().split('T')[0];
  document.querySelector("#dataModal .modal-title").innerHTML = '<i class="fas fa-plus me-2"></i>Add Entry';
  new bootstrap.Modal(document.getElementById('dataModal')).show();
}

function editRow(btn) {
  editingRow = btn.closest("tr");
  let cells = editingRow.getElementsByTagName("td");
  
  let roleText = cells[0].querySelector('.badge').textContent.trim();
  document.getElementById("role").value = roleText;
  
  document.getElementById("username").value = cells[1].innerText;
  document.getElementById("fullname").value = cells[2].innerText;
  document.getElementById("email").value = cells[3].innerText;
  document.getElementById("phone").value = cells[4].innerText;
  
  let statusText = cells[5].querySelector('.status-badge') ? cells[5].querySelector('.status-badge').textContent.trim() : "Unknown";
  document.getElementById("status").value = statusText;
  
  document.getElementById("created").value = cells[6].innerText;
  
  document.querySelector("#dataModal .modal-title").innerHTML = '<i class="fas fa-edit me-2"></i>Edit Entry';
  new bootstrap.Modal(document.getElementById('dataModal')).show();
}

function saveData() {
  let role = document.getElementById("role").value;
  let username = document.getElementById("username").value;
  let fullname = document.getElementById("fullname").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let status = document.getElementById("status").value;
  let created = document.getElementById("created").value;

  if (!username || !fullname || !email) {
    showToast('Error', 'Please fill in all required fields!', 'error');
    return;
  }

  let roleBadge = getRoleBadge(role);
  let statusBadge = getStatusBadge(status);

  if (editingRow) {
    let cells = editingRow.getElementsByTagName("td");
    cells[0].innerHTML = roleBadge;
    cells[1].innerText = username;
    cells[2].innerText = fullname;
    cells[3].innerText = email;
    cells[4].innerText = phone;
    cells[5].innerHTML = statusBadge; // نتاكد إن الـ Status يظهر
    cells[6].innerText = created;
    showToast('Success', 'Entry updated successfully!', 'success');
  } else {
    let table = document.getElementById("AllUsers").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow();
    newRow.innerHTML = `
      <td>${roleBadge}</td>
      <td>${username}</td>
      <td>${fullname}</td>
      <td>${email}</td>
      <td>${phone}</td>
      <td>${statusBadge}</td>
      <td>${created}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-edit btn-sm" onclick="editRow(this)" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-view btn-sm" onclick="viewRow(this)" title="View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-delete btn-sm" onclick="deleteRow(this)" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>`;
    showToast('Success', 'Entry added successfully!', 'success');
  }

  bootstrap.Modal.getInstance(document.getElementById('dataModal')).hide();
  filterTable();
}

function deleteRow(btn) {
  btn.closest("tr").remove();
  filterTable();
  showToast('Success', 'Entry deleted successfully!', 'success');
}

function viewRow(btn) {
  let row = btn.closest("tr");
  let cells = row.getElementsByTagName("td");
  
  let roleText = cells[0].querySelector('.badge').textContent.trim();
  document.getElementById("viewRole").value = roleText;
  
  document.getElementById("viewUsername").value = cells[1].innerText;
  document.getElementById("viewFullname").value = cells[2].innerText;
  document.getElementById("viewEmail").value = cells[3].innerText;
  document.getElementById("viewPhone").value = cells[4].innerText;
  
  let statusText = cells[5].querySelector('.status-badge') ? cells[5].querySelector('.status-badge').textContent.trim() : "Unknown";
  document.getElementById("viewStatus").value = statusText;
  
  document.getElementById("viewCreated").value = cells[6].innerText;
  
  new bootstrap.Modal(document.getElementById('viewModal')).show();
}

function filterTable() {
  let roleFilter = document.getElementById("roleFilter").value.toLowerCase();
  let statusFilter = document.getElementById("statusFilter").value.toLowerCase();
  let searchValue = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#AllUsers tbody tr");
  let visibleCount = 0;

  rows.forEach(row => {
    let roleElement = row.cells[0].querySelector('.badge');
    let role = roleElement ? roleElement.textContent.toLowerCase() : '';
    let username = row.cells[1].innerText.toLowerCase();
    let fullname = row.cells[2].innerText.toLowerCase();
    let email = row.cells[3].innerText.toLowerCase();
    let phone = row.cells[4].innerText.toLowerCase();
    let statusElement = row.cells[5].querySelector('.status-badge');
    let status = statusElement ? statusElement.textContent.toLowerCase() : '';
    let created = row.cells[6].innerText.toLowerCase();

    let roleMatch = (roleFilter === "all" || role === roleFilter);
    let statusMatch = (statusFilter === "all" || status === statusFilter);
    let searchMatch = (
      username.includes(searchValue) ||
      fullname.includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue) ||
      created.includes(searchValue) ||
      role.includes(searchValue) ||
      status.includes(searchValue)
    );

    if (roleMatch && statusMatch && searchMatch) {
      row.style.display = "";
      visibleCount++;
    } else {
      row.style.display = "none";
    }
  });
  
  document.getElementById('visibleCount').textContent = visibleCount;
}

function importExcel(input) {
  let file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      if (jsonData.length < 2) {
        showToast('Error', 'Excel file should have at least a header row and one data row!', 'error');
        return;
      }

      const headers = jsonData[0].map(h => h ? h.toString().trim() : '');
      
      const roleIndex = findColumnIndex(headers, ['role', 'position', 'job']);
      const usernameIndex = findColumnIndex(headers, ['username', 'user', 'login']);
      const nameIndex = findColumnIndex(headers, ['name', 'fullname', 'full name', 'full_name']);
      const emailIndex = findColumnIndex(headers, ['email', 'mail', 'e-mail']);
      const phoneIndex = findColumnIndex(headers, ['phone', 'mobile', 'telephone', 'contact']);
      const statusIndex = findColumnIndex(headers, ['status', 'state', 'condition']);
      const createdIndex = findColumnIndex(headers, ['created', 'date', 'created_on', 'created on', 'registration']);

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        if (!row || row.length === 0 || row.every(cell => !cell)) {
          continue;
        }

        try {
          const userData = {
            role: getCellValue(row, roleIndex) || 'Employee',
            username: getCellValue(row, usernameIndex) || '',
            fullname: getCellValue(row, nameIndex) || '',
            email: getCellValue(row, emailIndex) || '',
            phone: getCellValue(row, phoneIndex) || '',
            status: getCellValue(row, statusIndex) || 'Registered',
            created: formatDate(getCellValue(row, createdIndex)) || new Date().toISOString().split('T')[0]
          };

          if (!userData.username || !userData.fullname || !userData.email) {
            errors.push(`Row ${i + 1}: Missing required fields (username, name, or email)`);
            errorCount++;
            continue;
          }

          if (!isValidEmail(userData.email)) {
            errors.push(`Row ${i + 1}: Invalid email format`);
            errorCount++;
            continue;
          }

          if (!['Registered', 'Validated', 'Not Validated'].includes(userData.status)) {
            userData.status = 'Registered';
          }

          addRowToTable(userData);
          successCount++;

        } catch (error) {
          errors.push(`Row ${i + 1}: ${error.message}`);
          errorCount++;
        }
      }

      let message = `Successfully imported: ${successCount} records`;
      if (errorCount > 0) {
        message += `\nErrors: ${errorCount} records`;
        if (errors.length > 0) {
          message += `\n\nError details:\n${errors.slice(0, 5).join('\n')}`;
          if (errors.length > 5) {
            message += `\n... and ${errors.length - 5} more errors`;
          }
        }
        showToast('Import Result', message, 'error');
      } else {
        showToast('Import Success', message, 'success');
      }

      filterTable();

    } catch (error) {
      showToast('Error', 'Error reading Excel file: ' + error.message, 'error');
    }
  };
  
  reader.readAsArrayBuffer(file);
  input.value = '';
}

function findColumnIndex(headers, possibleNames) {
  for (let name of possibleNames) {
    const index = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
    if (index !== -1) return index;
  }
  return -1;
}

function getCellValue(row, index) {
  if (index === -1 || !row[index]) return '';
  return row[index].toString().trim();
}

function formatDate(dateValue) {
  if (!dateValue) return '';
  
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  const date = new Date(dateValue);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  return '';
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function addRowToTable(userData) {
  const table = document.getElementById("AllUsers").getElementsByTagName("tbody")[0];
  const newRow = table.insertRow();
  
  const roleBadge = getRoleBadge(userData.role);
  const statusBadge = getStatusBadge(userData.status);
  
  newRow.innerHTML = `
    <td>${roleBadge}</td>
    <td>${userData.username}</td>
    <td>${userData.fullname}</td>
    <td>${userData.email}</td>
    <td>${userData.phone}</td>
    <td>${statusBadge}</td>
    <td>${userData.created}</td>
    <td>
      <div class="action-buttons">
        <button class="btn btn-edit btn-sm" onclick="editRow(this)" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-view btn-sm" onclick="viewRow(this)" title="View">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-delete btn-sm" onclick="deleteRow(this)" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </td>`;
}

function exportToExcel() {
  try {
    const table = document.getElementById("AllUsers");
    const rows = Array.from(table.querySelectorAll("tbody tr")).filter(row => 
      row.style.display !== "none"
    );

    if (rows.length === 0) {
      showToast('Error', 'No data to export!', 'error');
      return;
    }

    const data = [];
    
    data.push(['Role', 'Username', 'Full Name', 'Email', 'Phone', 'Status', 'Created On']);

    rows.forEach(row => {
      const cells = row.getElementsByTagName("td");
      const roleText = cells[0].querySelector('.badge')?.textContent || '';
      const statusText = cells[5].querySelector('.status-badge')?.textContent || '';
      
      data.push([
        roleText,
        cells[1].innerText,
        cells[2].innerText,
        cells[3].innerText,
        cells[4].innerText,
        statusText,
        cells[6].innerText
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    const colWidths = [];
    data[0].forEach((header, i) => {
      let maxLength = header.length;
      data.forEach(row => {
        const cellLength = row[i] ? row[i].toString().length : 0;
        maxLength = Math.max(maxLength, cellLength);
      });
      colWidths.push({ width: Math.min(maxLength + 2, 50) });
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "HR Evaluations");

    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `HR_Evaluations_${timestamp}.xlsx`;

    XLSX.writeFile(wb, filename);
    
    showToast('Success', `File exported successfully as: ${filename}`, 'success');
    
  } catch (error) {
    showToast('Error', 'Error exporting to Excel: ' + error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  filterTable();
});

// Safely bind field validators if fields exist on the current page
(function() {
  const emailEl = document.getElementById('email');
  if (emailEl) {
    emailEl.addEventListener('blur', function() {
      if (this.value && !isValidEmail(this.value)) {
        this.setCustomValidity('Please enter a valid email address');
      } else {
        this.setCustomValidity('');
      }
    });
  }

  const usernameEl = document.getElementById('username');
  if (usernameEl) {
    usernameEl.addEventListener('blur', function() {
      this.setCustomValidity('');
    });
  }

  const phoneEl = document.getElementById('phone');
  if (phoneEl) {
    phoneEl.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      this.value = value;
    });
  }
})();