const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args)); // Import node-fetch dynamically
const app = express();
const PORT = 3000;

// Setup EJS as the template engine
app.set("view engine", "ejs");

// static file
app.use("/styles", express.static("styles"));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Slash Route
app.get("/", (req, res) => {
  res.render("index", { image: null, error: null }); // Pass default values
});

// Route to generate an image
app.post("/generate-image", async (req, res) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set("prompt", req.body.prompt || "Default prompt");
  encodedParams.set("width", "500");
  encodedParams.set("height", "700");
  encodedParams.set("seed", "918440");
  encodedParams.set("model", "flux");

  const url = "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/fluximagegenerate/generateimage.php";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "57c1841b0bmsh0f8b0f457d1bceep14a871jsne30ab18e84af",
      "x-rapidapi-host": "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedParams,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const buffer = await response.buffer();
    const base64Image = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    res.render("index", { image: base64Image, error: null });
  } catch (error) {
    console.error("Error occurred:", error);
    res.render("index", { image: null, error: "Error generating image" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
