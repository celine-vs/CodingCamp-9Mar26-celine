# Accessibility Testing Guide - Task 10.6

## Quick Start
1. Open `test-accessibility.html` in your browser for automated tests
2. Open `index.html` for manual keyboard navigation testing

## Manual Testing Instructions

### 1. Keyboard Navigation Test (5 minutes)

**Goal**: Verify all interactive elements are keyboard accessible with visible focus

**Steps**:
1. Open `index.html` in your browser
2. Press `Tab` key repeatedly to navigate through all elements
3. Verify each element shows a clear focus indicator:
   - Dark outline (3px solid)
   - Blue glow/shadow around the element
   - Clear separation from the element (2px offset)

**Elements to test**:
- [ ] Timer Start button
- [ ] Timer Stop button
- [ ] Timer Reset button
- [ ] Task input field
- [ ] Add Task button
- [ ] Task checkboxes
- [ ] Edit task buttons
- [ ] Delete task buttons
- [ ] Link name input
- [ ] Link URL input
- [ ] Add Link button
- [ ] Link buttons (quick links)
- [ ] Delete link buttons

**Expected Result**: Every interactive element should have a visible, clear focus indicator

---

### 2. Contrast Verification Test (2 minutes)

**Goal**: Verify text is readable against backgrounds

**Steps**:
1. Open `test-accessibility.html` in your browser
2. Review the "Contrast Ratio Tests" section
3. All tests should show "✓ PASS"
4. Visually inspect the color samples - text should be clearly readable

**Expected Results**:
- All contrast tests pass (green background)
- Text is easily readable in all samples
- No eye strain when reading any text

---

### 3. Touch Target Size Test (2 minutes)

**Goal**: Verify buttons are large enough for touch/click

**Steps**:
1. Open `test-accessibility.html` in your browser
2. Review the "Touch Target Size Tests" section
3. All measurements should be ≥44x44px
4. Try clicking the sample buttons - they should be easy to hit

**Expected Results**:
- All buttons show "✓ PASS (≥44x44px)"
- Buttons feel comfortable to click
- No accidental clicks on wrong buttons

---

### 4. Browser Accessibility Audit (5 minutes)

**Goal**: Run automated accessibility checks

#### Chrome Lighthouse:
1. Open `index.html` in Chrome
2. Press `F12` to open DevTools
3. Click "Lighthouse" tab
4. Select "Accessibility" category
5. Click "Analyze page load"
6. **Expected Score**: 90+ (green)

#### Firefox Accessibility Inspector:
1. Open `index.html` in Firefox
2. Press `F12` to open DevTools
3. Click "Accessibility" tab
4. Review any issues flagged
5. **Expected Result**: No critical issues

#### Edge Accessibility:
1. Open `index.html` in Edge
2. Press `F12` to open DevTools
3. Click "Issues" tab
4. Review accessibility section
5. **Expected Result**: No critical issues

---

### 5. Reduced Motion Test (Optional, 2 minutes)

**Goal**: Verify animations respect user preferences

**Steps**:

**Windows**:
1. Open Settings → Accessibility → Visual effects
2. Enable "Show animations in Windows"
3. Open `index.html` and start the timer
4. Let it complete - you should see pulse animation
5. Disable "Show animations in Windows"
6. Refresh page and complete timer again
7. Animation should be minimal/instant

**Mac**:
1. System Preferences → Accessibility → Display
2. Toggle "Reduce motion"
3. Test timer completion animation

**Expected Result**: Animations are disabled when user prefers reduced motion

---

### 6. High Contrast Mode Test (Optional, 2 minutes)

**Goal**: Verify dashboard works in high contrast mode

**Steps**:

**Windows**:
1. Press `Left Alt + Left Shift + Print Screen` to enable high contrast
2. Open `index.html`
3. Verify all text is readable
4. Verify all buttons have visible borders
5. Press the same keys to disable

**Expected Result**: Dashboard remains usable with enhanced contrast

---

## Quick Verification Checklist

Use this checklist for rapid verification:

### Contrast ✓
- [ ] All text is clearly readable
- [ ] No light gray text on white backgrounds
- [ ] Colored buttons have sufficient contrast

### Keyboard Navigation ✓
- [ ] Can tab through all interactive elements
- [ ] Focus indicator is always visible
- [ ] Can activate buttons with Enter/Space
- [ ] Can check/uncheck tasks with keyboard

### Touch Targets ✓
- [ ] All buttons are easy to click
- [ ] No tiny buttons or links
- [ ] Adequate spacing between interactive elements

### Semantic HTML ✓
- [ ] Page has proper heading structure
- [ ] Forms have labels
- [ ] Buttons have descriptive text

---

## Common Issues & Solutions

### Issue: Focus indicator not visible
**Solution**: Ensure you're using Tab key, not clicking with mouse. Focus-visible only shows for keyboard navigation.

### Issue: Contrast test shows failures
**Solution**: Check if you've modified the CSS colors. Refer to TASK-10.6-ACCESSIBILITY-REPORT.md for correct color values.

### Issue: Buttons too small on mobile
**Solution**: Test on actual device or use browser DevTools device emulation. All buttons should be at least 44x44px.

---

## Automated Test Results

Run `test-accessibility.html` and verify:
- ✓ Contrast Ratio Summary: All tests passed
- ✓ Touch Target Summary: All targets meet 44x44px minimum
- ✓ Semantic HTML checks: All present
- ✓ Additional features: Implemented

---

## Success Criteria

Task 10.6 is complete when:
1. ✓ All contrast ratios meet WCAG AA (4.5:1 normal, 3:1 large)
2. ✓ All interactive elements have visible focus styles
3. ✓ All touch targets are ≥44x44px
4. ✓ Lighthouse accessibility score is 90+
5. ✓ Manual keyboard navigation works smoothly

---

## Need Help?

If any tests fail:
1. Check `TASK-10.6-ACCESSIBILITY-REPORT.md` for detailed specifications
2. Review `css/styles.css` accessibility section (bottom of file)
3. Compare your colors against the verified contrast ratios
4. Ensure you haven't modified the focus styles

---

**Estimated Testing Time**: 15-20 minutes for complete verification
**Required Tools**: Modern browser (Chrome/Firefox/Edge)
**Optional Tools**: WAVE browser extension, screen reader (NVDA/JAWS)
