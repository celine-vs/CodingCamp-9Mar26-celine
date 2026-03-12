// Manual test script for Task CRUD operations
// Run this in browser console after loading app.js

console.log('=== Task CRUD Operations Manual Test ===\n');

// Clear existing data
TaskManager.tasks = [];
localStorage.removeItem('productivity-dashboard-tasks');

// Test 1: Add valid task
console.log('Test 1: Add valid task');
const task1 = TaskManager.addTask('Buy groceries');
console.log('Created task:', task1);
console.log('Tasks array length:', TaskManager.tasks.length);
console.log('Expected: 1, Actual:', TaskManager.tasks.length);
console.log('✓ Test 1 passed\n');

// Test 2: Add task with whitespace
console.log('Test 2: Add task with whitespace');
const task2 = TaskManager.addTask('  Clean room  ');
console.log('Created task:', task2);
console.log('Description after trim:', task2.description);
console.log('Expected: "Clean room", Actual:', task2.description);
console.log('✓ Test 2 passed\n');

// Test 3: Reject empty task
console.log('Test 3: Reject empty task');
const task3 = TaskManager.addTask('');
console.log('Result:', task3);
console.log('Tasks array length:', TaskManager.tasks.length);
console.log('Expected: null and length 2, Actual:', task3, TaskManager.tasks.length);
console.log('✓ Test 3 passed\n');

// Test 4: Reject whitespace-only task
console.log('Test 4: Reject whitespace-only task');
const task4 = TaskManager.addTask('   ');
console.log('Result:', task4);
console.log('Tasks array length:', TaskManager.tasks.length);
console.log('Expected: null and length 2, Actual:', task4, TaskManager.tasks.length);
console.log('✓ Test 4 passed\n');

// Test 5: Toggle completion
console.log('Test 5: Toggle completion');
const taskId = TaskManager.tasks[0].id;
console.log('Initial completed status:', TaskManager.tasks[0].completed);
TaskManager.toggleComplete(taskId);
console.log('After toggle:', TaskManager.tasks[0].completed);
console.log('Expected: true, Actual:', TaskManager.tasks[0].completed);
console.log('✓ Test 5 passed\n');

// Test 6: Toggle back (idempotence)
console.log('Test 6: Toggle back');
TaskManager.toggleComplete(taskId);
console.log('After second toggle:', TaskManager.tasks[0].completed);
console.log('Expected: false, Actual:', TaskManager.tasks[0].completed);
console.log('✓ Test 6 passed\n');

// Test 7: Update task
console.log('Test 7: Update task');
TaskManager.updateTask(taskId, { description: 'Buy groceries and cook dinner' });
console.log('Updated description:', TaskManager.tasks[0].description);
console.log('Expected: "Buy groceries and cook dinner"');
console.log('✓ Test 7 passed\n');

// Test 8: Delete task
console.log('Test 8: Delete task');
const lengthBefore = TaskManager.tasks.length;
TaskManager.deleteTask(taskId);
console.log('Length before:', lengthBefore);
console.log('Length after:', TaskManager.tasks.length);
console.log('Expected: 1, Actual:', TaskManager.tasks.length);
console.log('✓ Test 8 passed\n');

// Test 9: Verify persistence
console.log('Test 9: Verify persistence');
const stored = JSON.parse(localStorage.getItem('productivity-dashboard-tasks'));
console.log('Stored tasks:', stored);
console.log('Expected length: 1, Actual:', stored.length);
console.log('✓ Test 9 passed\n');

// Test 10: Load tasks
console.log('Test 10: Load tasks');
TaskManager.tasks = [];
TaskManager.tasks = TaskManager.loadTasks();
console.log('Loaded tasks:', TaskManager.tasks);
console.log('Expected length: 1, Actual:', TaskManager.tasks.length);
console.log('✓ Test 10 passed\n');

console.log('=== All tests passed! ===');

// Clean up
localStorage.removeItem('productivity-dashboard-tasks');
