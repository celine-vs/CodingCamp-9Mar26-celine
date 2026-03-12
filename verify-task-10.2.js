/**
 * Task 10.2 Verification Script
 * Verifies that the Greeting Widget has proper styling applied
 */

console.log('=== Task 10.2: Greeting Widget Styling Verification ===\n');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runVerification);
} else {
    runVerification();
}

function runVerification() {
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    // Test 1: Greeting widget container exists
    const greetingWidget = document.querySelector('.greeting-widget');
    test('Greeting widget container exists', greetingWidget !== null, results);

    if (!greetingWidget) {
        displayResults(results);
        return;
    }

    // Test 2: Time display element exists
    const timeDisplay = greetingWidget.querySelector('.time-display');
    test('Time display element exists', timeDisplay !== null, results);

    // Test 3: Date display element exists
    const dateDisplay = greetingWidget.querySelector('.date-display');
    test('Date display element exists', dateDisplay !== null, results);

    // Test 4: Greeting message element exists
    const greetingMessage = greetingWidget.querySelector('.greeting-message');
    test('Greeting message element exists', greetingMessage !== null, results);

    // Get computed styles
    const widgetStyles = window.getComputedStyle(greetingWidget);
    const timeStyles = timeDisplay ? window.getComputedStyle(timeDisplay) : null;
    const dateStyles = dateDisplay ? window.getComputedStyle(dateDisplay) : null;
    const greetingStyles = greetingMessage ? window.getComputedStyle(greetingMessage) : null;

    // Test 5: Widget uses flexbox layout
    test('Widget uses flexbox layout', 
        widgetStyles.display === 'flex', results);

    // Test 6: Widget has flex-direction column
    test('Widget has flex-direction: column',
        widgetStyles.flexDirection === 'column', results);

    // Test 7: Widget has center alignment
    test('Widget has center alignment',
        widgetStyles.alignItems === 'center', results);

    // Test 8: Widget has gap spacing
    test('Widget has gap spacing',
        widgetStyles.gap !== '0px' && widgetStyles.gap !== '', results);

    if (timeStyles) {
        // Test 9: Time display has large font size (>= 3rem)
        const timeFontSize = parseFloat(timeStyles.fontSize);
        test('Time display has large font size (>= 3rem)',
            timeFontSize >= 48, results); // 3rem = 48px at default 16px base

        // Test 10: Time display is bold
        test('Time display is bold',
            parseInt(timeStyles.fontWeight) >= 700, results);

        // Test 11: Time display has letter spacing
        test('Time display has letter spacing',
            timeStyles.letterSpacing !== 'normal' && timeStyles.letterSpacing !== '0px', results);

        // Test 12: Time display has text shadow
        test('Time display has text shadow',
            timeStyles.textShadow !== 'none', results);
    }

    if (dateStyles) {
        // Test 13: Date display has medium font size
        const dateFontSize = parseFloat(dateStyles.fontSize);
        test('Date display has medium font size (1-1.5rem)',
            dateFontSize >= 16 && dateFontSize <= 24, results);

        // Test 14: Date display has opacity
        test('Date display has opacity < 1',
            parseFloat(dateStyles.opacity) < 1, results);
    }

    if (greetingStyles) {
        // Test 15: Greeting message has large font size
        const greetingFontSize = parseFloat(greetingStyles.fontSize);
        test('Greeting message has large font size (>= 1.5rem)',
            greetingFontSize >= 24, results);

        // Test 16: Greeting message is bold/semi-bold
        test('Greeting message is bold/semi-bold',
            parseInt(greetingStyles.fontWeight) >= 600, results);

        // Test 17: Greeting message is italic
        test('Greeting message is italic',
            greetingStyles.fontStyle === 'italic', results);

        // Test 18: Greeting message has text shadow
        test('Greeting message has text shadow',
            greetingStyles.textShadow !== 'none', results);
    }

    displayResults(results);
}

function test(description, condition, results) {
    const status = condition ? '✅ PASS' : '❌ FAIL';
    const result = { description, status, passed: condition };
    results.tests.push(result);
    
    if (condition) {
        results.passed++;
    } else {
        results.failed++;
    }
    
    console.log(`${status}: ${description}`);
}

function displayResults(results) {
    console.log('\n=== Test Summary ===');
    console.log(`Total Tests: ${results.tests.length}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);
    
    if (results.failed === 0) {
        console.log('\n🎉 All tests passed! Task 10.2 styling is correctly implemented.');
    } else {
        console.log('\n⚠️ Some tests failed. Please review the styling.');
    }
}
