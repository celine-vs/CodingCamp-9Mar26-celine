/**
 * Productivity Dashboard Application
 * A client-side productivity tool with greeting widget, focus timer, task manager, and quick links
 * All data persists to browser Local Storage
 */

// Greeting Widget Component
const GreetingWidget = {
    /**
     * Local Storage key for user name
     */
    storageKey: 'productivity-dashboard-username',

    /**
     * Initialize the greeting widget and start the update loop
     */
    init() {
        this.update();
        // Update every second
        setInterval(() => this.update(), 1000);
        
        // Attach edit name button listener
        const editNameBtn = document.querySelector('.btn-edit-name');
        if (editNameBtn) {
            editNameBtn.addEventListener('click', () => this.editName());
        }
    },

    /**
     * Get user name from Local Storage
     * @returns {string} User name or empty string
     */
    getUserName() {
        try {
            return localStorage.getItem(this.storageKey) || '';
        } catch (error) {
            console.error('Error loading user name:', error);
            return '';
        }
    },

    /**
     * Save user name to Local Storage
     * @param {string} name - User name to save
     */
    saveUserName(name) {
        try {
            localStorage.setItem(this.storageKey, name);
        } catch (error) {
            console.error('Error saving user name:', error);
        }
    },

    /**
     * Prompt user to edit their name
     */
    editName() {
        const currentName = this.getUserName();
        const newName = prompt('Enter your name:', currentName);
        
        if (newName !== null) {
            this.saveUserName(newName.trim());
            this.update();
        }
    },

    /**
     * Update the time, date, and greeting display
     */
    update() {
        const now = new Date();
        
        // Update time display
        const timeElement = document.querySelector('.time-display');
        if (timeElement) {
            timeElement.textContent = this.formatTime(now);
        }
        
        // Update date display
        const dateElement = document.querySelector('.date-display');
        if (dateElement) {
            dateElement.textContent = this.formatDate(now);
        }
        
        // Update greeting message
        const greetingElement = document.querySelector('.greeting-message');
        if (greetingElement) {
            const userName = this.getUserName();
            const greeting = this.getGreeting(now.getHours());
            greetingElement.textContent = userName ? `${greeting}, ${userName}!` : greeting;
        }
    },

    /**
     * Get appropriate greeting based on the hour
     * @param {number} hour - Hour in 24-hour format (0-23)
     * @returns {string} Greeting message
     */
    getGreeting(hour) {
        if (hour >= 5 && hour <= 11) {
            return 'Good Morning';
        } else if (hour >= 12 && hour <= 16) {
            return 'Good Afternoon';
        } else if (hour >= 17 && hour <= 20) {
            return 'Good Evening';
        } else {
            // 21-23 or 0-4
            return 'Good Night';
        }
    },

    /**
     * Format time in 12-hour format with AM/PM
     * @param {Date} date - Date object to format
     * @returns {string} Formatted time string (HH:MM:SS AM/PM)
     */
    formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        // Zero-pad minutes and seconds
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
    },

    /**
     * Format date in readable format
     * @param {Date} date - Date object to format
     * @returns {string} Formatted date string (Day, Month Date, Year)
     */
    formatDate(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const dayOfMonth = date.getDate();
        const year = date.getFullYear();
        
        return `${dayName}, ${monthName} ${dayOfMonth}, ${year}`;
    }
};

// Focus Timer Component
const FocusTimer = {
    /**
     * Timer state
     */
    state: {
        duration: 1500,      // 25 minutes in seconds
        remaining: 1500,     // Current remaining time in seconds
        isRunning: false,    // Whether timer is currently running
        intervalId: null     // setInterval ID for cleanup
    },

    /**
     * Initialize the focus timer and attach event listeners
     */
    init() {
        // Set up initial state
        this.state.remaining = this.state.duration;
        this.state.isRunning = false;
        this.state.intervalId = null;
        
        // Update display with initial time
        this.updateDisplay();
        
        // Update button states to match initial state
        this.updateButtonStates();
        
        // Attach button event listeners
        const startBtn = document.querySelector('.btn-start');
        const stopBtn = document.querySelector('.btn-stop');
        const resetBtn = document.querySelector('.btn-reset');
        const setDurationBtn = document.querySelector('.btn-set-duration');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stop());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
        
        if (setDurationBtn) {
            setDurationBtn.addEventListener('click', () => this.setDuration());
        }
    },

    /**
     * Set custom timer duration
     */
    setDuration() {
        const input = document.querySelector('.timer-duration-input');
        if (!input) return;
        
        const minutes = parseInt(input.value);
        if (isNaN(minutes) || minutes < 1 || minutes > 120) {
            alert('Please enter a valid duration between 1 and 120 minutes.');
            return;
        }
        
        // Stop timer if running
        this.stop();
        
        // Set new duration
        this.state.duration = minutes * 60;
        this.state.remaining = this.state.duration;
        
        // Update display
        this.updateDisplay();
        this.updateButtonStates();
    },

    /**
     * Format seconds to MM:SS format
     * @param {number} seconds - Number of seconds to format
     * @returns {string} Formatted time string (MM:SS)
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        // Zero-pad both minutes and seconds
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = remainingSeconds.toString().padStart(2, '0');
        
        return `${minutesStr}:${secondsStr}`;
    },

    /**
     * Update the timer display with current remaining time
     */
    updateDisplay() {
        const displayElement = document.querySelector('.timer-display');
        if (displayElement) {
            displayElement.textContent = this.formatTime(this.state.remaining);
        }
    },

    /**
     * Update button states based on timer state
     * Disables start button when running, disables stop button when not running
     */
    updateButtonStates() {
        const startBtn = document.querySelector('.btn-start');
        const stopBtn = document.querySelector('.btn-stop');
        
        if (startBtn) {
            // Disable start button when timer is running or when time is at zero
            startBtn.disabled = this.state.isRunning || this.state.remaining <= 0;
        }
        
        if (stopBtn) {
            // Disable stop button when timer is not running
            stopBtn.disabled = !this.state.isRunning;
        }
    },

    /**
     * Start the countdown timer
     */
    start() {
        // Guard: prevent multiple intervals
        if (this.state.isRunning) {
            return;
        }
        
        // Only start if there's time remaining
        if (this.state.remaining <= 0) {
            return;
        }
        
        this.state.isRunning = true;
        
        // Update button states
        this.updateButtonStates();
        
        // Start countdown with setInterval
        this.state.intervalId = setInterval(() => this.tick(), 1000);
    },

    /**
     * Stop/pause the countdown timer
     */
    stop() {
        // Clear the interval to pause countdown
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }
        
        this.state.isRunning = false;
        
        // Update button states
        this.updateButtonStates();
    },

    /**
     * Reset the timer to initial duration
     */
    reset() {
        // Stop the timer if running
        this.stop();
        
        // Reset to initial duration
        this.state.remaining = this.state.duration;
        
        // Update display
        this.updateDisplay();
        
        // Update button states (start should be enabled, stop should be disabled)
        this.updateButtonStates();
        
        // Clear completion state
        const statusElement = document.querySelector('.timer-status');
        if (statusElement) {
            statusElement.textContent = '';
            statusElement.classList.remove('timer-complete');
        }
    },

    /**
     * Decrement remaining time by one second
     */
    tick() {
        // Prevent timer from going negative
        if (this.state.remaining > 0) {
            this.state.remaining--;
            this.updateDisplay();
            
            // Check if timer reached zero
            if (this.state.remaining === 0) {
                this.handleComplete();
            }
        } else {
            // Safety: stop timer if somehow it's still running at zero
            this.stop();
        }
    },

    /**
     * Handle timer completion when reaching zero
     */
    handleComplete() {
        // Stop the timer
        this.stop();
        
        // Update button states (start should be disabled at zero)
        this.updateButtonStates();
        
        // Display visual indication of completion
        const statusElement = document.querySelector('.timer-status');
        if (statusElement) {
            statusElement.textContent = 'Session Complete!';
            statusElement.classList.add('timer-complete');
        }
    }
};

// Task Manager Component
const TaskManager = {
    /**
     * Array of task objects
     */
    tasks: [],

    /**
     * Local Storage key for tasks
     */
    storageKey: 'productivity-dashboard-tasks',

    /**
     * Generate a unique ID for a task
     * @returns {string} Unique identifier
     */
    generateId() {
        // Use timestamp + random number for uniqueness
        return `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    },

    /**
     * Load tasks from Local Storage
     * @returns {Array} Array of task objects
     */
    loadTasks() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Validate that parsed data is an array
                if (Array.isArray(parsed)) {
                    return parsed;
                } else {
                    console.warn('Stored tasks data is not an array, returning empty array');
                    return [];
                }
            }
            return [];
        } catch (error) {
            // Handle JSON parse errors or other storage errors
            console.error('Error loading tasks from Local Storage:', error);
            // Clear corrupted data
            try {
                localStorage.removeItem(this.storageKey);
            } catch (clearError) {
                console.error('Error clearing corrupted tasks data:', clearError);
            }
            return [];
        }
    },

    /**
     * Save tasks to Local Storage
     * @returns {boolean} True if save was successful, false otherwise
     */
    saveTasks() {
        try {
            const serialized = JSON.stringify(this.tasks);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (error) {
            // Handle quota exceeded or other storage errors
            if (error.name === 'QuotaExceededError') {
                console.error('Local Storage quota exceeded. Cannot save tasks.');
                alert('Storage quota exceeded. Please delete some tasks or clear browser data.');
            } else {
                console.error('Error saving tasks to Local Storage:', error);
                alert('Failed to save tasks. Your changes may not persist.');
            }
            return false;
        }
    },

    /**
     * Add a new task to the task list
     * @param {string} description - Task description text
     * @returns {Object|null} The created task object, or null if validation fails
     */
    addTask(description) {
        // Validate: description must be non-empty after trimming
        const trimmedDescription = description.trim();
        if (!trimmedDescription) {
            console.warn('Cannot add task: description is empty after trimming');
            return null;
        }

        // Check for duplicate tasks
        const isDuplicate = this.tasks.some(task => 
            task.description.toLowerCase() === trimmedDescription.toLowerCase()
        );
        
        if (isDuplicate) {
            console.warn('Cannot add task: duplicate task already exists');
            alert('This task already exists!');
            return null;
        }

        // Create new task object
        const newTask = {
            id: this.generateId(),
            description: trimmedDescription,
            completed: false,
            createdAt: Date.now()
        };

        // Add to tasks array
        this.tasks.push(newTask);

        // Persist to storage
        this.saveTasks();

        return newTask;
    },

    /**
     * Delete a task from the task list
     * @param {string} id - Task ID to delete
     * @returns {boolean} True if task was deleted, false if not found
     */
    deleteTask(id) {
        // Find the task index
        const index = this.tasks.findIndex(task => task.id === id);
        
        if (index === -1) {
            console.warn(`Cannot delete task: task with id ${id} not found`);
            return false;
        }

        // Remove from array
        this.tasks.splice(index, 1);

        // Persist to storage
        this.saveTasks();

        return true;
    },

    /**
     * Update task properties
     * @param {string} id - Task ID to update
     * @param {Object} updates - Object containing properties to update
     * @returns {Object|null} The updated task object, or null if not found
     */
    updateTask(id, updates) {
        // Find the task
        const task = this.tasks.find(task => task.id === id);
        
        if (!task) {
            console.warn(`Cannot update task: task with id ${id} not found`);
            return null;
        }

        // Apply updates to the task
        Object.assign(task, updates);

        // Persist to storage
        this.saveTasks();

        return task;
    },

    /**
     * Toggle the completion status of a task
     * @param {string} id - Task ID to toggle
     * @returns {boolean|null} The new completion status, or null if task not found
     */
    toggleComplete(id) {
        // Find the task
        const task = this.tasks.find(task => task.id === id);
        
        if (!task) {
            console.warn(`Cannot toggle task: task with id ${id} not found`);
            return null;
        }

        // Flip the completion status
        task.completed = !task.completed;

        // Persist to storage
        this.saveTasks();

        return task.completed;
    },

    /**
     * Initialize the Task Manager component
     * Load tasks from storage and attach event listeners
     */
    init() {
        // Load tasks from Local Storage
        this.tasks = this.loadTasks();
        
        // Render initial tasks
        this.renderTasks();
        
        // Attach event listeners
        this.attachEventListeners();
    },

    /**
     * Sort tasks: incomplete first, then completed
     */
    sortTasks() {
        this.tasks.sort((a, b) => {
            // Incomplete tasks come first
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            // Within same completion status, sort by creation time
            return a.createdAt - b.createdAt;
        });
        
        this.saveTasks();
        this.renderTasks();
    },

    /**
     * Attach event listeners for task form and interactions
     */
    attachEventListeners() {
        // Task form submit handler
        const taskForm = document.querySelector('.task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTaskSubmit();
            });
        }

        // Sort button handler
        const sortBtn = document.querySelector('.btn-sort-tasks');
        if (sortBtn) {
            sortBtn.addEventListener('click', () => this.sortTasks());
        }

        // Event delegation for task list interactions
        const taskList = document.querySelector('.task-list');
        if (taskList) {
            taskList.addEventListener('click', (e) => {
                const taskItem = e.target.closest('.task-item');
                if (!taskItem) return;

                const taskId = taskItem.getAttribute('data-task-id');

                // Handle checkbox toggle
                if (e.target.classList.contains('task-checkbox')) {
                    this.handleToggleComplete(taskId);
                }

                // Handle delete button
                if (e.target.classList.contains('btn-delete-task')) {
                    this.handleDelete(taskId);
                }

                // Handle edit button
                if (e.target.classList.contains('btn-edit-task')) {
                    this.handleEdit(taskId, taskItem);
                }
            });
        }
    },

    /**
     * Handle task form submission
     */
    handleTaskSubmit() {
        const taskInput = document.querySelector('.task-input');
        if (!taskInput) return;

        const description = taskInput.value;

        // Clear any previous validation errors
        this.clearValidationErrors();

        // Add task (validation happens in addTask method)
        const newTask = this.addTask(description);

        // If task was successfully created
        if (newTask) {
            // Clear input field
            taskInput.value = '';
            
            // Re-render tasks to show the new task
            this.renderTasks();
        } else {
            // Display validation error and maintain focus
            this.displayValidationError(description);
            taskInput.focus();
        }
    },

    /**
     * Handle toggling task completion status
     * @param {string} taskId - ID of task to toggle
     */
    handleToggleComplete(taskId) {
        // Toggle the completion status
        this.toggleComplete(taskId);
        
        // Re-render tasks to update UI
        this.renderTasks();
    },

    /**
     * Handle deleting a task
     * @param {string} taskId - ID of task to delete
     */
    handleDelete(taskId) {
        // Delete the task
        this.deleteTask(taskId);
        
        // Re-render tasks to update UI
        this.renderTasks();
    },

    /**
     * Handle editing a task with inline editing
     * @param {string} taskId - ID of task to edit
     * @param {HTMLElement} taskItem - The task item DOM element
     */
    handleEdit(taskId, taskItem) {
        const descriptionSpan = taskItem.querySelector('.task-description');
        if (!descriptionSpan) return;

        // Get current description
        const currentDescription = descriptionSpan.textContent;

        // Replace span with input field
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-edit-input';
        input.value = currentDescription;

        // Replace the span with input
        descriptionSpan.replaceWith(input);
        input.focus();
        input.select();

        // Handle saving the edit
        const saveEdit = () => {
            const newDescription = input.value.trim();
            
            // Only update if description is not empty
            if (newDescription) {
                this.updateTask(taskId, { description: newDescription });
            }
            
            // Re-render tasks to restore normal view
            this.renderTasks();
        };

        // Save on Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                // Cancel edit on Escape
                this.renderTasks();
            }
        });

        // Save on blur (clicking outside)
        input.addEventListener('blur', saveEdit);
    },

    /**
     * Render all tasks to the DOM
     * Updates the entire task list with current tasks array
     */
    renderTasks() {
        const taskList = document.querySelector('.task-list');
        if (!taskList) {
            console.warn('Task list element not found in DOM');
            return;
        }

        // Clear existing task items
        taskList.innerHTML = '';

        // Render each task in order
        this.tasks.forEach(task => {
            const taskElement = this.renderTask(task);
            taskList.appendChild(taskElement);
        });
    },

    /**
     * Display validation error message for invalid task input
     * @param {string} description - The description that was attempted
     */
    displayValidationError(description) {
        const taskForm = document.querySelector('.task-form');
        if (!taskForm) return;

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'polite');

        // Determine the specific error message
        const trimmedDescription = description.trim();
        if (!trimmedDescription) {
            errorDiv.textContent = 'Task description cannot be empty.';
        } else {
            errorDiv.textContent = 'Failed to add task. Please check your input.';
        }

        // Insert error message after the form
        taskForm.parentNode.insertBefore(errorDiv, taskForm.nextSibling);
    },

    /**
     * Clear any validation error messages
     */
    clearValidationErrors() {
        const existingError = document.querySelector('.task-manager .validation-error');
        if (existingError) {
            existingError.remove();
        }
    },

    /**
     * Create a DOM element for a single task
     * @param {Object} task - Task object to render
     * @returns {HTMLElement} Task list item element
     */
    renderTask(task) {
        // Create list item
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-task-id', task.id);

        // Apply completion styling if task is completed
        if (task.completed) {
            li.classList.add('completed');
        }

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;

        // Create description span
        const descriptionSpan = document.createElement('span');
        descriptionSpan.className = 'task-description';
        descriptionSpan.textContent = task.description;

        // Create edit button
        const editButton = document.createElement('button');
        editButton.className = 'btn-edit-task';
        editButton.textContent = 'Edit';
        editButton.setAttribute('aria-label', `Edit task: ${task.description}`);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn-delete-task';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete task: ${task.description}`);

        // Append all elements to list item
        li.appendChild(checkbox);
        li.appendChild(descriptionSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        return li;
    }
};

// Quick Links Component
const QuickLinks = {
    /**
     * Array of link objects
     */
    links: [],

    /**
     * Local Storage key for links
     */
    storageKey: 'productivity-dashboard-links',

    /**
     * Generate a unique ID for a link
     * @returns {string} Unique identifier
     */
    generateId() {
        // Use timestamp + random number for uniqueness
        return `link-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    },

    /**
     * Load links from Local Storage
     * @returns {Array} Array of link objects
     */
    loadLinks() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Validate that parsed data is an array
                if (Array.isArray(parsed)) {
                    return parsed;
                } else {
                    console.warn('Stored links data is not an array, returning empty array');
                    return [];
                }
            }
            return [];
        } catch (error) {
            // Handle JSON parse errors or other storage errors
            console.error('Error loading links from Local Storage:', error);
            // Clear corrupted data
            try {
                localStorage.removeItem(this.storageKey);
            } catch (clearError) {
                console.error('Error clearing corrupted links data:', clearError);
            }
            return [];
        }
    },

    /**
     * Save links to Local Storage
     * @returns {boolean} True if save was successful, false otherwise
     */
    saveLinks() {
        try {
            const serialized = JSON.stringify(this.links);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (error) {
            // Handle quota exceeded or other storage errors
            if (error.name === 'QuotaExceededError') {
                console.error('Local Storage quota exceeded. Cannot save links.');
                alert('Storage quota exceeded. Please delete some links or clear browser data.');
            } else {
                console.error('Error saving links to Local Storage:', error);
                alert('Failed to save links. Your changes may not persist.');
            }
            return false;
        }
    },

    /**
     * Validate that a URL starts with http:// or https://
     * @param {string} url - URL to validate
     * @returns {boolean} True if URL has valid protocol, false otherwise
     */
    validateUrl(url) {
        // Check if URL starts with http:// or https://
        return url.startsWith('http://') || url.startsWith('https://');
    },

    /**
     * Add a new link to the links list
     * @param {string} name - Display name for the link
     * @param {string} url - URL for the link
     * @returns {Object|null} The created link object, or null if validation fails
     */
    addLink(name, url) {
        // Validate: name must be non-empty after trimming
        const trimmedName = name.trim();
        if (!trimmedName) {
            console.warn('Cannot add link: name is empty after trimming');
            return null;
        }

        // Validate: url must be non-empty after trimming
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            console.warn('Cannot add link: url is empty after trimming');
            return null;
        }

        // Validate: url must start with http:// or https://
        if (!this.validateUrl(trimmedUrl)) {
            console.warn('Cannot add link: url must start with http:// or https://');
            return null;
        }

        // Create new link object
        const newLink = {
            id: this.generateId(),
            name: trimmedName,
            url: trimmedUrl,
            createdAt: Date.now()
        };

        // Add to links array
        this.links.push(newLink);

        // Persist to storage
        this.saveLinks();

        return newLink;
    },

    /**
     * Delete a link from the links list
     * @param {string} id - Link ID to delete
     * @returns {boolean} True if link was deleted, false if not found
     */
    deleteLink(id) {
        // Find the link index
        const index = this.links.findIndex(link => link.id === id);
        
        if (index === -1) {
            console.warn(`Cannot delete link: link with id ${id} not found`);
            return false;
        }

        // Remove from array
        this.links.splice(index, 1);

        // Persist to storage
        this.saveLinks();

        return true;
    },

    /**
     * Render all links to the DOM
     * Updates the entire links container with current links array
     */
    renderLinks() {
        const linksContainer = document.querySelector('.links-container');
        if (!linksContainer) {
            console.warn('Links container element not found in DOM');
            return;
        }

        // Clear existing link items
        linksContainer.innerHTML = '';

        // Render each link in order
        this.links.forEach(link => {
            const linkElement = this.renderLink(link);
            linksContainer.appendChild(linkElement);
        });
    },

    /**
     * Create a DOM element for a single link
     * @param {Object} link - Link object to render
     * @returns {HTMLElement} Link item element
     */
    renderLink(link) {
        // Create link item container
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.setAttribute('data-link-id', link.id);

        // Create anchor element
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.className = 'link-button';
        anchor.setAttribute('rel', 'noopener noreferrer'); // Security best practice

        // Create link name span
        const linkName = document.createElement('span');
        linkName.className = 'link-name';
        linkName.textContent = link.name;

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn-delete-link';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('aria-label', `Delete link: ${link.name}`);
        deleteButton.setAttribute('type', 'button');

        // Append elements to anchor
        anchor.appendChild(linkName);
        anchor.appendChild(deleteButton);

        // Append anchor to link item
        linkItem.appendChild(anchor);

        return linkItem;
    },

    /**
     * Initialize the Quick Links component
     * Load links from storage and attach event listeners
     */
    init() {
        // Load links from Local Storage
        this.links = this.loadLinks();
        
        // Render initial links
        this.renderLinks();
        
        // Attach event listeners
        this.attachEventListeners();
    },

    /**
     * Attach event listeners for link form and interactions
     */
    attachEventListeners() {
        // Link form submit handler
        const linkForm = document.querySelector('.link-form');
        if (linkForm) {
            linkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLinkSubmit();
            });
        }

        // Event delegation for link delete buttons
        const linksContainer = document.querySelector('.links-container');
        if (linksContainer) {
            linksContainer.addEventListener('click', (e) => {
                // Handle delete button
                if (e.target.classList.contains('btn-delete-link')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const linkItem = e.target.closest('.link-item');
                    if (linkItem) {
                        const linkId = linkItem.getAttribute('data-link-id');
                        this.handleDelete(linkId);
                    }
                }
            });
        }
    },

    /**
     * Handle link form submission
     */
    handleLinkSubmit() {
        const nameInput = document.querySelector('.link-name-input');
        const urlInput = document.querySelector('.link-url-input');
        
        if (!nameInput || !urlInput) return;

        const name = nameInput.value;
        const url = urlInput.value;

        // Clear any previous error messages
        this.clearValidationErrors();

        // Add link (validation happens in addLink method)
        const newLink = this.addLink(name, url);

        // If link was successfully created
        if (newLink) {
            // Clear input fields
            nameInput.value = '';
            urlInput.value = '';
            
            // Re-render links to show the new link
            this.renderLinks();
        } else {
            // Display validation error and maintain focus on invalid field
            const invalidField = this.displayValidationError(name, url);
            if (invalidField) {
                invalidField.focus();
            }
        }
    },

    /**
     * Handle deleting a link
     * @param {string} linkId - ID of link to delete
     */
    handleDelete(linkId) {
        // Delete the link
        this.deleteLink(linkId);
        
        // Re-render links to update UI
        this.renderLinks();
    },

    /**
     * Display validation error message for invalid link input
     * @param {string} name - The name that was attempted
     * @param {string} url - The URL that was attempted
     * @returns {HTMLElement|null} The input field that should receive focus, or null
     */
    displayValidationError(name, url) {
        const linkForm = document.querySelector('.link-form');
        if (!linkForm) return null;

        // Remove any existing error message
        this.clearValidationErrors();

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'polite');

        // Determine the specific error message and which field to focus
        const trimmedName = name.trim();
        const trimmedUrl = url.trim();
        let invalidField = null;

        if (!trimmedName) {
            errorDiv.textContent = 'Link name cannot be empty.';
            invalidField = document.querySelector('.link-name-input');
        } else if (!trimmedUrl) {
            errorDiv.textContent = 'Link URL cannot be empty.';
            invalidField = document.querySelector('.link-url-input');
        } else if (!this.validateUrl(trimmedUrl)) {
            errorDiv.textContent = 'URL must start with http:// or https:// (e.g., https://example.com)';
            invalidField = document.querySelector('.link-url-input');
        } else {
            errorDiv.textContent = 'Failed to add link. Please check your input.';
        }

        // Insert error message after the form
        linkForm.parentNode.insertBefore(errorDiv, linkForm.nextSibling);

        return invalidField;
    },

    /**
     * Clear any validation error messages
     */
    clearValidationErrors() {
        const existingError = document.querySelector('.quick-links .validation-error');
        if (existingError) {
            existingError.remove();
        }
    }
};

// Application Controller
const App = {
    /**
     * Local Storage key for theme preference
     */
    themeStorageKey: 'productivity-dashboard-theme',

    /**
     * Check if Local Storage is available
     * @returns {boolean} True if Local Storage is available, false otherwise
     */
    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Display a warning message if Local Storage is unavailable
     */
    displayStorageWarning() {
        // Create warning element
        const warning = document.createElement('div');
        warning.className = 'storage-warning';
        warning.setAttribute('role', 'alert');
        warning.innerHTML = `
            <strong>Warning:</strong> Local Storage is not available. 
            Your data will not be saved between sessions. 
            This may occur in private browsing mode.
        `;

        // Insert warning at the top of the page
        const body = document.body;
        if (body && body.firstChild) {
            body.insertBefore(warning, body.firstChild);
        } else if (body) {
            body.appendChild(warning);
        }
    },

    /**
     * Load theme preference from Local Storage
     * @returns {string} Theme preference ('light' or 'dark')
     */
    loadTheme() {
        try {
            return localStorage.getItem(this.themeStorageKey) || 'light';
        } catch (error) {
            console.error('Error loading theme:', error);
            return 'light';
        }
    },

    /**
     * Save theme preference to Local Storage
     * @param {string} theme - Theme preference ('light' or 'dark')
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.themeStorageKey, theme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    },

    /**
     * Toggle between light and dark mode
     */
    toggleTheme() {
        const body = document.body;
        const themeBtn = document.querySelector('.btn-theme-toggle');
        
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            if (themeBtn) themeBtn.textContent = '🌙';
            this.saveTheme('light');
        } else {
            body.classList.add('dark-mode');
            if (themeBtn) themeBtn.textContent = '☀️';
            this.saveTheme('dark');
        }
    },

    /**
     * Apply saved theme on page load
     */
    applyTheme() {
        const theme = this.loadTheme();
        const body = document.body;
        const themeBtn = document.querySelector('.btn-theme-toggle');
        
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeBtn) themeBtn.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            if (themeBtn) themeBtn.textContent = '🌙';
        }
    },

    /**
     * Initialize theme toggle button
     */
    initThemeToggle() {
        const themeBtn = document.querySelector('.btn-theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
    },

    /**
     * Initialize the application and all components
     */
    init() {
        // Check Local Storage availability
        if (!this.isLocalStorageAvailable()) {
            console.warn('Local Storage is not available. Data will not persist.');
            this.displayStorageWarning();
        }

        // Apply saved theme
        this.applyTheme();

        // Initialize theme toggle
        this.initThemeToggle();

        // Initialize all components in order
        console.log('Productivity Dashboard initialized');
        GreetingWidget.init();
        FocusTimer.init();
        TaskManager.init();
        QuickLinks.init();
    }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
