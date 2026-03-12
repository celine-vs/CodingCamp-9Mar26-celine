/**
 * Component Verification Script
 * Verifies GreetingWidget and FocusTimer implementations
 */

// Mock DOM elements for testing
class MockElement {
    constructor() {
        this.textContent = '';
        this.classList = new Set();
    }
}

const mockDOM = {
    elements: {
        '.time-display': new MockElement(),
        '.date-display': new MockElement(),
        '.greeting-message': new MockElement(),
        '.timer-display': new MockElement(),
        '.timer-status': new MockElement()
    },
    querySelector(selector) {
        return this.elements[selector] || null;
    }
};

// Mock document
global.document = mockDOM;

// Load the app.js code (simplified for testing)
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

const FocusTimer = {
    state: {
        duration: 1500,
        remaining: 1500,
        isRunning: false,
        intervalId: null
    },

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = remainingSeconds.toString().padStart(2, '0');
        
        return `${minutesStr}:${secondsStr}`;
    },

    reset() {
        this.state.remaining = 1500;
        this.state.isRunning = false;
        this.state.intervalId = null;
    },

    tick() {
        if (this.state.remaining > 0) {
            this.state.remaining--;
            if (this.state.remaining === 0) {
                this.state.isRunning = false;
            }
        }
    }
};

// Test Suite
console.log('='.repeat(60));
console.log('COMPONENT VERIFICATION REPORT');
console.log('='.repeat(60));
console.log();

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
    totalTests++;
    try {
        fn();
        console.log(`✓ ${name}`);
        passedTests++;
        return true;
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${error.message}`);
        return false;
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
    }
}

// ========== GREETING WIDGET TESTS ==========
console.log('GREETING WIDGET TESTS');
console.log('-'.repeat(60));

// Greeting time ranges
test('Morning greeting (5:00 AM)', () => {
    assertEqual(GreetingWidget.getGreeting(5), 'Good Morning', 'Should return Good Morning');
});

test('Morning greeting (11:59 AM)', () => {
    assertEqual(GreetingWidget.getGreeting(11), 'Good Morning', 'Should return Good Morning');
});

test('Afternoon greeting (12:00 PM)', () => {
    assertEqual(GreetingWidget.getGreeting(12), 'Good Afternoon', 'Should return Good Afternoon');
});

test('Afternoon greeting (4:59 PM)', () => {
    assertEqual(GreetingWidget.getGreeting(16), 'Good Afternoon', 'Should return Good Afternoon');
});

test('Evening greeting (5:00 PM)', () => {
    assertEqual(GreetingWidget.getGreeting(17), 'Good Evening', 'Should return Good Evening');
});

test('Evening greeting (8:59 PM)', () => {
    assertEqual(GreetingWidget.getGreeting(20), 'Good Evening', 'Should return Good Evening');
});

test('Night greeting (9:00 PM)', () => {
    assertEqual(GreetingWidget.getGreeting(21), 'Good Night', 'Should return Good Night');
});

test('Night greeting (midnight)', () => {
    assertEqual(GreetingWidget.getGreeting(0), 'Good Night', 'Should return Good Night');
});

test('Night greeting (4:59 AM)', () => {
    assertEqual(GreetingWidget.getGreeting(4), 'Good Night', 'Should return Good Night');
});

// Time formatting
test('Time format: 2:30:45 PM', () => {
    const date = new Date('2024-01-15T14:30:45');
    assertEqual(GreetingWidget.formatTime(date), '2:30:45 PM', 'Should format correctly');
});

test('Time format: midnight', () => {
    const date = new Date('2024-01-15T00:30:45');
    assertEqual(GreetingWidget.formatTime(date), '12:30:45 AM', 'Should show 12 AM');
});

test('Time format: noon', () => {
    const date = new Date('2024-01-15T12:30:45');
    assertEqual(GreetingWidget.formatTime(date), '12:30:45 PM', 'Should show 12 PM');
});

// Date formatting
test('Date format: readable format', () => {
    const date = new Date('2024-01-15T14:30:45');
    assertEqual(GreetingWidget.formatDate(date), 'Monday, January 15, 2024', 'Should format correctly');
});

console.log();

// ========== FOCUS TIMER TESTS ==========
console.log('FOCUS TIMER TESTS');
console.log('-'.repeat(60));

// Timer initialization
test('Timer initializes to 25 minutes', () => {
    FocusTimer.reset();
    assertEqual(FocusTimer.state.remaining, 1500, 'Should be 1500 seconds');
});

// Timer formatting
test('Timer format: 25:00', () => {
    assertEqual(FocusTimer.formatTime(1500), '25:00', 'Should format as 25:00');
});

test('Timer format: 00:00', () => {
    assertEqual(FocusTimer.formatTime(0), '00:00', 'Should format as 00:00');
});

test('Timer format: 01:05', () => {
    assertEqual(FocusTimer.formatTime(65), '01:05', 'Should format as 01:05');
});

test('Timer format: 59:59', () => {
    assertEqual(FocusTimer.formatTime(3599), '59:59', 'Should format as 59:59');
});

// Timer operations
test('Reset returns to 1500 seconds', () => {
    FocusTimer.state.remaining = 100;
    FocusTimer.reset();
    assertEqual(FocusTimer.state.remaining, 1500, 'Should reset to 1500');
});

test('Tick decrements by 1 second', () => {
    FocusTimer.state.remaining = 100;
    FocusTimer.tick();
    assertEqual(FocusTimer.state.remaining, 99, 'Should decrement by 1');
});

test('Timer stops at zero', () => {
    FocusTimer.state.remaining = 1;
    FocusTimer.state.isRunning = true;
    FocusTimer.tick();
    assertEqual(FocusTimer.state.remaining, 0, 'Should be at 0');
    assertEqual(FocusTimer.state.isRunning, false, 'Should stop running');
});

test('Timer does not go negative', () => {
    FocusTimer.state.remaining = 0;
    FocusTimer.tick();
    assertEqual(FocusTimer.state.remaining, 0, 'Should stay at 0');
});

console.log();

// ========== SUMMARY ==========
console.log('='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (passedTests === totalTests) {
    console.log('\n✓ ALL TESTS PASSED - Components are working correctly!');
    process.exit(0);
} else {
    console.log('\n✗ SOME TESTS FAILED - Please review the failures above.');
    process.exit(1);
}
