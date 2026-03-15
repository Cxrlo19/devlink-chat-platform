import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 5000;

// Basic REST route to test token
app.get("/test", (req, res) => {
    res.json({ message: "Chat service is running!" });
});

// Create HTTP server for WebSocket
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

// Helper: validate JWT token
function verifyToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string };
        return decoded.userId;
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}

// WebSocket connection
wss.on("connection", (ws: WebSocket, req) => {
    // Extract token from query string, e.g., ws://localhost:5000/?token=<jwt>
    const params = new URLSearchParams(req.url?.split("?")[1]);
    const token = params.get("token");

    if (!token) {
        ws.send(JSON.stringify({ error: "Unauthorized: No token provided" }));
        ws.close();
        return;
    }

    const userId = verifyToken(token);
    if (!userId) {
        ws.send(JSON.stringify({ error: "Unauthorized: Invalid token" }));
        ws.close();
        return;
    }

    console.log(`User ${userId} connected to chat`);

    ws.on("message", (message) => {
        console.log(`Received from ${userId}:`, message.toString());
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ userId, message: message.toString() }));
            }
        });
    });

    ws.on("close", () => {
        console.log(`User ${userId} disconnected`);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Chat service running on port ${PORT}`);
});
