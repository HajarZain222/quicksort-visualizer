/**
 * QUICKSORT TEST SUITE
 * Tests all QuickSort implementations with various edge cases
 * Run with: node quickSort.test.js
 */

const assert = require('assert');
const {
  quickSortRecursive,
  quickSortRecursiveHoare,
  quickSortIterative,
  quickSortIterativeHoare,
  quickSortTailRecursive,
  quickSortRandom,
  quickSortThreeWay,
  quickSortAuto
} = require('./quickSort');

// Test counter
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Simple test assertion function
 * @param {string} testName - Name of the test
 * @param {Function} testFn - Test function to execute
 */
function test(testName, testFn) {
  testsRun++;
  try {
    testFn();
    testsPassed++;
    console.log(`✓ ${testName}`);
  } catch (error) {
    testsFailed++;
    console.error(`✗ ${testName}`);
    console.error(`  Error: ${error.message}`);
  }
}

/**
 * Helper: Deep copy array to avoid mutations affecting other tests
 */
function copy(arr) {
  return Array.from(arr);
}

/**
 * Helper: Check if array is sorted
 */
function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

/**
 * Helper: Arrays are equal (same elements in same order)
 */
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// =====================================================
// TEST SUITE 1: EMPTY & EDGE CASES
// =====================================================

console.log('\n--- EMPTY & EDGE CASES ---');

test('Empty array - Recursive', () => {
  const result = quickSortRecursive([]);
  assert.deepStrictEqual(result, []);
});

test('Empty array - Iterative', () => {
  const result = quickSortIterative([]);
  assert.deepStrictEqual(result, []);
});

test('Single element - Recursive', () => {
  const result = quickSortRecursive([42]);
  assert.deepStrictEqual(result, [42]);
});

test('Single element - Iterative', () => {
  const result = quickSortIterative([42]);
  assert.deepStrictEqual(result, [42]);
});

test('Two elements - Recursive', () => {
  const arr = [2, 1];
  const result = quickSortRecursive(copy(arr));
  assert.deepStrictEqual(result, [1, 2]);
});

test('Two elements - Iterative', () => {
  const arr = [2, 1];
  const result = quickSortIterative(copy(arr));
  assert.deepStrictEqual(result, [1, 2]);
});

// =====================================================
// TEST SUITE 2: ALREADY SORTED ARRAYS
// =====================================================

console.log('\n--- ALREADY SORTED ARRAYS ---');

test('Already sorted (ascending) - Recursive', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const result = quickSortRecursive(copy(arr));
  assert.ok(isSorted(result));
  assert.deepStrictEqual(result, arr);
});

test('Already sorted (ascending) - Iterative', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const result = quickSortIterative(copy(arr));
  assert.ok(isSorted(result));
  assert.deepStrictEqual(result, arr);
});

test('Already sorted (ascending) - ThreeWay', () => {
  const arr = [1, 2, 3, 4, 5];
  const result = quickSortThreeWay(copy(arr));
  assert.ok(isSorted(result));
  assert.deepStrictEqual(result, arr);
});

test('Already sorted (large) - Iterative', () => {
  const arr = Array.from({ length: 1000 }, (_, i) => i);
  const result = quickSortIterative(copy(arr));
  assert.ok(isSorted(result));
});

// =====================================================
// TEST SUITE 3: REVERSE SORTED ARRAYS
// =====================================================

console.log('\n--- REVERSE SORTED ARRAYS ---');

test('Reverse sorted (descending) - Recursive', () => {
  const arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const result = quickSortRecursive(copy(arr));
  assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('Reverse sorted (descending) - Iterative', () => {
  const arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const result = quickSortIterative(copy(arr));
  assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('Reverse sorted (large) - Iterative', () => {
  const arr = Array.from({ length: 1000 }, (_, i) => 1000 - i);
  const result = quickSortIterative(copy(arr));
  assert.ok(isSorted(result));
  assert.strictEqual(result[0], 1);
  assert.strictEqual(result[result.length - 1], 1000);
});

// =====================================================
// TEST SUITE 4: DUPLICATES
// =====================================================

console.log('\n--- ARRAYS WITH DUPLICATES ---');

test('All same elements - Recursive', () => {
  const arr = [5, 5, 5, 5, 5];
  const result = quickSortRecursive(copy(arr));
  assert.deepStrictEqual(result, [5, 5, 5, 5, 5]);
});

test('All same elements - ThreeWay', () => {
  const arr = [7, 7, 7, 7, 7, 7];
  const result = quickSortThreeWay(copy(arr));
  assert.deepStrictEqual(result, [7, 7, 7, 7, 7, 7]);
});

test('Multiple duplicates - Recursive', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  const result = quickSortRecursive(copy(arr));
  assert.deepStrictEqual(result, [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
});

test('Multiple duplicates - ThreeWay', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  const result = quickSortThreeWay(copy(arr));
  assert.deepStrictEqual(result, [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]);
});

test('Many duplicates - Iterative', () => {
  const arr = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const result = quickSortIterative(copy(arr));
  assert.deepStrictEqual(result, [1, 1, 1, 1, 2, 2, 2, 2, 2]);
});

test('Mostly duplicates with few unique - ThreeWay', () => {
  const arr = Array.from({ length: 100 }, (_, i) => i % 3);
  const result = quickSortThreeWay(copy(arr));
  assert.ok(isSorted(result));
  // Verify all elements are preserved
  assert.strictEqual(result.length, 100);
});

// =====================================================
// TEST SUITE 5: BASIC SORTING
// =====================================================

console.log('\n--- BASIC SORTING ---');

test('Unordered array - Recursive', () => {
  const arr = [64, 34, 25, 12, 22, 11, 90];
  const result = quickSortRecursive(copy(arr));
  assert.deepStrictEqual(result, [11, 12, 22, 25, 34, 64, 90]);
});

test('Unordered array - Iterative', () => {
  const arr = [64, 34, 25, 12, 22, 11, 90];
  const result = quickSortIterative(copy(arr));
  assert.deepStrictEqual(result, [11, 12, 22, 25, 34, 64, 90]);
});

test('Random unsorted - All variants match', () => {
  const arr = [5, 2, 8, 2, 9, 1, 5, 5, 3, 7];
  const r1 = quickSortRecursive(copy(arr));
  const r2 = quickSortIterative(copy(arr));
  const r3 = quickSortThreeWay(copy(arr));
  const r4 = quickSortRecursiveHoare(copy(arr));
  
  assert.deepStrictEqual(r1, r2);
  assert.deepStrictEqual(r2, r3);
  assert.deepStrictEqual(r3, r4);
});

// =====================================================
// TEST SUITE 6: LARGE RANDOM ARRAYS
// =====================================================

console.log('\n--- LARGE RANDOM ARRAYS ---');

test('Large random array (10k) - Recursive', () => {
  const arr = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 10000));
  const result = quickSortRecursive(copy(arr));
  assert.ok(isSorted(result));
  assert.strictEqual(result.length, 10000);
});

test('Large random array (10k) - Iterative', () => {
  const arr = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 10000));
  const result = quickSortIterative(copy(arr));
  assert.ok(isSorted(result));
  assert.strictEqual(result.length, 10000);
});

test('Large array with duplicates (10k) - ThreeWay', () => {
  const arr = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 100));
  const result = quickSortThreeWay(copy(arr));
  assert.ok(isSorted(result));
  assert.strictEqual(result.length, 10000);
});

test('Very large array (100k) - Iterative (no stack overflow)', () => {
  const arr = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 100000));
  const result = quickSortIterative(copy(arr));
  assert.ok(isSorted(result));
  assert.strictEqual(result.length, 100000);
});

test('Very large already sorted (100k) - Iterative', () => {
  const arr = Array.from({ length: 100000 }, (_, i) => i);
  const result = quickSortIterative(copy(arr));
  assert.ok(isSorted(result));
  assert.strictEqual(result[0], 0);
  assert.strictEqual(result[result.length - 1], 99999);
});

// =====================================================
// TEST SUITE 7: VARIANT CONSISTENCY
// =====================================================

console.log('\n--- VARIANT CONSISTENCY ---');

test('All recursive variants produce same result', () => {
  const arr = [38, 27, 43, 3, 9, 82, 10, 15, 14];
  const r1 = quickSortRecursive(copy(arr));
  const r2 = quickSortRecursiveHoare(copy(arr));
  const r3 = quickSortTailRecursive(copy(arr));
  const r4 = quickSortRandom(copy(arr));
  
  assert.deepStrictEqual(r1, r2);
  assert.deepStrictEqual(r2, r3);
  assert.deepStrictEqual(r3, r4);
});

test('All iterative variants produce same result', () => {
  const arr = [38, 27, 43, 3, 9, 82, 10, 15, 14];
  const r1 = quickSortIterative(copy(arr));
  const r2 = quickSortIterativeHoare(copy(arr));
  
  assert.deepStrictEqual(r1, r2);
});

test('Recursive and Iterative produce same result', () => {
  const arr = [38, 27, 43, 3, 9, 82, 10, 15, 14];
  const recursive = quickSortRecursive(copy(arr));
  const iterative = quickSortIterative(copy(arr));
  
  assert.deepStrictEqual(recursive, iterative);
});

test('Auto-select produces correct result', () => {
  const arr = [38, 27, 43, 3, 9, 82, 10, 15, 14];
  const result = quickSortAuto(copy(arr));
  assert.deepStrictEqual(result, [3, 9, 10, 14, 15, 27, 38, 43, 82]);
});

// =====================================================
// TEST SUITE 8: NEGATIVE NUMBERS & FLOATS
// =====================================================

console.log('\n--- NEGATIVE NUMBERS & FLOATS ---');

test('Negative numbers - Recursive', () => {
  const arr = [-5, 3, -2, 8, -10, 1];
  const result = quickSortRecursive(copy(arr));
  assert.deepStrictEqual(result, [-10, -5, -2, 1, 3, 8]);
});

test('Mixed positive and negative - Iterative', () => {
  const arr = [15, -3, 0, 42, -7, 8, -1];
  const result = quickSortIterative(copy(arr));
  assert.deepStrictEqual(result, [-7, -3, -1, 0, 8, 15, 42]);
});

test('Float numbers - Recursive', () => {
  const arr = [3.5, 1.2, 4.8, 2.1, 0.5];
  const result = quickSortRecursive(copy(arr));
  assert.strictEqual(result[0], 0.5);
  assert.strictEqual(result[4], 4.8);
  assert.ok(isSorted(result));
});

test('Negative and float - Iterative', () => {
  const arr = [-3.5, 2.1, -0.5, 4.2, -1.8];
  const result = quickSortIterative(copy(arr));
  assert.ok(isSorted(result));
  assert.strictEqual(result[0], -3.5);
});

// =====================================================
// TEST SUITE 9: STABILITY CHECK (order preservation for equal elements)
// =====================================================

console.log('\n--- STABILITY NOTES ---');

test('Array remains valid after sorting (content preservation)', () => {
  const arr = [5, 2, 8, 2, 9, 1, 5];
  const original = copy(arr);
  const sorted = quickSortRecursive(copy(arr));
  
  // Count occurrences before and after
  const countBefore = original.reduce((c, x) => ({ ...c, [x]: (c[x] || 0) + 1 }), {});
  const countAfter = sorted.reduce((c, x) => ({ ...c, [x]: (c[x] || 0) + 1 }), {});
  
  assert.deepStrictEqual(countBefore, countAfter);
});

// =====================================================
// TEST RESULTS SUMMARY
// =====================================================

console.log('\n' + '='.repeat(50));
console.log('TEST RESULTS');
console.log('='.repeat(50));
console.log(`Total Tests: ${testsRun}`);
console.log(`Passed: ${testsPassed} ✓`);
console.log(`Failed: ${testsFailed} ✗`);
console.log('='.repeat(50));

if (testsFailed === 0) {
  console.log('\n✓ ALL TESTS PASSED!\n');
  process.exit(0);
} else {
  console.log(`\n✗ ${testsFailed} TEST(S) FAILED\n`);
  process.exit(1);
}
