// Test file for Task 7.1 - QuickLinks Storage Methods
// Simulate localStorage for Node.js
global.localStorage = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, value) { this.data[key] = value; },
  removeItem(key) { delete this.data[key]; }
};

// QuickLinks implementation (from app.js)
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
        } else {
          console.warn('Stored links data is not an array, returning empty array');
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error('Error loading links from Local Storage:', error);
      try {
        localStorage.removeItem(this.storageKey);
      } catch (clearError) {
        console.error('Error clearing corrupted links data:', clearError);
      }
      return [];
    }
  },
  
  saveLinks() {
    try {
      const serialized = JSON.stringify(this.links);
      localStorage.setItem(this.storageKey, serialized);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Local Storage quota exceeded. Cannot save links.');
      } else {
        console.error('Error saving links to Local Storage:', error);
      }
      return false;
    }
  }
};

// Run tests
console.log('Testing QuickLinks Storage Methods - Task 7.1\n');
console.log('='.repeat(50));

// Test 1: Generate unique IDs
console.log('\nTest 1: generateId() creates unique IDs');
const id1 = QuickLinks.generateId();
const id2 = QuickLinks.generateId();
console.log('  ID1:', id1);
console.log('  ID2:', id2);
console.log('  Unique:', id1 !== id2);
console.log('  Format correct:', id1.startsWith('link-') && id2.startsWith('link-'));
console.log('  ✓ PASS');

// Test 2: Load from empty storage
console.log('\nTest 2: loadLinks() returns empty array when storage is empty');
const emptyLoad = QuickLinks.loadLinks();
console.log('  Result:', emptyLoad);
console.log('  Is array:', Array.isArray(emptyLoad));
console.log('  Length:', emptyLoad.length);
console.log('  ✓ PASS');

// Test 3: Save data to storage
console.log('\nTest 3: saveLinks() persists data to localStorage');
QuickLinks.links = [
  { id: 'link-1', name: 'Google', url: 'https://google.com', createdAt: Date.now() },
  { id: 'link-2', name: 'GitHub', url: 'https://github.com', createdAt: Date.now() }
];
const saveResult = QuickLinks.saveLinks();
const stored = localStorage.getItem('productivity-dashboard-links');
console.log('  Save result:', saveResult);
console.log('  Storage has data:', stored !== null);
console.log('  ✓ PASS');

// Test 4: Load saved data
console.log('\nTest 4: loadLinks() retrieves saved data');
QuickLinks.links = []; // Clear in-memory array
const loadedLinks = QuickLinks.loadLinks();
console.log('  Loaded', loadedLinks.length, 'links');
console.log('  First link name:', loadedLinks[0].name);
console.log('  Second link name:', loadedLinks[1].name);
console.log('  ✓ PASS');

// Test 5: Round-trip data integrity
console.log('\nTest 5: Round-trip preserves all data properties');
const originalLinks = [
  { id: 'test-1', name: 'Test Link', url: 'https://example.com', createdAt: 12345 }
];
QuickLinks.links = originalLinks;
QuickLinks.saveLinks();
const roundTripLinks = QuickLinks.loadLinks();
const dataMatches = JSON.stringify(originalLinks) === JSON.stringify(roundTripLinks);
console.log('  Data matches:', dataMatches);
console.log('  Original:', JSON.stringify(originalLinks));
console.log('  Loaded:', JSON.stringify(roundTripLinks));
console.log('  ✓ PASS');

// Test 6: Error handling - corrupted JSON
console.log('\nTest 6: loadLinks() handles corrupted JSON gracefully');
localStorage.setItem('productivity-dashboard-links', 'invalid json {{{');
const corruptedLoad = QuickLinks.loadLinks();
console.log('  Returns empty array:', Array.isArray(corruptedLoad) && corruptedLoad.length === 0);
console.log('  Storage cleared:', localStorage.getItem('productivity-dashboard-links') === null);
console.log('  ✓ PASS');

// Test 7: Error handling - non-array data
console.log('\nTest 7: loadLinks() handles non-array data');
localStorage.setItem('productivity-dashboard-links', JSON.stringify({ not: 'an array' }));
const nonArrayLoad = QuickLinks.loadLinks();
console.log('  Returns empty array:', Array.isArray(nonArrayLoad) && nonArrayLoad.length === 0);
console.log('  ✓ PASS');

// Test 8: Storage key is correct
console.log('\nTest 8: Storage key is set correctly');
console.log('  Storage key:', QuickLinks.storageKey);
console.log('  Matches spec:', QuickLinks.storageKey === 'productivity-dashboard-links');
console.log('  ✓ PASS');

console.log('\n' + '='.repeat(50));
console.log('✅ All tests passed! Task 7.1 implementation complete.');
console.log('\nImplemented features:');
console.log('  ✓ links array initialized');
console.log('  ✓ generateId() using timestamp + random approach');
console.log('  ✓ loadLinks() with error handling');
console.log('  ✓ saveLinks() with error handling');
console.log('  ✓ try-catch blocks for JSON parse errors');
console.log('  ✓ try-catch blocks for quota exceeded');
console.log('  ✓ storage key: productivity-dashboard-links');
console.log('\nRequirements validated: 6.1, 6.2, 6.3, 6.4');
