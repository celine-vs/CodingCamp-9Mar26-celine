/**
 * Test Task 7.3 - Link Rendering Methods
 * Tests renderLinks() and renderLink() methods
 */

// Mock DOM environment
class MockElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.className = '';
        this.textContent = '';
        this.children = [];
        this.attributes = {};
        this.innerHTML = '';
    }

    appendChild(child) {
        this.children.push(child);
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name] || null;
    }

    querySelector(selector) {
        // Simple mock implementation
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            return this.children.find(child => child.className === className);
        }
        return null;
    }

    querySelectorAll(selector) {
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            return this.children.filter(child => child.className === className);
        }
        return [];
    }

    get classList() {
        return {
            contains: (className) => this.className.includes(className),
            add: (className) => {
                if (!this.className.includes(className)) {
                    this.className += (this.className ? ' ' : '') + className;
                }
            }
        };
    }
}

// Mock document
const document = {
    createElement: (tagName) => new MockElement(tagName),
    querySelector: (selector) => {
        if (selector === '.links-container') {
            return mockLinksContainer;
        }
        return null;
    }
};

// Mock links container
let mockLinksContainer = new MockElement('div');
mockLinksContainer.className = 'links-container';

// QuickLinks component (simplified for testing)
const QuickLinks = {
    links: [],

    renderLinks() {
        const linksContainer = document.querySelector('.links-container');
        if (!linksContainer) {
            console.warn('Links container element not found in DOM');
            return;
        }

        // Clear existing link items
        linksContainer.innerHTML = '';
        linksContainer.children = [];

        // Render each link in order
        this.links.forEach(link => {
            const linkElement = this.renderLink(link);
            linksContainer.appendChild(linkElement);
        });
    },

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
        anchor.textContent = link.name;
        anchor.setAttribute('rel', 'noopener noreferrer');

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn-delete-link';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('aria-label', `Delete link: ${link.name}`);

        // Append elements to link item
        linkItem.appendChild(anchor);
        linkItem.appendChild(deleteButton);

        return linkItem;
    }
};

// Test functions
function test1_renderLink_creates_correct_structure() {
    console.log('\n=== Test 1: renderLink() creates correct DOM structure ===');
    
    const testLink = {
        id: 'test-1',
        name: 'Test Link',
        url: 'https://example.com',
        createdAt: Date.now()
    };

    const linkElement = QuickLinks.renderLink(testLink);
    
    const hasLinkItem = linkElement.classList.contains('link-item');
    const hasAnchor = linkElement.children.some(child => child.tagName === 'a');
    const hasDeleteBtn = linkElement.children.some(child => child.className === 'btn-delete-link');
    
    console.log(`  - Has link-item class: ${hasLinkItem ? '✓' : '✗'}`);
    console.log(`  - Has anchor element: ${hasAnchor ? '✓' : '✗'}`);
    console.log(`  - Has delete button: ${hasDeleteBtn ? '✓' : '✗'}`);
    
    const passed = hasLinkItem && hasAnchor && hasDeleteBtn;
    console.log(`  Result: ${passed ? '✓ PASS' : '✗ FAIL'}`);
    
    return passed;
}

function test2_renderLink_sets_correct_attributes() {
    console.log('\n=== Test 2: renderLink() sets correct attributes ===');
    
    const testLink = {
        id: 'test-2',
        name: 'GitHub',
        url: 'https://github.com',
        createdAt: Date.now()
    };

    const linkElement = QuickLinks.renderLink(testLink);
    const anchor = linkElement.children.find(child => child.tagName === 'a');
    
    const hasCorrectHref = anchor.href === 'https://github.com';
    const hasTargetBlank = anchor.target === '_blank';
    const hasCorrectName = anchor.textContent === 'GitHub';
    const hasDataLinkId = linkElement.getAttribute('data-link-id') === 'test-2';
    const hasRelAttribute = anchor.getAttribute('rel') === 'noopener noreferrer';
    
    console.log(`  - href: ${hasCorrectHref ? '✓' : '✗'} (${anchor.href})`);
    console.log(`  - target: ${hasTargetBlank ? '✓' : '✗'} (${anchor.target})`);
    console.log(`  - name: ${hasCorrectName ? '✓' : '✗'} (${anchor.textContent})`);
    console.log(`  - data-link-id: ${hasDataLinkId ? '✓' : '✗'} (${linkElement.getAttribute('data-link-id')})`);
    console.log(`  - rel: ${hasRelAttribute ? '✓' : '✗'} (${anchor.getAttribute('rel')})`);
    
    const passed = hasCorrectHref && hasTargetBlank && hasCorrectName && hasDataLinkId && hasRelAttribute;
    console.log(`  Result: ${passed ? '✓ PASS' : '✗ FAIL'}`);
    
    return passed;
}

function test3_renderLinks_renders_multiple_links() {
    console.log('\n=== Test 3: renderLinks() renders multiple links ===');
    
    // Reset container
    mockLinksContainer = new MockElement('div');
    mockLinksContainer.className = 'links-container';
    
    QuickLinks.links = [
        { id: 'link-1', name: 'Google', url: 'https://google.com', createdAt: Date.now() },
        { id: 'link-2', name: 'GitHub', url: 'https://github.com', createdAt: Date.now() },
        { id: 'link-3', name: 'Stack Overflow', url: 'https://stackoverflow.com', createdAt: Date.now() }
    ];

    QuickLinks.renderLinks();

    const linkItems = mockLinksContainer.children.filter(child => child.className === 'link-item');
    
    console.log(`  - Expected 3 links, rendered ${linkItems.length}`);
    
    const passed = linkItems.length === 3;
    console.log(`  Result: ${passed ? '✓ PASS' : '✗ FAIL'}`);
    
    return passed;
}

function test4_renderLinks_clears_existing_content() {
    console.log('\n=== Test 4: renderLinks() clears existing content ===');
    
    // Reset container with old content
    mockLinksContainer = new MockElement('div');
    mockLinksContainer.className = 'links-container';
    mockLinksContainer.innerHTML = 'Old content';
    mockLinksContainer.children = [new MockElement('div'), new MockElement('div')];

    QuickLinks.links = [
        { id: 'link-4', name: 'New Link', url: 'https://example.com', createdAt: Date.now() }
    ];

    QuickLinks.renderLinks();

    const linkItems = mockLinksContainer.children.filter(child => child.className === 'link-item');
    const hasOldContent = mockLinksContainer.innerHTML === 'Old content';
    
    console.log(`  - innerHTML cleared: ${!hasOldContent ? '✓' : '✗'}`);
    console.log(`  - Children array cleared and repopulated: ${linkItems.length === 1 ? '✓' : '✗'}`);
    
    const passed = linkItems.length === 1 && !hasOldContent;
    console.log(`  Result: ${passed ? '✓ PASS' : '✗ FAIL'}`);
    
    return passed;
}

function test5_delete_button_has_correct_symbol() {
    console.log('\n=== Test 5: Delete button has × symbol ===');
    
    const testLink = {
        id: 'test-5',
        name: 'Test Link',
        url: 'https://example.com',
        createdAt: Date.now()
    };

    const linkElement = QuickLinks.renderLink(testLink);
    const deleteBtn = linkElement.children.find(child => child.className === 'btn-delete-link');
    
    const hasCorrectSymbol = deleteBtn.textContent === '×';
    const hasAriaLabel = deleteBtn.getAttribute('aria-label') !== null;
    const ariaLabelIncludesName = deleteBtn.getAttribute('aria-label').includes('Test Link');
    
    console.log(`  - Symbol is ×: ${hasCorrectSymbol ? '✓' : '✗'} (${deleteBtn.textContent})`);
    console.log(`  - Has aria-label: ${hasAriaLabel ? '✓' : '✗'}`);
    console.log(`  - aria-label includes link name: ${ariaLabelIncludesName ? '✓' : '✗'} (${deleteBtn.getAttribute('aria-label')})`);
    
    const passed = hasCorrectSymbol && hasAriaLabel && ariaLabelIncludesName;
    console.log(`  Result: ${passed ? '✓ PASS' : '✗ FAIL'}`);
    
    return passed;
}

function test6_data_link_id_attribute() {
    console.log('\n=== Test 6: data-link-id attribute is set correctly ===');
    
    const testLink = {
        id: 'unique-test-id-123',
        name: 'Test Link',
        url: 'https://example.com',
        createdAt: Date.now()
    };

    const linkElement = QuickLinks.renderLink(testLink);
    const dataLinkId = linkElement.getAttribute('data-link-id');
    
    const hasAttribute = dataLinkId !== null;
    const matchesId = dataLinkId === 'unique-test-id-123';
    
    console.log(`  - Has data-link-id attribute: ${hasAttribute ? '✓' : '✗'}`);
    console.log(`  - Matches link id: ${matchesId ? '✓' : '✗'} (${dataLinkId})`);
    
    const passed = hasAttribute && matchesId;
    console.log(`  Result: ${passed ? '✓ PASS' : '✗ FAIL'}`);
    
    return passed;
}

// Run all tests
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  Task 7.3 - Link Rendering Methods Test Suite            ║');
console.log('╚════════════════════════════════════════════════════════════╝');

const results = [
    test1_renderLink_creates_correct_structure(),
    test2_renderLink_sets_correct_attributes(),
    test3_renderLinks_renders_multiple_links(),
    test4_renderLinks_clears_existing_content(),
    test5_delete_button_has_correct_symbol(),
    test6_data_link_id_attribute()
];

const passedCount = results.filter(r => r).length;
const totalCount = results.length;
const allPassed = results.every(r => r);

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  Test Summary                                             ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log(`\n  ${passedCount} / ${totalCount} tests passed`);
console.log(`\n  Overall: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}\n`);

process.exit(allPassed ? 0 : 1);
