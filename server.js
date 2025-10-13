const express = require("express");
const path = require("path");
const app = express();

// Define the port number (e.g., 3000)
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'dist')));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});