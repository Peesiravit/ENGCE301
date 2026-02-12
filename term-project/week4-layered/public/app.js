// app.js - Frontend Logic (MODIFIED FOR VM DEPLOYMENT)
// Task Board Application

// ===== CONFIG =====
const API_BASE_URL = 'http://192.168.56.101:3000'; // ชี้ไปยัง VM ของคุณ

// ===== STATE =====
let allTasks = [];
let currentFilter = 'ALL';

// ===== DOM ELEMENTS =====
const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

// Task lists
const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

// Counters
const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');

// ===== API FUNCTIONS =====

async function fetchTasks() {
    showLoading();
    try {
        // แก้ไขจุดที่ 1: ใส่ API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/tasks`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allTasks = data.tasks;
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('❌ Failed to load tasks. Please refresh the page.');
    } finally {
        hideLoading();
    }
}

async function createTask(taskData) {
    showLoading();
    try {
        // แก้ไขจุดที่ 2: ใส่ API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create task');
        }
        
        const data = await response.json();
        allTasks.unshift(data.task); 
        renderTasks();
        
        addTaskForm.reset();
        showNotification('✅ Task created successfully!', 'success');
    } catch (error) {
        console.error('Error creating task:', error);
        alert('❌ ' + error.message);
    } finally {
        hideLoading();
    }
}

async function updateTaskStatus(taskId, newStatus) {
    showLoading();
    try {
        // แก้ไขจุดที่ 3: ใส่ API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update status');
        }
        
        const data = await response.json();
        
        const index = allTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            allTasks[index] = data.task;
        }
        
        renderTasks();
        showNotification(`✅ Task moved to ${newStatus.replace('_', ' ')}`, 'success');
    } catch (error) {
        console.error('Error updating status:', error);
        alert('❌ ' + error.message);
    } finally {
        hideLoading();
    }
}

async function deleteTask(taskId) {
    if (!confirm('⚠️ Are you sure you want to delete this task?')) {
        return;
    }
    
    showLoading();
    try {
        // แก้ไขจุดที่ 4: ใส่ API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete task');
        }
        
        allTasks = allTasks.filter(t => t.id !== taskId);
        renderTasks();
        
        showNotification('✅ Task deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ ' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== RENDER FUNCTIONS =====

function renderTasks() {
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';
    
    let filteredTasks = allTasks;
    if (currentFilter !== 'ALL') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }
    
    const todo = filteredTasks.filter(t => t.status === 'TODO');
    const progress = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
    const done = filteredTasks.filter(t => t.status === 'DONE');
    
    todoCount.textContent = todo.length;
    progressCount.textContent = progress.length;
    doneCount.textContent = done.length;
    
    renderTaskList(todo, todoTasks, 'TODO');
    renderTaskList(progress, progressTasks, 'IN_PROGRESS');
    renderTaskList(done, doneTasks, 'DONE');
}

function renderTaskList(tasks, container, currentStatus) {
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 No tasks here</p>
                <p style="font-size: 0.85em; color: #999;">
                    ${currentStatus === 'TODO' ? 'Add a new task to get started!' : 
                      currentStatus === 'IN_PROGRESS' ? 'Move tasks here when you start working' : 
                      'Complete tasks to see them here'}
                </p>
            </div>
        `;
        return;
    }
    
    tasks.forEach(task => {
        const card = createTaskCard(task, currentStatus);
        container.appendChild(card);
    });
}

function createTaskCard(task, currentStatus) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-task-id', task.id);
    
    const priorityClass = `priority-${task.priority.toLowerCase()}`;
    const createdDate = formatDate(task.created_at);
    const updatedDate = task.updated_at !== task.created_at ? formatDate(task.updated_at) : null;
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
            <div>📅 Created: ${createdDate}</div>
            ${updatedDate ? `<div>✏️ Updated: ${updatedDate}</div>` : ''}
        </div>
        <div class="task-actions">
            ${createStatusButtons(task.id, currentStatus)}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}

function createStatusButtons(taskId, currentStatus) {
    const buttons = [];
    if (currentStatus !== 'TODO') {
        buttons.push(`<button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">← To Do</button>`);
    }
    if (currentStatus !== 'IN_PROGRESS') {
        buttons.push(`<button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">${currentStatus === 'TODO' ? '→' : '←'} In Progress</button>`);
    }
    if (currentStatus !== 'DONE') {
        buttons.push(`<button class="btn btn-success btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">→ Done ✓</button>`);
    }
    return buttons.join('');
}

// ===== UTILITY FUNCTIONS =====

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function showLoading() { loadingOverlay.style.display = 'flex'; }
function hideLoading() { loadingOverlay.style.display = 'none'; }
function showNotification(message, type = 'info') { console.log(`[${type.toUpperCase()}] ${message}`); }

// ===== EVENT LISTENERS =====

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;
    if (!title) { alert('⚠️ Please enter a task title'); return; }
    createTask({ title, description, priority });
});

statusFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTasks();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Task Board App Initialized with VM API');
    fetchTasks();
});

// Make functions globally accessible
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;