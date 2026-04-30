/**
 * QUICKSORT MODULE - Complete Implementation
 * Includes recursive and iterative approaches with performance optimizations
 * Handles edge cases: empty arrays, duplicates, already sorted arrays, large datasets
 */

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Swaps two elements in an array at specified indices
 * @param {Array} arr - The array to modify
 * @param {number} i - First index
 * @param {number} j - Second index
 */
function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

/**
 * Gets the median-of-three pivot to improve performance on partially sorted arrays
 * Helps avoid worst-case O(n²) behavior
 * @param {Array} arr - The array
 * @param {number} low - Start index
 * @param {number} high - End index
 * @returns {number} Index of the median pivot
 */
function medianOfThree(arr, low, high) {
  const mid = Math.floor((low + high) / 2);
  
  // Sort low, mid, high to get median
  if (arr[low] > arr[mid]) swap(arr, low, mid);
  if (arr[mid] > arr[high]) swap(arr, mid, high);
  if (arr[low] > arr[mid]) swap(arr, low, mid);
  
  return mid;
}

/**
 * Partitions array segment using Lomuto partition scheme
 * Elements <= pivot moved to left, > pivot to right
 * @param {Array} arr - The array
 * @param {number} low - Start index
 * @param {number} high - End index
 * @returns {number} Final pivot position
 */
function partitionLomuto(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  // Move all smaller elements to the left
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  
  swap(arr, i + 1, high);
  return i + 1;
}

/**
 * Partitions array segment using Hoare partition scheme
 * More efficient - fewer swaps than Lomuto
 * @param {Array} arr - The array
 * @param {number} low - Start index
 * @param {number} high - End index
 * @returns {number} Final pivot position
 */
function partitionHoare(arr, low, high) {
  const pivot = arr[Math.floor((low + high) / 2)];
  let i = low - 1;
  let j = high + 1;
  
  while (true) {
    // Move left pointer right until element >= pivot
    do {
      i++;
    } while (arr[i] < pivot);
    
    // Move right pointer left until element <= pivot
    do {
      j--;
    } while (arr[j] > pivot);
    
    // If pointers crossed, partition complete
    if (i >= j) return j;
    
    swap(arr, i, j);
  }
}

/**
 * Insertion sort for small subarrays (hybrid approach)
 * More efficient than quicksort for arrays with size < 10
 * @param {Array} arr - The array
 * @param {number} low - Start index
 * @param {number} high - End index
 */
function insertionSort(arr, low, high) {
  for (let i = low + 1; i <= high; i++) {
    const key = arr[i];
    let j = i - 1;
    
    while (j >= low && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

// =====================================================
// RECURSIVE QUICKSORT
// =====================================================

/**
 * Recursive QuickSort implementation with optimization
 * Uses median-of-three pivot selection and switches to insertion sort for small arrays
 * @param {Array} arr - The array to sort
 * @param {number} low - Start index (default 0)
 * @param {number} high - End index (default arr.length - 1)
 * @returns {Array} Reference to sorted array
 */
function quickSortRecursive(arr, low = 0, high = arr.length - 1) {
  // Threshold for switching to insertion sort
  const INSERTION_SORT_THRESHOLD = 10;
  
  // Base case: array too small or invalid range
  if (low >= high) return arr;
  
  // For small arrays, use insertion sort (more efficient)
  if (high - low < INSERTION_SORT_THRESHOLD) {
    insertionSort(arr, low, high);
    return arr;
  }
  
  // Optimize pivot selection for better performance
  medianOfThree(arr, low, high);
  
  // Partition and recursively sort both halves
  const pi = partitionLomuto(arr, low, high);
  quickSortRecursive(arr, low, pi - 1);
  quickSortRecursive(arr, pi + 1, high);
  
  return arr;
}

/**
 * Optimized recursive QuickSort using Hoare partition
 * Fewer swaps than Lomuto approach
 * @param {Array} arr - The array to sort
 * @param {number} low - Start index (default 0)
 * @param {number} high - End index (default arr.length - 1)
 * @returns {Array} Reference to sorted array
 */
function quickSortRecursiveHoare(arr, low = 0, high = arr.length - 1) {
  const INSERTION_SORT_THRESHOLD = 10;
  
  if (low >= high) return arr;
  
  if (high - low < INSERTION_SORT_THRESHOLD) {
    insertionSort(arr, low, high);
    return arr;
  }
  
  // Using Hoare partition for better performance
  const pi = partitionHoare(arr, low, high);
  quickSortRecursive(arr, low, pi);
  quickSortRecursive(arr, pi + 1, high);
  
  return arr;
}

// =====================================================
// ITERATIVE QUICKSORT
// =====================================================

/**
 * Iterative QuickSort using explicit stack
 * Avoids recursion overhead and stack overflow on very large arrays
 * Better memory management for huge datasets
 * @param {Array} arr - The array to sort
 * @returns {Array} Reference to sorted array
 */
function quickSortIterative(arr) {
  // Handle edge case
  if (arr.length <= 1) return arr;
  
  const INSERTION_SORT_THRESHOLD = 10;
  const stack = [];
  
  // Push initial boundaries to stack
  stack.push({ low: 0, high: arr.length - 1 });
  
  // Process stack until empty
  while (stack.length > 0) {
    const { low, high } = stack.pop();
    
    // Skip if invalid or too small
    if (low >= high) continue;
    
    // Use insertion sort for small subarrays
    if (high - low < INSERTION_SORT_THRESHOLD) {
      insertionSort(arr, low, high);
      continue;
    }
    
    // Optimize pivot selection
    medianOfThree(arr, low, high);
    
    // Partition the array
    const pi = partitionLomuto(arr, low, high);
    
    // Push larger partition first to optimize stack space
    // This keeps stack depth at O(log n) even for worst case
    if (pi - low > high - pi) {
      // Left partition is larger, push it first
      stack.push({ low: low, high: pi - 1 });
      stack.push({ low: pi + 1, high: high });
    } else {
      // Right partition is larger, push it first
      stack.push({ low: pi + 1, high: high });
      stack.push({ low: low, high: pi - 1 });
    }
  }
  
  return arr;
}

/**
 * Iterative QuickSort using Hoare partition (optimized version)
 * Fewer swaps and potentially better cache locality
 * @param {Array} arr - The array to sort
 * @returns {Array} Reference to sorted array
 */
function quickSortIterativeHoare(arr) {
  if (arr.length <= 1) return arr;
  
  const INSERTION_SORT_THRESHOLD = 10;
  const stack = [];
  
  stack.push({ low: 0, high: arr.length - 1 });
  
  while (stack.length > 0) {
    const { low, high } = stack.pop();
    
    if (low >= high) continue;
    
    if (high - low < INSERTION_SORT_THRESHOLD) {
      insertionSort(arr, low, high);
      continue;
    }
    
    const pi = partitionHoare(arr, low, high);
    
    // Push larger partition first for O(log n) space complexity
    if (pi - low > high - pi) {
      stack.push({ low: low, high: pi });
      stack.push({ low: pi + 1, high: high });
    } else {
      stack.push({ low: pi + 1, high: high });
      stack.push({ low: low, high: pi });
    }
  }
  
  return arr;
}

// =====================================================
// HYBRID & SPECIALIZED IMPLEMENTATIONS
// =====================================================

/**
 * Tail-recursive optimized QuickSort
 * Compiler can optimize tail recursion to iteration
 * Recursively calls on smaller partition only
 * @param {Array} arr - The array to sort
 * @param {number} low - Start index
 * @param {number} high - End index
 * @returns {Array} Reference to sorted array
 */
function quickSortTailRecursive(arr, low = 0, high = arr.length - 1) {
  const INSERTION_SORT_THRESHOLD = 10;
  
  while (low < high) {
    if (high - low < INSERTION_SORT_THRESHOLD) {
      insertionSort(arr, low, high);
      break;
    }
    
    medianOfThree(arr, low, high);
    const pi = partitionLomuto(arr, low, high);
    
    // Recursively sort smaller partition, iterate on larger
    if (pi - low < high - pi) {
      quickSortTailRecursive(arr, low, pi - 1);
      low = pi + 1; // Continue with right partition
    } else {
      quickSortTailRecursive(arr, pi + 1, high);
      high = pi - 1; // Continue with left partition
    }
  }
  
  return arr;
}

/**
 * Random pivot QuickSort
 * Uses random pivot selection instead of median-of-three
 * Good average performance, simpler logic
 * @param {Array} arr - The array to sort
 * @param {number} low - Start index
 * @param {number} high - End index
 * @returns {Array} Reference to sorted array
 */
function quickSortRandom(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return arr;
  
  if (high - low < 10) {
    insertionSort(arr, low, high);
    return arr;
  }
  
  // Pick random pivot
  const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
  swap(arr, randomIndex, high);
  
  const pi = partitionLomuto(arr, low, high);
  quickSortRandom(arr, low, pi - 1);
  quickSortRandom(arr, pi + 1, high);
  
  return arr;
}

// =====================================================
// THREE-WAY PARTITION QUICKSORT (handles duplicates efficiently)
// =====================================================

/**
 * Three-way partition QuickSort (Bentley-McIlroy)
 * Optimized for arrays with many duplicate elements
 * Divides array into three parts: < pivot, = pivot, > pivot
 * @param {Array} arr - The array to sort
 * @param {number} low - Start index
 * @param {number} high - End index
 * @returns {Array} Reference to sorted array
 */
function quickSortThreeWay(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return arr;
  
  if (high - low < 10) {
    insertionSort(arr, low, high);
    return arr;
  }
  
  const pivot = arr[Math.floor((low + high) / 2)];
  let lt = low;      // arr[low..lt-1] < pivot
  let gt = high + 1; // arr[gt..high] > pivot
  let i = low;       // arr[lt..i-1] = pivot
  
  // Partition into three groups: < pivot, = pivot, > pivot
  while (i < gt) {
    if (arr[i] < pivot) {
      swap(arr, i, lt);
      i++;
      lt++;
    } else if (arr[i] > pivot) {
      gt--;
      swap(arr, i, gt);
    } else {
      i++;
    }
  }
  
  // Now: arr[low..lt-1] < pivot, arr[lt..i-1] = pivot, arr[gt..high] > pivot
  // Recursively sort left and right partitions, skip middle (all equal to pivot)
  quickSortThreeWay(arr, low, lt - 1);
  quickSortThreeWay(arr, gt, high);
  
  return arr;
}

// =====================================================
// PERFORMANCE UTILITY FUNCTIONS
// =====================================================

/**
 * Analyzes array characteristics to recommend best algorithm
 * @param {Array} arr - The array to analyze
 * @returns {Object} Analysis results
 */
function analyzeArray(arr) {
  if (arr.length === 0) return { size: 0, isDuplicate: false, isSorted: false };
  
  let duplicateCount = 0;
  let isSorted = true;
  const seen = new Set();
  
  for (let i = 0; i < arr.length; i++) {
    if (seen.has(arr[i])) duplicateCount++;
    seen.add(arr[i]);
    
    if (i > 0 && arr[i] < arr[i - 1]) isSorted = false;
  }
  
  const duplicateRatio = duplicateCount / arr.length;
  
  return {
    size: arr.length,
    hasDuplicates: duplicateRatio > 0.1,
    duplicateRatio,
    isSorted,
    recommendedSort: isSorted ? 'already sorted' : (duplicateRatio > 0.1 ? 'threeWay' : 'standard')
  };
}

/**
 * Auto-selects best QuickSort variant based on array characteristics
 * @param {Array} arr - The array to sort
 * @returns {Array} Sorted array
 */
function quickSortAuto(arr) {
  if (arr.length <= 1) return arr;
  
  const analysis = analyzeArray(arr);
  
  // Already sorted - just return
  if (analysis.isSorted) return arr;
  
  // Many duplicates - use three-way partition
  if (analysis.hasDuplicates) return quickSortThreeWay(arr);
  
  // Large arrays - use iterative to avoid stack overflow
  if (analysis.size > 100000) return quickSortIterative(arr);
  
  // Default - use optimized recursive
  return quickSortRecursive(arr);
}

// =====================================================
// EXPORT/MODULE INTERFACE
// =====================================================

// For CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Main implementations
    quickSortRecursive,
    quickSortRecursiveHoare,
    quickSortIterative,
    quickSortIterativeHoare,
    quickSortTailRecursive,
    quickSortRandom,
    quickSortThreeWay,
    quickSortAuto,
    
    // Utilities
    analyzeArray,
    
    // Helpers (exposed for testing)
    swap,
    partition: partitionLomuto,
    partitionLomuto,
    partitionHoare,
    insertionSort,
    medianOfThree
  };
}

// =====================================================
// TEST CASES & EXAMPLES
// =====================================================

// Uncomment to run tests
/*
function runTests() {
  console.log('=== QUICKSORT TEST SUITE ===\n');
  
  // Test 1: Basic sorting
  console.log('Test 1: Basic Array');
  const arr1 = [64, 34, 25, 12, 22, 11, 90];
  console.log('Before:', arr1);
  console.log('After (Recursive):', quickSortRecursive([...arr1]));
  
  // Test 2: Array with duplicates
  console.log('\nTest 2: Array with Duplicates');
  const arr2 = [5, 2, 8, 2, 9, 1, 5, 5];
  console.log('Before:', arr2);
  console.log('After (ThreeWay):', quickSortThreeWay([...arr2]));
  
  // Test 3: Already sorted array
  console.log('\nTest 3: Already Sorted Array');
  const arr3 = [1, 2, 3, 4, 5];
  console.log('Before:', arr3);
  console.log('After (Iterative):', quickSortIterative([...arr3]));
  
  // Test 4: Reverse sorted array
  console.log('\nTest 4: Reverse Sorted Array');
  const arr4 = [5, 4, 3, 2, 1];
  console.log('Before:', arr4);
  console.log('After (Recursive):', quickSortRecursive([...arr4]));
  
  // Test 5: Empty and single element
  console.log('\nTest 5: Edge Cases');
  console.log('Empty:', quickSortRecursive([]));
  console.log('Single:', quickSortRecursive([42]));
  
  // Test 6: Large random array
  console.log('\nTest 6: Large Array (1000 elements)');
  const arr6 = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
  const start = performance.now();
  quickSortIterative([...arr6]);
  const end = performance.now();
  console.log(`Sorted in ${(end - start).toFixed(3)}ms`);
  
  // Test 7: Auto selection
  console.log('\nTest 7: Auto Selection');
  const arr7 = [3, 1, 4, 1, 5, 9, 2, 6];
  const analysis = analyzeArray(arr7);
  console.log('Analysis:', analysis);
  console.log('Result:', quickSortAuto([...arr7]));
}

// runTests();
*/
