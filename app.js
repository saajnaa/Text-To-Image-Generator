const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Import node-fetch dynamically
const app = express();
const PORT = 3000;

// Setup EJS as the template engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Slash Route
app.get("/", (req, res) => {
    res.render('index'); // Render the index.ejs file
});

// Route to generate an image
app.post("/generate-image", async (req, res) => {
    console.log("Received request to generate image");
    console.log("Request body:", req.body);

    const encodedParams = new URLSearchParams();
    encodedParams.set('prompt', req.body.prompt || 'A cyberpunk city at night, illuminated by neon signs and holographic billboards. A lone figure in a futuristic trench coat walks through the rain-soaked streets, their face partially hidden by a glowing visor. The environment is filled with flying cars, robotic street vendors, and digital graffiti on skyscrapers. The wet pavement reflects the vibrant lights, creating a cinematic atmosphere. Ultra-detailed, hyper-realistic, 4K, dramatic lighting, and cyberpunk aesthetics.');
    encodedParams.set('width', '1024');
    encodedParams.set('height', '1024');
    encodedParams.set('seed', '918440');
    encodedParams.set('model', 'flux');

    const url = 'https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/fluximagegenerate/generateimage.php';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '57c1841b0bmsh0f8b0f457d1bceep14a871jsne30ab18e84af',
            'x-rapidapi-host': 'ai-text-to-image-generator-flux-free-api.p.rapidapi.com',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodedParams
    };

    try {
        console.log("Sending request to API...");
        const response = await fetch(url, options);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        // Get the response as a buffer (binary data)
        const buffer = await response.buffer();

        // Convert the buffer to a base64 string
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

        // Render the result page with the base64 image
        res.render('result', { image: base64Image });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send('Error generating image');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});