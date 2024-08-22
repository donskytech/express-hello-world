const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Root route to display "Hello Donskytech"
app.get('/', (req, res) => {
    res.send('Hello Water Vending Machine - test');
});

// Webhook route to handle POST requests
app.post('/webhook', (req, res) => {
    // Log the webhook payload
    console.log('Received webhook:', req.body);

    // Broadcast the payload to all connected WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(req.body));
        }
    });

    // Respond with a 200 status to acknowledge receipt of the webhook
    res.status(200).send('Webhook received');
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send a welcome message to the client
    ws.send('Welcome to the WebSocket server');

    // Handle incoming messages from clients
    ws.on('message', (message) => {
        console.log('Received message:', message);
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
