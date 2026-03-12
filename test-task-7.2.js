/**
 * Test file for Task 7.2: Link CRUD operations with validation
 * Tests validateUrl, addLink, and deleteLink methods
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

// Import the QuickLinks component (simulated - in real scenario would use module import)
const QuickLinks = {
    links: [],
    storageKey: 'productivity-dashboard-links',
    
    generateId() {
        return `link-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    },
    
    loadLinks() {
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
            console.error('Error loading links:', error);
            return [];
        }
    },
    
    saveLinks() {
        try {
            const serialized = JSON.stringify(this.links);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (error) {
            console.error('Error saving links:', error);
            return false;
        }
    },
    
    validateUrl(url) {
        return url.startsWith('http://') || url.startsWith('https://');
    },
    
    addLink(name, url) {
        const trimmedName = name.trim();
        if (!trimmedName) {
            console.warn('Cannot add link: name is empty after trimming');
            return null;
        }
        
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            console.warn('Cannot add link: url is empty after trimming');
            return null;
        }
        
        if (!this.validateUrl(trimmedUrl)) {
            console.warn('Cannot add link: url must start with http:// or https://');
            return null;
        }
        
        const newLink = {
            id: this.generateId(),
            name: trimmedName,
            url: trimmedUrl,
            createdAt: Date.now()
        };
        
        this.links.push(newLink);
        this.saveLinks();
        
        return newLink;
    },
    
    deleteLink(id) {
        const index = this.links.findIndex(link => link.id === id);
        
        if (index === -1) {
            console.warn(`Cannot delete link: link with id ${id} not found`);
            return false;
        }
        
        this.links.splice(index, 1);
        this.saveLinks();
        
        return true;
    }
};

// Test Suite
console.log('=== Testing Task 7.2: Link CRUD Operations with Validation ===\n');

// Test 1: validateUrl with valid http:// URL
console.log('Test 1: validateUrl with valid http:// URL');
const result1 = QuickLinks.validateUrl('http://example.com');
console.log(`Expected: true, Got: ${result1}`);
console.log(result1 === true ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 2: validateUrl with valid https:// URL
console.log('Test 2: validateUrl with valid https:// URL');
const result2 = QuickLinks.validateUrl('https://example.com');
console.log(`Expected: true, Got: ${result2}`);
console.log(result2 === true ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 3: validateUrl with invalid URL (no protocol)
console.log('Test 3: validateUrl with invalid URL (no protocol)');
const result3 = QuickLinks.validateUrl('example.com');
console.log(`Expected: false, Got: ${result3}`);
console.log(result3 === false ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 4: validateUrl with invalid URL (ftp protocol)
console.log('Test 4: validateUrl with invalid URL (ftp protocol)');
const result4 = QuickLinks.validateUrl('ftp://example.com');
console.log(`Expected: false, Got: ${result4}`);
console.log(result4 === false ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 5: addLink with valid name and URL
console.log('Test 5: addLink with valid name and URL');
QuickLinks.links = [];
const link1 = QuickLinks.addLink('Google', 'https://google.com');
console.log(`Expected: link object, Got: ${link1 ? 'link object' : 'null'}`);
console.log(`Link count: ${QuickLinks.links.length}`);
console.log(link1 && QuickLinks.links.length === 1 ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 6: addLink with empty name (should reject)
console.log('Test 6: addLink with empty name (should reject)');
const initialCount = QuickLinks.links.length;
const link2 = QuickLinks.addLink('', 'https://example.com');
console.log(`Expected: null, Got: ${link2}`);
console.log(`Link count unchanged: ${QuickLinks.links.length === initialCount}`);
console.log(link2 === null && QuickLinks.links.length === initialCount ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 7: addLink with whitespace-only name (should reject)
console.log('Test 7: addLink with whitespace-only name (should reject)');
const link3 = QuickLinks.addLink('   ', 'https://example.com');
console.log(`Expected: null, Got: ${link3}`);
console.log(link3 === null ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 8: addLink with empty URL (should reject)
console.log('Test 8: addLink with empty URL (should reject)');
const link4 = QuickLinks.addLink('Test', '');
console.log(`Expected: null, Got: ${link4}`);
console.log(link4 === null ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 9: addLink with invalid URL protocol (should reject)
console.log('Test 9: addLink with invalid URL protocol (should reject)');
const link5 = QuickLinks.addLink('Test', 'example.com');
console.log(`Expected: null, Got: ${link5}`);
console.log(link5 === null ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 10: addLink trims whitespace from name and URL
console.log('Test 10: addLink trims whitespace from name and URL');
const link6 = QuickLinks.addLink('  GitHub  ', '  https://github.com  ');
console.log(`Expected: trimmed values, Got name: "${link6?.name}", url: "${link6?.url}"`);
console.log(link6?.name === 'GitHub' && link6?.url === 'https://github.com' ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 11: addLink calls saveLinks (check localStorage)
console.log('Test 11: addLink calls saveLinks (check localStorage)');
QuickLinks.links = [];
QuickLinks.addLink('Test', 'https://test.com');
const stored = localStorage.getItem(QuickLinks.storageKey);
const parsed = JSON.parse(stored);
console.log(`Expected: 1 link in storage, Got: ${parsed.length}`);
console.log(parsed.length === 1 ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 12: deleteLink removes link from array
console.log('Test 12: deleteLink removes link from array');
QuickLinks.links = [];
const link7 = QuickLinks.addLink('Delete Me', 'https://delete.com');
const beforeCount = QuickLinks.links.length;
const deleted = QuickLinks.deleteLink(link7.id);
console.log(`Expected: true, Got: ${deleted}`);
console.log(`Links before: ${beforeCount}, after: ${QuickLinks.links.length}`);
console.log(deleted === true && QuickLinks.links.length === 0 ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 13: deleteLink returns false for non-existent ID
console.log('Test 13: deleteLink returns false for non-existent ID');
const deleted2 = QuickLinks.deleteLink('non-existent-id');
console.log(`Expected: false, Got: ${deleted2}`);
console.log(deleted2 === false ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 14: deleteLink calls saveLinks (check localStorage)
console.log('Test 14: deleteLink calls saveLinks (check localStorage)');
QuickLinks.links = [];
const link8 = QuickLinks.addLink('Test1', 'https://test1.com');
QuickLinks.addLink('Test2', 'https://test2.com');
QuickLinks.deleteLink(link8.id);
const stored2 = localStorage.getItem(QuickLinks.storageKey);
const parsed2 = JSON.parse(stored2);
console.log(`Expected: 1 link in storage, Got: ${parsed2.length}`);
console.log(parsed2.length === 1 && parsed2[0].name === 'Test2' ? '✓ PASS' : '✗ FAIL');
console.log();

// Test 15: Multiple operations maintain data integrity
console.log('Test 15: Multiple operations maintain data integrity');
QuickLinks.links = [];
const link9 = QuickLinks.addLink('Link1', 'https://link1.com');
const link10 = QuickLinks.addLink('Link2', 'https://link2.com');
const link11 = QuickLinks.addLink('Link3', 'https://link3.com');
QuickLinks.deleteLink(link10.id);
console.log(`Expected: 2 links remaining, Got: ${QuickLinks.links.length}`);
console.log(`Remaining links: ${QuickLinks.links.map(l => l.name).join(', ')}`);
const hasLink1 = QuickLinks.links.some(l => l.id === link9.id);
const hasLink3 = QuickLinks.links.some(l => l.id === link11.id);
const noLink2 = !QuickLinks.links.some(l => l.id === link10.id);
console.log(QuickLinks.links.length === 2 && hasLink1 && hasLink3 && noLink2 ? '✓ PASS' : '✗ FAIL');
console.log();

console.log('=== All Tests Complete ===');
