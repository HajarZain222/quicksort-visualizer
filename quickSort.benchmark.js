/**
 * QUICKSORT PERFORMANCE BENCHMARKING
 * Compares various QuickSort implementations against JavaScript's built-in sort
 * Run with: node quickSort.benchmark.js
 */

const {
  quickSortRecursive,
  quickSortRecursiveHoare,
  quickSortIterative,
  quickSortIterativeHoare,
  quickSortThreeWay,
  quickSortRandom,
  quickSortAuto
} = require('./quickSort');

// =====================================================
// COMPLEXITY ANALYSIS COMMENTS
// =====================================================

/*
╔════════════════════════════════════════════════════════════════╗
║                    TIME COMPLEXITY ANALYSIS                    ║
╚════════════════════════════════════════════════════════════════╝

QUICKSORT:
  • Best Case:    O(n log n)   - Optimal pivot selection (balanced partitions)
  • Average Case: O(n log n)   - Random/median-of-three pivot selection
  • Worst Case:   O(n²)        - Poor pivot selection (already sorted, no randomization)
  • Space:        O(log n)     - Recursive call stack (iterative uses explicit stack)
  
  Why O(n log n) on average:
  - Each partition divides array roughly in half
  - Tree depth is log(n) levels
  - Each level processes all n elements
  - Total: n × log(n) comparisons

RECURSIVE vs ITERATIVE:
  • Recursive: Uses call stack, risk of stack overflow on huge arrays
  • Iterative: Uses explicit stack, controllable memory, safer for 100k+ elements
  • Both have same time complexity, iterative is more robust

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPARISON WITH OTHER SORTING ALGORITHMS:

MERGESORT:
  • Time:   O(n log n) guaranteed (Best, Average, Worst)
  • Space:  O(n) - Requires temporary arrays for merging
  • Pros:   Stable sort, predictable performance, parallelizable
  • Cons:   Higher space overhead, slower for already sorted data
  • Use:    When stability needed, consistent performance required
  
  vs QuickSort: QuickSort faster in practice due to cache locality,
                but MergeSort has guaranteed O(n log n) worst case

HEAPSORT:
  • Time:   O(n log n) guaranteed (Best, Average, Worst)
  • Space:  O(1) - In-place, no extra memory needed
  • Pros:   Space-efficient, guaranteed O(n log n)
  • Cons:   Poor cache locality, larger constant factors, slower than QuickSort
  • Use:    When guaranteed performance needed with minimal memory
  
  vs QuickSort: QuickSort usually 2-3x faster due to better cache behavior,
                but HeapSort is more predictable

BUILT-IN SORT (V8 Engine):
  • Uses TimSort hybrid algorithm (Python-inspired for JS)
  • Actually: QuickSort for small arrays, MergeSort for larger ones
  • Time:   O(n log n) average, O(n) best (detects sorted data)
  • Space:  O(n) - May use temporary arrays
  • Pros:   Highly optimized, adaptive, detects patterns
  • Cons:   Black box, not educational
  • Use:    Production code where performance is critical
  
  vs Custom QuickSort: Built-in sort faster due to:
                      - Deep optimizations (inline caching, JIT compilation)
                      - Pattern detection (already sorted, duplicates)
                      - Algorithm switching (hybrid approach)
                      - Native C++ implementation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRACTICAL CONSIDERATIONS:

Data Type Effects:
  • Small arrays (<10): Insertion sort optimal (built-in may use it)
  • Medium arrays (10-1000): QuickSort and MergeSort similar
  • Large arrays (>10k): QuickSort advantage from cache locality
  • Duplicates: Three-way partition QuickSort much faster (O(n) best case)

Memory Access Patterns:
  • QuickSort: Better cache locality (in-place, partitions nearby memory)
  • MergeSort: Sequential access but requires merging overhead
  • HeapSort: Scattered memory access (jump around in array)

Adaptive Algorithms:
  • Built-in sort adapts to data patterns
  • TimSort: O(n) for already sorted, detects runs
  • Custom QuickSort: Median-of-three helps but not fully adaptive
  • Three-way partition: Near O(n) for high duplicates

*/

// =====================================================
// UTILITY FUNCTIONS FOR BENCHMARKING
// =====================================================

/**
 * Generates different types of test arrays
 * @param {string} type - Type of array: 'random', 'sorted', 'reverse', 'duplicates'
 * @param {number} size - Array size
 * @returns {Array} Generated array
 */
function generateTestArray(type, size) {
  switch (type) {
    case 'random':
      return Array.from({ length: size }, () => Math.floor(Math.random() * size));
    case 'sorted':
      return Array.from({ length: size }, (_, i) => i);
    case 'reverse':
      return Array.from({ length: size }, (_, i) => size - i);
    case 'duplicates':
      return Array.from({ length: size }, () => Math.floor(Math.random() * Math.sqrt(size)));
    case 'sawtooth':
      // Partially sorted pattern
      return Array.from({ length: size }, (_, i) => {
        const chunk = Math.floor(i / 100);
        return chunk * 100 + (i % 100);
      });
    default:
      return Array.from({ length: size }, () => Math.random());
  }
}

/**
 * Runs a sorting function and measures execution time
 * @param {Function} sortFn - Sorting function
 * @param {Array} arr - Array to sort
 * @param {string} name - Algorithm name (for logging)
 * @returns {Object} { time, sorted }
 */
function benchmark(sortFn, arr, name = '') {
  const copy = Array.from(arr); // Deep copy to avoid mutations
  
  const start = performance.now();
  const result = sortFn(copy);
  const end = performance.now();
  
  const time = end - start;
  
  return {
    name,
    time,
    time_ms: time.toFixed(3),
    sorted: result
  };
}

/**
 * Formats timing results for display
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted string
 */
function formatTime(ms) {
  if (ms < 0.001) return `${(ms * 1000000).toFixed(2)}µs`;
  if (ms < 1) return `${(ms * 1000).toFixed(3)}ms`;
  return `${ms.toFixed(3)}s`;
}

/**
 * Compares two results and returns ratio
 * @param {number} time1 - First time
 * @param {number} time2 - Second time
 * @returns {string} Ratio string with arrow indicating faster
 */
function compareTime(time1, time2) {
  const ratio = time1 / time2;
  if (ratio < 1) {
    return `${(ratio * 100).toFixed(1)}% (↓ ${(1/ratio).toFixed(2)}x slower)`;
  } else {
    return `${(ratio * 100).toFixed(1)}% (↑ ${ratio.toFixed(2)}x faster)`;
  }
}

// =====================================================
// BENCHMARK TESTS
// =====================================================

console.log('\n' + '='.repeat(70));
console.log('QUICKSORT PERFORMANCE BENCHMARKS');
console.log('='.repeat(70));

// Benchmark 1: Small Random Array
console.log('\n┌─ TEST 1: SMALL RANDOM ARRAY (1,000 elements)');
console.log('├─ Tests algorithm performance on typical small dataset');
(() => {
  const arr = generateTestArray('random', 1000);
  
  const r1 = benchmark(quickSortRecursive, arr, 'QuickSort Recursive');
  const r2 = benchmark(quickSortIterative, arr, 'QuickSort Iterative');
  const r3 = benchmark(() => Array.from(arr).sort((a, b) => a - b), arr, 'Built-in Sort');
  
  console.log(`├─ ${r1.name}: ${formatTime(r1.time)}`);
  console.log(`├─ ${r2.name}: ${formatTime(r2.time)}`);
  console.log(`└─ ${r3.name}: ${formatTime(r3.time)} (baseline)`);
  console.log(`   vs Built-in: ${compareTime(r1.time, r3.time)}`);
})();

// Benchmark 2: Medium Random Array
console.log('\n┌─ TEST 2: MEDIUM RANDOM ARRAY (10,000 elements)');
console.log('├─ Tests performance on mid-sized dataset');
(() => {
  const arr = generateTestArray('random', 10000);
  
  const r1 = benchmark(quickSortRecursive, arr, 'QuickSort Recursive');
  const r2 = benchmark(quickSortIterative, arr, 'QuickSort Iterative');
  const r3 = benchmark(quickSortThreeWay, arr, 'QuickSort ThreeWay');
  const r4 = benchmark(() => Array.from(arr).sort((a, b) => a - b), arr, 'Built-in Sort');
  
  console.log(`├─ ${r1.name}: ${formatTime(r1.time)}`);
  console.log(`├─ ${r2.name}: ${formatTime(r2.time)}`);
  console.log(`├─ ${r3.name}: ${formatTime(r3.time)}`);
  console.log(`└─ ${r4.name}: ${formatTime(r4.time)} (baseline)`);
  console.log(`   Custom QuickSort vs Built-in: ${compareTime(r1.time, r4.time)}`);
})();

// Benchmark 3: Large Random Array
console.log('\n┌─ TEST 3: LARGE RANDOM ARRAY (100,000 elements)');
console.log('├─ Tests performance on large dataset');
(() => {
  const arr = generateTestArray('random', 100000);
  
  const r1 = benchmark(quickSortIterative, arr, 'QuickSort Iterative');
  const r2 = benchmark(quickSortIterativeHoare, arr, 'QuickSort Hoare');
  const r3 = benchmark(() => Array.from(arr).sort((a, b) => a - b), arr, 'Built-in Sort');
  
  console.log(`├─ ${r1.name}: ${formatTime(r1.time)}`);
  console.log(`├─ ${r2.name}: ${formatTime(r2.time)}`);
  console.log(`└─ ${r3.name}: ${formatTime(r3.time)} (baseline)`);
  console.log(`   Custom QuickSort vs Built-in: ${compareTime(r1.time, r3.time)}`);
})();

// Benchmark 4: Already Sorted (Best Case for Adaptive Algorithms)
console.log('\n┌─ TEST 4: ALREADY SORTED ARRAY (10,000 elements)');
console.log('├─ Tests adaptive behavior - Built-in should excel here');
(() => {
  const arr = generateTestArray('sorted', 10000);
  
  const r1 = benchmark(quickSortIterative, arr, 'QuickSort Iterative');
  const r2 = benchmark(quickSortRandom, arr, 'QuickSort Random Pivot');
  const r3 = benchmark(() => Array.from(arr).sort((a, b) => a - b), arr, 'Built-in Sort');
  
  console.log(`├─ ${r1.name}: ${formatTime(r1.time)}`);
  console.log(`├─ ${r2.name}: ${formatTime(r2.time)} (random pivot avoids worst case)`);
  console.log(`└─ ${r3.name}: ${formatTime(r3.time)} (baseline)`);
  console.log(`   Custom vs Built-in: ${compareTime(r1.time, r3.time)}`);
  console.log(`   Note: Built-in detects already sorted and optimizes (TimSort)`)
  console.log(`   Note: Random pivot prevents O(n²) on sorted data`)
})();

// Benchmark 5: Reverse Sorted (Challenging for Median-of-Three)
console.log('\n┌─ TEST 5: REVERSE SORTED ARRAY (10,000 elements)');
console.log('├─ Tests pivot selection strategy');
(() => {
  const arr = generateTestArray('reverse', 10000);
  
  const r1 = benchmark(quickSortIterative, arr, 'QuickSort Iterative');
  const r2 = benchmark(quickSortRandom, arr, 'QuickSort Random Pivot');
  const r3 = benchmark(() => Array.from(arr).sort((a, b) => a - b), arr, 'Built-in Sort');
  
  console.log(`├─ ${r1.name}: ${formatTime(r1.time)}`);
  console.log(`├─ ${r2.name}: ${formatTime(r2.time)}`);
  console.log(`└─ ${r3.name}: ${formatTime(r3.time)} (baseline)`);
  console.log(`   Custom vs Built-in: ${compareTime(r1.time, r3.time)}`);
})();

// Benchmark 6: Many Duplicates (Three-Way Partition Advantage)
console.log('\n┌─ TEST 6: MANY DUPLICATES (50,000 elements, ~224 unique)');
console.log('├─ Three-way partition should shine here');
(() => {
  const arr = generateTestArray('duplicates', 50000);
  
  const r1 = benchmark(quickSortIterative, arr, 'QuickSort Standard');
  const r2 = benchmark(quickSortThreeWay, arr, 'QuickSort ThreeWay');
  const r3 = benchmark(() => Array.from(arr).sort((a, b) => a - b), arr, 'Built-in Sort');
  
  console.log(`├─ ${r1.name}: ${formatTime(r1.time)}`);
  console.log(`├─ ${r2.name}: ${formatTime(r2.time)} ← Optimized for duplicates`);
  console.log(`└─ ${r3.name}: ${formatTime(r3.time)} (baseline)`);
  console.log(`   ThreeWay vs Standard: ${compareTime(r2.time, r1.time)}`);
  console.log(`   ThreeWay vs Built-in: ${compareTime(r2.time, r3.time)}`);
})();

// Benchmark 7: All Same Elements (Best Case for Three-Way)
console.log('\n┌─ TEST 7: ALL IDENTICAL ELEMENTS (50,000 elements)');
console.log('├─ Three-way partition is near-optimal here');
(() => {
  const arr = Array(50000).fill(42);
  
  const r1 = benchmark(quickSortIterative, arr, 'QuickSort Iterative');
  const r2 = benchmark(quickSortThreeWay, arr, 'QuickSort ThreeWay');
  const r3 = benchmark(() => Array.from(arr).sort((a, b) => a - b), arr, 'Built-in Sort');
  
  console.log(`├─ ${r1.name}: ${formatTime(r1.time)}`);
  console.log(`├─ ${r2.name}: ${formatTime(r2.time)} ← Optimized for duplicates`);
  console.log(`└─ ${r3.name}: ${formatTime(r3.time)} (baseline)`);
  console.log(`   ThreeWay vs Iterative: ${compareTime(r2.time, r1.time)}`);
  console.log(`   Iterative vs Built-in: ${compareTime(r1.time, r3.time)}`);
})();

// Benchmark 8: Comparison of All Variants on Same Data
console.log('\n┌─ TEST 8: ALL VARIANTS ON 50,000 RANDOM ELEMENTS');
console.log('├─ Direct comparison of different implementations');
(() => {
  const arr = generateTestArray('random', 50000);
  
  const results = [
    benchmark(quickSortRecursive, arr, 'Recursive (Lomuto)'),
    benchmark(quickSortRecursiveHoare, arr, 'Recursive (Hoare)'),
    benchmark(quickSortIterative, arr, 'Iterative (Lomuto)'),
    benchmark(quickSortIterativeHoare, arr, 'Iterative (Hoare)'),
    benchmark(quickSortThreeWay, arr, 'ThreeWay Partition'),
    benchmark(quickSortAuto, arr, 'Auto-select')
  ];
  
  // Sort by time for ranking
  results.sort((a, b) => a.time - b.time);
  
  results.forEach((result, index) => {
    const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ' ';
    console.log(`${rank} ${(index + 1)}. ${result.name.padEnd(25)}: ${formatTime(result.time)}`);
  });
  
  const fastest = results[0];
  const slowest = results[results.length - 1];
  console.log(`   Speedup range: ${(slowest.time / fastest.time).toFixed(2)}x`);
})();

// Benchmark 9: Memory Efficiency Comparison
console.log('\n┌─ TEST 9: RECURSIVE vs ITERATIVE STACK USAGE');
console.log('├─ Memory overhead comparison');
console.log(`├─ Recursive: Uses call stack O(log n) for balanced partitions`);
console.log(`├─ Iterative: Uses explicit stack, controllable, safer for 100k+ arrays`);
console.log(`├─ Both have same time complexity O(n log n)`);
console.log(`└─ Iterative preferred for production (no stack overflow risk)`);

// Benchmark 10: Summary Statistics
console.log('\n' + '='.repeat(70));
console.log('SUMMARY & RECOMMENDATIONS');
console.log('='.repeat(70));
console.log(`
ALGORITHM SELECTION GUIDE:

1. FOR GENERAL PURPOSE (Production Code):
   → Use Built-in Array.sort()
   → Optimized by engine, adaptive, battle-tested
   → Performance: Fastest due to JIT compilation

2. FOR EDUCATIONAL/CUSTOM REQUIREMENTS:
   → Use QuickSort (Recursive or Iterative)
   → Time: O(n log n) average, O(n²) worst (rare with median-of-three)
   → Space: O(log n) recursive, explicit stack for iterative

3. FOR ARRAYS WITH MANY DUPLICATES:
   → Use Three-Way Partition QuickSort
   → Best case: O(n) when many duplicates
   → Dramatically faster than standard QuickSort

4. FOR VERY LARGE ARRAYS (100k+):
   → Use Iterative QuickSort
   → Avoids stack overflow risk
   → Same speed as recursive but safer

5. FOR GUARANTEED O(n log n):
   → MergeSort: Stable, predictable, uses more memory
   → HeapSort: In-place, but slower in practice

KEY INSIGHTS:

• Built-in sort is usually 2-3x faster due to:
  - Native C++ implementation (V8 engine)
  - JIT compilation and optimization
  - Pattern detection (already sorted, duplicates)
  - Algorithm switching (hybrid TimSort)

• QuickSort advantages:
  - Best practical performance for unsorted random data
  - Excellent cache locality (in-place, nearby memory access)
  - Flexible - can be adapted for specific patterns

• Pivot Selection Impact:
  - Median-of-three: Prevents worst case on sorted data
  - Random pivot: Good average, simpler logic
  - Three-way partition: Excellent for duplicates

• Time Complexity Reality:
  - Theory: O(n log n) average, O(n²) worst
  - Practice: Custom implementations typically O(n log n)
  - Worst case O(n²) is rare and preventable
`);
console.log('='.repeat(70) + '\n');
