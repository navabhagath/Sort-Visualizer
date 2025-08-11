// DOM elements
const arraySizeSlider = document.getElementById('array-size');
const speedSlider = document.getElementById('speed');
const algorithmSelect = document.getElementById('algorithm');
const generateArrayBtn = document.getElementById('generate-array');
const sortBtn = document.getElementById('sort');
const arrayContainer = document.getElementById('array-container');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');

// Global variables
let array = [];
let animationSpeed = 50;
let isSorting = false;

// Initialize
updateSizeValue();
updateSpeedValue();
generateArray();

// Event listeners
arraySizeSlider.addEventListener('input', updateSizeValue);
arraySizeSlider.addEventListener('change', generateArray);
speedSlider.addEventListener('input', updateSpeedValue);
generateArrayBtn.addEventListener('click', generateArray);
sortBtn.addEventListener('click', startSorting);

// Update array size display
function updateSizeValue() {
    sizeValue.textContent = arraySizeSlider.value;
}

// Update speed display
function updateSpeedValue() {
    speedValue.textContent = speedSlider.value;
    animationSpeed = 101 - speedSlider.value; // Invert value (higher = faster)
}

// Generate random array
function generateArray() {
    if (isSorting) return;
    
    const size = parseInt(arraySizeSlider.value);
    array = [];
    arrayContainer.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 5); // Values between 5-105
        
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${array[i]}%`;
        arrayContainer.appendChild(bar);
    }
}

// Start sorting based on selected algorithm
function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    sortBtn.disabled = true;
    generateArrayBtn.disabled = true;
    
    const algorithm = algorithmSelect.value;
    
    switch (algorithm) {
        case 'bubble':
            bubbleSort();
            break;
        case 'selection':
            selectionSort();
            break;
        case 'insertion':
            insertionSort();
            break;
        case 'merge':
            mergeSort();
            break;
        case 'quick':
            quickSort();
            break;
    }
}

// Reset bars to default color
function resetBarColors() {
    const bars = document.querySelectorAll('.array-bar');
    bars.forEach(bar => {
        bar.classList.remove('comparing', 'sorted', 'pivot');
    });
}

// Swap two elements in the array and visualize it
async function swap(i, j) {
    const bars = document.querySelectorAll('.array-bar');
    
    // Highlight the bars being compared
    bars[i].classList.add('comparing');
    bars[j].classList.add('comparing');
    
    // Wait for visualization
    await new Promise(resolve => setTimeout(resolve, animationSpeed));
    
    // Swap values
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    
    // Update heights
    bars[i].style.height = `${array[i]}%`;
    bars[j].style.height = `${array[j]}%`;
    
    // Remove highlight
    bars[i].classList.remove('comparing');
    bars[j].classList.remove('comparing');
}

// Mark a bar as sorted
async function markSorted(index) {
    const bars = document.querySelectorAll('.array-bar');
    bars[index].classList.add('sorted');
    await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
}

// Bubble Sort algorithm
async function bubbleSort() {
    const len = array.length;
    
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
        await markSorted(len - i - 1);
    }
    
    // Mark all as sorted when done
    const bars = document.querySelectorAll('.array-bar');
    bars.forEach(bar => bar.classList.add('sorted'));
    
    isSorting = false;
    sortBtn.disabled = false;
    generateArrayBtn.disabled = false;
}

// Selection Sort algorithm
async function selectionSort() {
    const len = array.length;
    
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        
        // Find the minimum element
        for (let j = i + 1; j < len; j++) {
            // Highlight comparison
            const bars = document.querySelectorAll('.array-bar');
            bars[j].classList.add('comparing');
            bars[minIndex].classList.add('comparing');
            
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
            
            if (array[j] < array[minIndex]) {
                bars[minIndex].classList.remove('comparing');
                minIndex = j;
            } else {
                bars[j].classList.remove('comparing');
            }
        }
        
        // Swap if needed
        if (minIndex !== i) {
            await swap(i, minIndex);
        }
        
        await markSorted(i);
    }
    
    // Mark last element as sorted
    await markSorted(len - 1);
    
    isSorting = false;
    sortBtn.disabled = false;
    generateArrayBtn.disabled = false;
}

// Insertion Sort algorithm
async function insertionSort() {
    const len = array.length;
    
    for (let i = 1; i < len; i++) {
        let j = i;
        
        while (j > 0 && array[j - 1] > array[j]) {
            await swap(j - 1, j);
            j--;
        }
        
        // Mark as sorted up to i
        const bars = document.querySelectorAll('.array-bar');
        bars[i].classList.add('sorted');
        await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
    }
    
    // Mark all as sorted when done
    const bars = document.querySelectorAll('.array-bar');
    bars.forEach(bar => bar.classList.add('sorted'));
    
    isSorting = false;
    sortBtn.disabled = false;
    generateArrayBtn.disabled = false;
}

// Merge Sort algorithm
async function mergeSort() {
    await mergeSortHelper(0, array.length - 1);
    
    // Mark all as sorted when done
    const bars = document.querySelectorAll('.array-bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add('sorted');
        await new Promise(resolve => setTimeout(resolve, animationSpeed / 5));
    }
    
    isSorting = false;
    sortBtn.disabled = false;
    generateArrayBtn.disabled = false;
}

async function mergeSortHelper(low, high) {
    if (low < high) {
        const mid = Math.floor((low + high) / 2);
        
        await mergeSortHelper(low, mid);
        await mergeSortHelper(mid + 1, high);
        await merge(low, mid, high);
    }
}

async function merge(low, mid, high) {
    const bars = document.querySelectorAll('.array-bar');
    const tempArray = [...array];
    
    let i = low;
    let j = mid + 1;
    let k = low;
    
    while (i <= mid && j <= high) {
        // Highlight the two elements being compared
        bars[i].classList.add('comparing');
        bars[j].classList.add('comparing');
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        
        if (tempArray[i] <= tempArray[j]) {
            array[k] = tempArray[i];
            bars[k].style.height = `${array[k]}%`;
            bars[i].classList.remove('comparing');
            i++;
        } else {
            array[k] = tempArray[j];
            bars[k].style.height = `${array[k]}%`;
            bars[j].classList.remove('comparing');
            j++;
        }
        
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        k++;
    }
    
    while (i <= mid) {
        array[k] = tempArray[i];
        bars[k].style.height = `${array[k]}%`;
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        i++;
        k++;
    }
    
    while (j <= high) {
        array[k] = tempArray[j];
        bars[k].style.height = `${array[k]}%`;
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        j++;
        k++;
    }
    
    // Reset colors
    for (let x = low; x <= high; x++) {
        bars[x].classList.remove('comparing');
    }
}

// Quick Sort algorithm
async function quickSort() {
    await quickSortHelper(0, array.length - 1);
    
    // Mark all as sorted when done
    const bars = document.querySelectorAll('.array-bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add('sorted');
        await new Promise(resolve => setTimeout(resolve, animationSpeed / 5));
    }
    
    isSorting = false;
    sortBtn.disabled = false;
    generateArrayBtn.disabled = false;
}

async function quickSortHelper(low, high) {
    if (low < high) {
        const pivotIndex = await partition(low, high);
        
        await quickSortHelper(low, pivotIndex - 1);
        await quickSortHelper(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    const bars = document.querySelectorAll('.array-bar');
    const pivot = array[high];
    
    // Highlight pivot
    bars[high].classList.add('pivot');
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        // Highlight comparison
        bars[j].classList.add('comparing');
        await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
        
        if (array[j] < pivot) {
            i++;
            await swap(i, j);
        }
        
        bars[j].classList.remove('comparing');
    }
    
    await swap(i + 1, high);
    
    // Remove pivot highlight
    bars[high].classList.remove('pivot');
    
    return i + 1;
}