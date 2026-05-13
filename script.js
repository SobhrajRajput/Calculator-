const currentDisplay = document.getElementById('current');
const historyDisplay = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

function clear() {
  currentOperand = '0';
  previousOperand = '';
  operation = undefined;
}

function deleteNumber() {
  if (currentOperand === 'Error') return clear();
  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === '') currentOperand = '0';
}

function appendNumber(number) {
  if (currentOperand === 'Error') clear();
  if (number === '.' && currentOperand.includes('.')) return;
  if (currentOperand === '0' && number !== '.') {
    currentOperand = number;
  } else {
    currentOperand = currentOperand.toString() + number.toString();
  }
}

function chooseOperation(op) {
  if (currentOperand === 'Error') clear();
  if (currentOperand === '') return;
  if (previousOperand !== '') {
    compute();
  }
  operation = op;
  previousOperand = currentOperand;
  currentOperand = '';
}

function compute() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return;
  
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '/':
      if (current === 0) {
        currentOperand = 'Error';
        operation = undefined;
        previousOperand = '';
        return;
      }
      computation = prev / current;
      break;
    case '%':
      computation = prev % current;
      break;
    default:
      return;
  }
  
  currentOperand = Math.round(computation * 100000000) / 100000000;
  operation = undefined;
  previousOperand = '';
}

function updateDisplay() {
  currentDisplay.innerText = currentOperand;
  if (operation != null) {
    let opSymbol = operation;
    if (operation === '/') opSymbol = '÷';
    if (operation === '*') opSymbol = '×';
    historyDisplay.innerText = `${previousOperand} ${opSymbol}`;
  } else {
    historyDisplay.innerText = '';
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Add animation
    button.classList.add('animate-press');
    setTimeout(() => button.classList.remove('animate-press'), 200);

    if (button.dataset.value && button.dataset.action !== 'operator') {
      appendNumber(button.dataset.value);
      updateDisplay();
    } else if (button.dataset.action === 'operator') {
      chooseOperation(button.dataset.value);
      updateDisplay();
    } else if (button.dataset.action === 'clear') {
      clear();
      updateDisplay();
    } else if (button.dataset.action === 'delete') {
      deleteNumber();
      updateDisplay();
    } else if (button.dataset.action === 'calculate') {
      compute();
      updateDisplay();
    }
  });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendNumber(e.key);
    updateDisplay();
    triggerButtonAnimation(e.key);
  }
  if (e.key === '=' || e.key === 'Enter') {
    e.preventDefault(); // Prevent form submission
    compute();
    updateDisplay();
    triggerButtonActionAnimation('calculate');
  }
  if (e.key === 'Backspace') {
    deleteNumber();
    updateDisplay();
    triggerButtonActionAnimation('delete');
  }
  if (e.key === 'Escape') {
    clear();
    updateDisplay();
    triggerButtonActionAnimation('clear');
  }
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
    chooseOperation(e.key);
    updateDisplay();
    triggerOperatorAnimation(e.key);
  }
});

function triggerButtonAnimation(key) {
  const btn = document.querySelector(`.btn[data-value="${key}"]:not([data-action="operator"])`);
  if (btn) {
    btn.classList.add('animate-press');
    setTimeout(() => btn.classList.remove('animate-press'), 200);
  }
}

function triggerButtonActionAnimation(action) {
  const btn = document.querySelector(`.btn[data-action="${action}"]`);
  if (btn) {
    btn.classList.add('animate-press');
    setTimeout(() => btn.classList.remove('animate-press'), 200);
  }
}

function triggerOperatorAnimation(op) {
  const btn = document.querySelector(`.btn[data-value="${op}"][data-action="operator"]`);
  if (btn) {
    btn.classList.add('animate-press');
    setTimeout(() => btn.classList.remove('animate-press'), 200);
  }
}
