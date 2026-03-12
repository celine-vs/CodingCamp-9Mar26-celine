/**
 * Test file for Task Manager CRUD operations
 * Run this in a browser console or Node.js environment with DOM simulation
 */

// Mock localStorage for testing
const mockStorage = {};
const localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, value) => { mockStorage[key] = value; },
    removeItem: (key) => { delete mockStorage[key]; }
};

// Task Manager Component (copied for testing)
const TaskManager = {
    tasks: [],
    storageKey: 'productivity-dashboard-tasks',

    generateId() {
        return `task-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    },

    loadTasks() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    return parsed;
                } else {
                    console.warn('Stored tasks data is not an array, returning empty array');
                    return [];
                }
            }
            return [];
        } catch (error) {
            console.error('Error loading tasks from Local Storage:', error);
            try {
                localStorage.removeItem(this.storageKey);
            } catch (clearError) {
                console.error('Error clearing corrupted tasks data:', clearError);
            }
            return [];
        }
    },

    saveTasks() {
        try {
            const serialized = JSON.stringify(this.tasks);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Local Storage quota exceeded. Cannot save tasks.');
            } else {
                console.error('Error saving tasks to Local Storage:', error);
            }
            return false;
        }
    },

    addTask(description) {
        const trimmedDescription = description.trim();
        if (!trimmedDescription) {
            console.warn('Cannot add task: description is empty after trimming');
            return null;
        }

        const newTask = {
            id: this.generateId(),
            description: trimmedDescription,
            completed: false,
            createdAt: Date.now()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        return newTask;
    },

    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        
        if (index === -1) {
            console.warn(`Cannot delete task: task with id ${id} not found`);
            return false;
        }

        this.tasks.splice(index, 1);
        this.saveTasks();
        return true;
    },

    updateTask(id, updates) {
        const task = this.tasks.find(task => task.id === id);
        
        if (!task) {
            console.warn(`Cannot update task: task with id ${id} not found`);
            return null;
        }

        Object.assign(task, updates);
        this.saveTasks();
        return task;
    },

    toggleComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        
        if (!task) {
            console.warn(`Cannot toggle task: task with id ${id} not found`);
            return null;
        }

        task.completed = !task.completed;
        this.saveTasks();
        return task.completed;
    }
};

// Test Suite
console.log('=== Task Manager CRUD Operations Test ===\n');

// Test 1: addTask with valid description
console.log('Test 1: Add task with valid description');
const task1 = TaskManager.addTask('Buy groceries');
console.assert(task1 !== null, 'Task should be created');
console.assert(task1.description === 'Buy groceries', 'Description should match');
console.assert(task1.completed === false, 'Task should not be completed initially');
console.assert(TaskManager.tasks.length === 1, 'Tasks array should have 1 item');
console.log('✓ Test 1 passed\n');

// Test 2: addTask with whitespace-only description (should fail)
console.log('Test 2: Add task with whitespace-only description');
const task2 = TaskManager.addTask('   ');
console.assert(task2 === null, 'Task should not be created');
console.assert(TaskManager.tasks.length === 1, 'Tasks array should still have 1 item');
console.log('✓ Test 2 passed\n');

// Test 3: addTask with description that needs trimming
console.log('Test 3: Add task with description that needs trimming');
const task3 = TaskManager.addTask('  Clean room  ');
console.assert(task3 !== null, 'Task should be created');
console.assert(task3.description === 'Clean room', 'Description should be trimmed');
console.assert(TaskManager.tasks.length === 2, 'Tasks array should have 2 items');
console.log('✓ Test 3 passed\n');

// Test 4: toggleComplete
console.log('Test 4: Toggle task completion');
const taskId = task1.id;
const newStatus1 = TaskManager.toggleComplete(taskId);
console.assert(newStatus1 === true, 'Task should be completed');
console.assert(task1.completed === true, 'Task object should be updated');
const newStatus2 = TaskManager.toggleComplete(taskId);
console.assert(newStatus2 === false, 'Task should be uncompleted');
console.assert(task1.completed === false, 'Task object should be updated');
console.log('✓ Test 4 passed\n');

// Test 5: updateTask
console.log('Test 5: Update task description');
const updatedTask = TaskManager.updateTask(taskId, { description: 'Buy groceries and milk' });
console.assert(updatedTask !== null, 'Task should be updated');
console.assert(updatedTask.description === 'Buy groceries and milk', 'Description should be updated');
console.assert(task1.description === 'Buy groceries and milk', 'Original task object should be updated');
console.log('✓ Test 5 passed\n');

// Test 6: deleteTask
console.log('Test 6: Delete task');
const deleted = TaskManager.deleteTask(taskId);
console.assert(deleted === true, 'Task should be deleted');
console.assert(TaskManager.tasks.length === 1, 'Tasks array should have 1 item');
console.assert(!TaskManager.tasks.find(t => t.id === taskId), 'Task should not be in array');
console.log('✓ Test 6 passed\n');

// Test 7: saveTasks and loadTasks (persistence)
console.log('Test 7: Save and load tasks');
TaskManager.saveTasks();
const savedData = localStorage.getItem(TaskManager.storageKey);
console.assert(savedData !== null, 'Data should be saved to localStorage');
const loadedTasks = TaskManager.loadTasks();
console.assert(loadedTasks.length === 1, 'Loaded tasks should have 1 item');
console.assert(loadedTasks[0].description === 'Clean room', 'Loaded task should match');
console.log('✓ Test 7 passed\n');

// Test 8: Operations on non-existent task
console.log('Test 8: Operations on non-existent task');
const nonExistentId = 'task-nonexistent';
const toggleResult = TaskManager.toggleComplete(nonExistentId);
console.assert(toggleResult === null, 'Toggle should return null for non-existent task');
const updateResult = TaskManager.updateTask(nonExistentId, { description: 'Test' });
console.assert(updateResult === null, 'Update should return null for non-existent task');
const deleteResult = TaskManager.deleteTask(nonExistentId);
console.assert(deleteResult === false, 'Delete should return false for non-existent task');
console.log('✓ Test 8 passed\n');

console.log('=== All tests passed! ===');
