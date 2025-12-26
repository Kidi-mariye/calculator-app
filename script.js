const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const clear = document.getElementById("clear");
const equals = document.getElementById("equals");
const backspace = document.getElementById("backspace");

let expression = "";
let lastInput = "";

// Check if a character is operators
function isOperator(char) {
  return ["+", "-", "*", "/"].includes(char);
}

// Update display safely
function updateDisplay() {
  display.value = expression.slice(0, 20); // limit display length
}

// Handle button clicks
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    if (!value) return;

    // Prevent two consecutive operators
    if (isOperator(value) && expression === "" && value !== "-") return;
    if (isOperator(value) && isOperator(lastInput)) return;

    // Prevent multiple decimals in a number
    if (value === ".") {
      const parts = expression.split(/[\+\-\*\/]/);
      const lastNumber = parts[parts.length - 1];
      if (lastNumber.includes(".")) return;
    }

    expression += value;
    lastInput = value;
    updateDisplay();
  });
});

// Clear button
clear.addEventListener("click", () => {
  expression = "";
  lastInput = "";
  updateDisplay();
});

// Backspace button
backspace.addEventListener("click", () => {
  expression = expression.slice(0, -1);
  lastInput = expression.slice(-1) || "";
  updateDisplay();
});

// Evaluate expression (with backend)
async function calculate() {
  if (!expression) return;

  // Remove trailing operator
  if (isOperator(expression.slice(-1))) {
    expression = expression.slice(0, -1);
  }

  try {
    const response = await fetch("http://localhost:3000/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression }),
    });

    const data = await response.json();

    if (data.result !== undefined) {
      // Round result to max 4 decimals
      const rounded = Math.round(data.result * 10000) / 10000;
      display.value = rounded;
      expression = rounded.toString(); // allow chained calculations
      lastInput = "";
    } else {
      display.value = "Error";
      expression = "";
      lastInput = "";
    }
  } catch (error) {
    display.value = "Error";
    expression = "";
    lastInput = "";
  }
}

// Equals button click
equals.addEventListener ("click", calculate);

// Keyboard support
document.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || isOperator(e.key) || e.key === ".") {
    document.querySelector(`.btn[data-value="${e.key}"]`)?.click();
  } else if (e.key === "Enter") {
    calculate();
  } else if (e.key === "Backspace") {
    backspace.click();
  } else if (e.key === "Escape") {
    clear.click();
  }
}) ;
