================================================================================
                    QUICKSORT MODULE - COMPLETE IMPLEMENTATION
================================================================================

PROJECT FILES:
==============

1. quickSort.js (Main Module)
   ├─ Recursive Implementations:
   │  ├─ quickSortRecursive()              - Optimized recursive (median-of-three)
   │  ├─ quickSortRecursiveHoare()         - Recursive with Hoare partition
   │  └─ quickSortTailRecursive()          - Tail-call optimized
   │
   ├─ Iterative Implementations:
   │  ├─ quickSortIterative()              - Stack-based (safer for large arrays)
   │  └─ quickSortIterativeHoare()         - Stack-based with Hoare partition
   │
   ├─ Specialized Implementations:
   │  ├─ quickSortThreeWay()               - Optimized for duplicates (Bentley-McIlroy)
   │  ├─ quickSortRandom()                 - Random pivot selection
   │  └─ quickSortAuto()                   - Auto-selects best variant
   │
   ├─ Helper Functions:
   │  ├─ swap()                            - Element swapping
   │  ├─ partitionLomuto()                 - Lomuto partition scheme
   │  ├─ partitionHoare()                  - Hoare partition scheme (fewer swaps)
   │  ├─ insertionSort()                   - Hybrid approach for small arrays
   │  ├─ medianOfThree()                   - Optimal pivot selection
   │  └─ analyzeArray()                    - Characterizes input for algorithm selection
   │
   └─ All functions exported via module.exports for Node.js

2. quickSort.test.js (Comprehensive Test Suite)
   ├─ 36+ Unit Tests covering:
   │  ├─ Empty & edge cases
   │  ├─ Already sorted arrays
   │  ├─ Reverse sorted arrays
   │  ├─ Arrays with duplicates
   │  ├─ Large random arrays (100k elements)
   │  ├─ All variant consistency
   │  ├─ Negative numbers & floats
   │  └─ Content preservation
   │
   ├─ Built-in assert module (no external dependencies)
   └─ Clear pass/fail reporting with total counts

3. quickSort.benchmark.js (Performance Analysis)
   ├─ 9 comprehensive benchmarks:
   │  ├─ Small random array (1k elements)
   │  ├─ Medium random array (10k elements)
   │  ├─ Large random array (100k elements)
   │  ├─ Already sorted data
   │  ├─ Reverse sorted data
   │  ├─ Arrays with many duplicates
   │  ├─ All identical elements
   │  ├─ All variants comparison
   │  └─ Variant performance analysis
   │
   ├─ Inline documentation explaining:
   │  ├─ Time complexity analysis of QuickSort
   │  │  - Best case: O(n log n) - balanced partitions
   │  │  - Average case: O(n log n) - median-of-three pivot
   │  │  - Worst case: O(n²) - rare with optimizations
   │  │  - Space: O(log n) recursive, explicit stack for iterative
   │  │
   │  ├─ Comparison with other algorithms:
   │  │  - MergeSort: O(n log n) guaranteed, stable, O(n) space
   │  │  - HeapSort: O(n log n) guaranteed, in-place, poor cache locality
   │  │  - Built-in Sort: V8's TimSort (hybrid adaptive algorithm)
   │  │
   │  └─ Practical insights:
   │     - QuickSort 2-3x faster than custom implementations when
   │       considering cache locality and in-place partitioning
   │     - Built-in sort optimized with JIT compilation
   │     - Three-way partition excellent for duplicate-heavy data
   │     - Iterative approach safer for 100k+ arrays
   │
   ├─ Performance utility functions:
   │  ├─ generateTestArray()    - Creates test arrays of various patterns
   │  ├─ benchmark()            - Measures execution time
   │  ├─ formatTime()           - Formats timing results
   │  └─ compareTime()          - Calculates and displays performance ratios
   │
   └─ Summary & recommendations for algorithm selection

================================================================================
KEY FEATURES & OPTIMIZATIONS
================================================================================

✓ PERFORMANCE OPTIMIZATIONS:
  • Median-of-three pivot selection prevents worst-case on sorted data
  • Hybrid insertion sort for small subarrays (<10 elements)
  • Three-way partition for efficient duplicate handling
  • Hoare partition scheme reduces swap operations
  • Smart stack ordering in iterative version (O(log n) space guaranteed)
  • Tail recursion optimization possible with some implementations

✓ EDGE CASE HANDLING:
  • Empty arrays handled correctly
  • Single element arrays bypass unnecessary operations
  • Reverse sorted arrays prevent O(n²) behavior
  • Large arrays (100k+) use iterative to prevent stack overflow
  • Arrays with many duplicates optimized via three-way partition
  • Negative numbers and floats supported

✓ CODE QUALITY:
  • Comprehensive inline comments explaining all logic
  • No external dependencies (uses built-in Node.js assert)
  • Full module exports for flexibility
  • Multiple implementation approaches for different use cases
  • Clear test naming for easy identification

✓ ALGORITHMIC CORRECTNESS:
  • All 36 test cases pass
  • Verified correctness across all variants
  • Tested with 100k+ element arrays
  • Content preservation verified (no data loss)
  • Consistency checks between recursive and iterative versions

================================================================================
USAGE EXAMPLES
================================================================================

// Basic usage
const { quickSortRecursive } = require('./quickSort');
const arr = [64, 34, 25, 12, 22, 11, 90];
quickSortRecursive(arr);
console.log(arr); // [11, 12, 22, 25, 34, 64, 90]

// For arrays with duplicates
const { quickSortThreeWay } = require('./quickSort');
const arr = [5, 2, 8, 2, 9, 1, 5, 5];
quickSortThreeWay(arr);

// For large arrays (100k+)
const { quickSortIterative } = require('./quickSort');
const largeArr = Array.from({length: 100000}, () => Math.random());
quickSortIterative(largeArr);

// Auto-selection based on array characteristics
const { quickSortAuto } = require('./quickSort');
const mixed = [3, 1, 4, 1, 5, 9, 2, 6, 5];
quickSortAuto(mixed); // Automatically picks best variant

================================================================================
RUNNING THE FILES
================================================================================

Run tests:
  node quickSort.test.js

Run benchmarks:
  node quickSort.benchmark.js

Use in your code:
  const sorts = require('./quickSort');
  sorts.quickSortRecursive(myArray);

================================================================================
ALGORITHM SELECTION GUIDE
================================================================================

1. FOR EDUCATIONAL PURPOSES:
   → Use quickSortRecursive() - Clean, easy to understand

2. FOR PRODUCTION CODE:
   → Use Array.sort() - Built-in is faster due to optimizations

3. FOR LARGE ARRAYS (>10k):
   → Use quickSortIterative() - Avoids stack overflow risk

4. FOR ARRAYS WITH DUPLICATES:
   → Use quickSortThreeWay() - O(n) best case instead of O(n log n)

5. FOR CUSTOM REQUIREMENTS:
   → Use quickSortAuto() - Analyzes data and picks optimal variant

================================================================================
COMPLEXITY SUMMARY
================================================================================

Algorithm            | Best Case    | Average Case | Worst Case   | Space
─────────────────────┼──────────────┼──────────────┼──────────────┼─────────
QuickSort Standard   | O(n log n)   | O(n log n)   | O(n²)*       | O(log n)
QuickSort ThreeWay   | O(n)†        | O(n log n)   | O(n²)*       | O(log n)
QuickSort Iterative  | O(n log n)   | O(n log n)   | O(n²)*       | O(log n)
MergeSort            | O(n log n)   | O(n log n)   | O(n log n)   | O(n)
HeapSort             | O(n log n)   | O(n log n)   | O(n log n)   | O(1)
Built-in Sort (V8)   | O(n)‡        | O(n log n)   | O(n log n)   | O(n)

* Rare with median-of-three or random pivot selection
† When array has many identical elements
‡ TimSort detects already-sorted data

================================================================================
