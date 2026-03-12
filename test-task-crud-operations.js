/**
 * Test file for Task 5.2: Task CRUD Operations
 * Tests addTask, deleteTask, updateTask, and toggleComplete methods
 */

// Mock localStorage for testing
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

// Replace global localStorage with mock
global.localStorage = mockLocalStorage;

// Import TaskManager (simulate the component)
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
                }
            }
            return [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    },

    saveTasks() {
        try {
            const serialized = JSON.stringify(this.tasks);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (error) {
            console.error('Error saving tasks:', error);
            return false;
        }
    },

    addTask(description) {
        const trimmedDescription = description.trim();
        if (!trimmedDescription) {
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
            return false;
        }
        this.tasks.splice(index, 1);
        this.saveTasks();
        return true;
    },

    updateTask(id, updates) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            return null;
        }
        Object.assign(task, updates);
        this.saveTasks();
        return task;
    },

    toggleComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            return null;
        }
        task.completed = !task.completed;
        this.saveTasks();
        return task.completed;
    }
};

// Test Suite
console.log('=== Testing Task CRUD Operations (Task 5.2) ===\n');

let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
    try {
        // Reset state before each test
        TaskManager.tasks = [];
        mockLocalStorage.clear();
        
        fn();
        console.log(`✓ ${description}`);
        testsPassed++;
    } catch (error) {
        console.log(`✗ ${description}`);
        console.log(`  Error: ${error.message}`);
        testsFailed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

// Test addTask
test('addTask: Creates task with valid description', () => {
    const task = TaskManager.addTask('Buy groceries');
    assert(task !== null, 'Task should be created');
    assert(task.description === 'Buy groceries', 'Description should match');
    assert(task.completed === false, 'Task should not be completed initially');
    assert(typeof task.id === 'string', 'Task should have an ID');
    assert(typeof task.createdAt === 'number', 'Task should have createdAt timestamp');
});

test('addTask: Trims whitespace from description', () => {
    const task = TaskManager.addTask('  Trimmed task  ');
    assert(task !== null, 'Task should be created');
    assert(task.description === 'Trimmed task', 'Description should be trimmed');
});

test('addTask: Rejects empty description', () => {
    const task = TaskManager.addTask('');
    assert(task === null, 'Empty description should be rejected');
    assert(TaskManager.tasks.length === 0, 'No task should be added');
});

test('addTask: Rejects whitespace-only description', () => {
    const task = TaskManager.addTask('   ');
    assert(task === null, 'Whitespace-only description should be rejected');
    assert(TaskManager.tasks.length === 0, 'No task should be added');
});

test('addTask: Increases task list size by one', () => {
    TaskManager.addTask('Task 1');
    assert(TaskManager.tasks.length === 1, 'List should have 1 task');
    TaskManager.addTask('Task 2');
    assert(TaskManager.tasks.length === 2, 'List should have 2 tasks');
});

test('addTask: Calls saveTasks and persists to storage', () => {
    TaskManager.addTask('Persistent task');
    const stored = localStorage.getItem(TaskManager.storageKey);
    assert(stored !== null, 'Tasks should be saved to storage');
    const parsed = JSON.parse(stored);
    assert(parsed.length === 1, 'Storage should contain 1 task');
    assert(parsed[0].description === 'Persistent task', 'Stored task should match');
});

// Test deleteTask
test('deleteTask: Removes task from array', () => {
    const task = TaskManager.addTask('Task to delete');
    assert(TaskManager.tasks.length === 1, 'Should have 1 task');
    const result = TaskManager.deleteTask(task.id);
    assert(result === true, 'Delete should return true');
    assert(TaskManager.tasks.length === 0, 'Task should be removed');
});

test('deleteTask: Returns false for non-existent task', () => {
    const result = TaskManager.deleteTask('non-existent-id');
    assert(result === false, 'Delete should return false for non-existent task');
});

test('deleteTask: Removes task from storage', () => {
    const task = TaskManager.addTask('Task to delete');
    TaskManager.deleteTask(task.id);
    const stored = localStorage.getItem(TaskManager.storageKey);
    const parsed = JSON.parse(stored);
    assert(parsed.length === 0, 'Storage should be empty after deletion');
});

test('deleteTask: Only removes specified task', () => {
    const task1 = TaskManager.addTask('Task 1');
    const task2 = TaskManager.addTask('Task 2');
    const task3 = TaskManager.addTask('Task 3');
    
    TaskManager.deleteTask(task2.id);
    assert(TaskManager.tasks.length === 2, 'Should have 2 tasks remaining');
    assert(TaskManager.tasks.find(t => t.id === task1.id), 'Task 1 should remain');
    assert(TaskManager.tasks.find(t => t.id === task3.id), 'Task 3 should remain');
    assert(!TaskManager.tasks.find(t => t.id === task2.id), 'Task 2 should be removed');
});

// Test updateTask
test('updateTask: Updates task description', () => {
    const task = TaskManager.addTask('Original description');
    const updated = TaskManager.updateTask(task.id, { description: 'Updated description' });
    assert(updated !== null, 'Update should return task');
    assert(updated.description === 'Updated description', 'Description should be updated');
    assert(TaskManager.tasks[0].description === 'Updated description', 'Task in array should be updated');
});

test('updateTask: Updates task completion status', () => {
    const task = TaskManager.addTask('Task to complete');
    const updated = TaskManager.updateTask(task.id, { completed: true });
    assert(updated.completed === true, 'Task should be marked completed');
});

test('updateTask: Updates multiple properties', () => {
    const task = TaskManager.addTask('Original task');
    const updated = TaskManager.updateTask(task.id, { 
        description: 'Modified task',
        completed: true
    });
    assert(updated.description === 'Modified task', 'Description should be updated');
    assert(updated.completed === true, 'Completion should be updated');
});

test('updateTask: Returns null for non-existent task', () => {
    const result = TaskManager.updateTask('non-existent-id', { description: 'Test' });
    assert(result === null, 'Update should return null for non-existent task');
});

test('updateTask: Persists changes to storage', () => {
    const task = TaskManager.addTask('Task to update');
    TaskManager.updateTask(task.id, { description: 'Updated in storage' });
    const stored = localStorage.getItem(TaskManager.storageKey);
    const parsed = JSON.parse(stored);
    assert(parsed[0].description === 'Updated in storage', 'Storage should reflect update');
});

// Test toggleComplete
test('toggleComplete: Flips completion status from false to true', () => {
    const task = TaskManager.addTask('Task to toggle');
    assert(task.completed === false, 'Task should start uncompleted');
    const newStatus = TaskManager.toggleComplete(task.id);
    assert(newStatus === true, 'Toggle should return true');
    assert(TaskManager.tasks[0].completed === true, 'Task should be completed');
});

test('toggleComplete: Flips completion status from true to false', () => {
    const task = TaskManager.addTask('Task to toggle');
    TaskManager.updateTask(task.id, { completed: true });
    const newStatus = TaskManager.toggleComplete(task.id);
    assert(newStatus === false, 'Toggle should return false');
    assert(TaskManager.tasks[0].completed === false, 'Task should be uncompleted');
});

test('toggleComplete: Toggling twice returns to original state (idempotence)', () => {
    const task = TaskManager.addTask('Task to toggle twice');
    const original = task.completed;
    TaskManager.toggleComplete(task.id);
    TaskManager.toggleComplete(task.id);
    assert(TaskManager.tasks[0].completed === original, 'Should return to original state');
});

test('toggleComplete: Returns null for non-existent task', () => {
    const result = TaskManager.toggleComplete('non-existent-id');
    assert(result === null, 'Toggle should return null for non-existent task');
});

test('toggleComplete: Persists changes to storage', () => {
    const task = TaskManager.addTask('Task to toggle');
    TaskManager.toggleComplete(task.id);
    const stored = localStorage.getItem(TaskManager.storageKey);
    const parsed = JSON.parse(stored);
    assert(parsed[0].completed === true, 'Storage should reflect toggle');
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log(`Total Tests: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
    console.log('\n✓ All tests passed! Task 5.2 implementation is correct.');
} else {
    console.log('\n✗ Some tests failed. Please review the implementation.');
    process.exit(1);
}
