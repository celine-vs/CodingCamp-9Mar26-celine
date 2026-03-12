/**
 * Simple test script for GreetingWidget functions
 * Run with: node test-greeting.js
 */

// Mock GreetingWidget functions (extracted from app.js)
const GreetingWidget = {
    getGreeting(hour) {
        if (hour >= 5 && hour <= 11) {
            return 'Good Morning';
        } else if (hour >= 12 && hour <= 16) {
            return 'Good Afternoon';
        } else if (hour >= 17 && hour <= 20) {
            return 'Good Evening';
        } else {
            return 'Good Night';
        }
    },

    formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        
        return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
    },

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

// Test suite
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${error.message}`);
        failed++;
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
    }
}

// Run tests
console.log('Running GreetingWidget Tests\n');

// Test getGreeting function
test('getGreeting returns "Good Morning" for hour 5', () => {
    assertEqual(GreetingWidget.getGreeting(5), 'Good Morning', 'Hour 5 should be Morning');
});

test('getGreeting returns "Good Morning" for hour 11', () => {
    assertEqual(GreetingWidget.getGreeting(11), 'Good Morning', 'Hour 11 should be Morning');
});

test('getGreeting returns "Good Afternoon" for hour 12', () => {
    assertEqual(GreetingWidget.getGreeting(12), 'Good Afternoon', 'Hour 12 should be Afternoon');
});

test('getGreeting returns "Good Afternoon" for hour 16', () => {
    assertEqual(GreetingWidget.getGreeting(16), 'Good Afternoon', 'Hour 16 should be Afternoon');
});

test('getGreeting returns "Good Evening" for hour 17', () => {
    assertEqual(GreetingWidget.getGreeting(17), 'Good Evening', 'Hour 17 should be Evening');
});

test('getGreeting returns "Good Evening" for hour 20', () => {
    assertEqual(GreetingWidget.getGreeting(20), 'Good Evening', 'Hour 20 should be Evening');
});

test('getGreeting returns "Good Night" for hour 21', () => {
    assertEqual(GreetingWidget.getGreeting(21), 'Good Night', 'Hour 21 should be Night');
});

test('getGreeting returns "Good Night" for hour 0', () => {
    assertEqual(GreetingWidget.getGreeting(0), 'Good Night', 'Hour 0 should be Night');
});

test('getGreeting returns "Good Night" for hour 4', () => {
    assertEqual(GreetingWidget.getGreeting(4), 'Good Night', 'Hour 4 should be Night');
});

// Test formatTime function
test('formatTime formats 2:30:45 PM correctly', () => {
    const date = new Date('2024-01-15T14:30:45');
    assertEqual(GreetingWidget.formatTime(date), '2:30:45 PM', 'Afternoon time should format correctly');
});

test('formatTime handles midnight (12:30:45 AM)', () => {
    const date = new Date('2024-01-15T00:30:45');
    assertEqual(GreetingWidget.formatTime(date), '12:30:45 AM', 'Midnight should be 12 AM');
});

test('formatTime handles noon (12:30:45 PM)', () => {
    const date = new Date('2024-01-15T12:30:45');
    assertEqual(GreetingWidget.formatTime(date), '12:30:45 PM', 'Noon should be 12 PM');
});

test('formatTime zero-pads minutes and seconds', () => {
    const date = new Date('2024-01-15T09:05:03');
    assertEqual(GreetingWidget.formatTime(date), '9:05:03 AM', 'Should zero-pad single digits');
});

// Test formatDate function
test('formatDate formats Monday, January 15, 2024 correctly', () => {
    const date = new Date('2024-01-15T14:30:45');
    assertEqual(GreetingWidget.formatDate(date), 'Monday, January 15, 2024', 'Date should format correctly');
});

test('formatDate formats Sunday, December 31, 2023 correctly', () => {
    const date = new Date('2023-12-31T14:30:45');
    assertEqual(GreetingWidget.formatDate(date), 'Sunday, December 31, 2023', 'Date should format correctly');
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests Passed: ${passed}`);
console.log(`Tests Failed: ${failed}`);
console.log(`Total Tests: ${passed + failed}`);
console.log(`${'='.repeat(50)}`);

process.exit(failed > 0 ? 1 : 0);
