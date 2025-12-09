const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to read JSON from frontend

// ✅ Calculator POST API
app.post("/calculate", (req, res) => {
  const { expression } = req.body;

  try {
    // Evaluate the math expression
    const result = eval(expression);

    // Send result back to frontend
    res.json({ result });
  } catch (error) {
    // Handle invalid expressions
    res.status(400).json({ error: "Invalid expression" });
  }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});