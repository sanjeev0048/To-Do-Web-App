
        let tasks = [];
        let currentFilter = 'all';
        let editingTaskId = null;

        // Initialize the app
        function init() {
            loadTasks();
            renderTasks();
            updateStats();
        }

        // Load tasks from memory (in a real app, this would be from localStorage or a database)
        function loadTasks() {
            // Tasks are already initialized as empty array
        }

        // Add a new task
        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const prioritySelect = document.getElementById('prioritySelect');
            const datetimeInput = document.getElementById('datetimeInput');

            const text = taskInput.value.trim();
            if (!text) {
                alert('Please enter a task!');
                return;
            }

            const task = {
                id: Date.now(),
                text: text,
                priority: prioritySelect.value,
                datetime: datetimeInput.value,
                completed: false,
                createdAt: new Date().toISOString()
            };

            tasks.unshift(task);
            
            // Clear inputs
            taskInput.value = '';
            datetimeInput.value = '';
            prioritySelect.value = 'medium';

            renderTasks();
            updateStats();
        }

        // Delete a task
        function deleteTask(id) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(task => task.id !== id);
                renderTasks();
                updateStats();
            }
        }

        // Toggle task completion
        function toggleComplete(id) {
            const task = tasks.find(task => task.id === id);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
                updateStats();
            }
        }

        // Start editing a task
        function startEdit(id) {
            editingTaskId = id;
            const task = tasks.find(task => task.id === id);
            if (!task) return;

            const editForm = document.getElementById(`edit-form-${id}`);
            editForm.classList.add('active');
            
            document.getElementById(`edit-text-${id}`).value = task.text;
            document.getElementById(`edit-priority-${id}`).value = task.priority;
            document.getElementById(`edit-datetime-${id}`).value = task.datetime;
        }

        // Cancel editing
        function cancelEdit(id) {
            const editForm = document.getElementById(`edit-form-${id}`);
            editForm.classList.remove('active');
            editingTaskId = null;
        }

        // Save edited task
        function saveEdit(id) {
            const task = tasks.find(task => task.id === id);
            if (!task) return;

            const newText = document.getElementById(`edit-text-${id}`).value.trim();
            if (!newText) {
                alert('Please enter a task text!');
                return;
            }

            task.text = newText;
            task.priority = document.getElementById(`edit-priority-${id}`).value;
            task.datetime = document.getElementById(`edit-datetime-${id}`).value;

            cancelEdit(id);
            renderTasks();
            updateStats();
        }

        // Filter tasks
        function filterTasks(filter) {
            currentFilter = filter;
            
            // Update active tab
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');

            renderTasks();
        }

        // Get filtered tasks
        function getFilteredTasks() {
            switch(currentFilter) {
                case 'completed':
                    return tasks.filter(task => task.completed);
                case 'pending':
                    return tasks.filter(task => !task.completed);
                case 'high':
                    return tasks.filter(task => task.priority === 'high');
                default:
                    return tasks;
            }
        }

        // Format datetime for display
        function formatDateTime(datetime) {
            if (!datetime) return '';
            const date = new Date(datetime);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Render tasks
        function renderTasks() {
            const tasksList = document.getElementById('tasksList');
            const emptyState = document.getElementById('emptyState');
            const filteredTasks = getFilteredTasks();

            if (filteredTasks.length === 0) {
                tasksList.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }

            emptyState.style.display = 'none';
            
            tasksList.innerHTML = filteredTasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <div class="task-header">
                        <div class="task-text">${task.text}</div>
                        <div class="task-priority priority-${task.priority}">
                            ${task.priority} priority
                        </div>
                    </div>
                    
                    <div class="task-meta">
                        <div class="task-datetime">
                            ${task.datetime ? formatDateTime(task.datetime) : 'No deadline set'}
                        </div>
                        <div class="task-actions">
                            ${task.completed 
                                ? `<button class="action-btn uncomplete-btn" onclick="toggleComplete(${task.id})">Mark Incomplete</button>`
                                : `<button class="action-btn complete-btn" onclick="toggleComplete(${task.id})">Complete</button>`
                            }
                            <button class="action-btn edit-btn" onclick="startEdit(${task.id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                        </div>
                    </div>

                    <div class="edit-form" id="edit-form-${task.id}">
                        <input type="text" id="edit-text-${task.id}" placeholder="Task text...">
                        <select id="edit-priority-${task.id}">
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                        <input type="datetime-local" id="edit-datetime-${task.id}">
                        <div class="edit-form-actions">
                            <button class="action-btn save-btn" onclick="saveEdit(${task.id})">Save</button>
                            <button class="action-btn cancel-btn" onclick="cancelEdit(${task.id})">Cancel</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Update statistics
        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(task => task.completed).length;
            const pending = total - completed;

            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('pendingTasks').textContent = pending;
        }

        // Allow Enter key to add task
        document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Initialize the app when page loads
        init();
