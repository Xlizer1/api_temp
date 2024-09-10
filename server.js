require("dotenv").config();
require("./src/config/db");
const http = require("http");
const app = require("./app");
const mqtt = require("mqtt");
const socketIo = require('socket.io');
const port =
  process.env.SERVER_PORT === undefined ? 3001 : process.env.SERVER_PORT;
const ip =
  process.env.SERVER_HOST === undefined ? "localhost" : process.env.SERVER_HOST;

let server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Update this with your React app's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const mqttClient = mqtt.connect("mqtt://13.48.192.48:1883");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("esp32/test");
});

mqttClient.on("message", (topic, message) => {
  console.log(`Message received on topic ${topic}: ${message.toString()}`);
  io.emit("mqtt_message", { topic, message: message.toString() });
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("send_mqtt_message", (data) => {
    const { topic, message } = data;
    console.log(message)
    mqttClient.publish(topic, message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port);

console.log("**************", ip + ":" + port, "**************");