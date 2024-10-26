require("dotenv").config();
require("./src/config/db");
const http = require("http");
const app = require("./app");
const mqtt = require("mqtt");
const socketIo = require("socket.io");
const { executeQuery } = require("./src/helper/common");
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
    credentials: true,
  },
});

const mqttClient = mqtt.connect("mqtt://13.48.192.48:1883");

async function insertSensorReads(params) {
  let sql = `
    INSERT INTO
      sensor_reads(
            temp,
            hr,
            spo2,
            created_at,
            created_by
        )
    VALUES (
        ${params?.temp},
        ${params?.hr},
        ${params?.spo2},
        NOW(),
        ${1}
    )
  `;
  executeQuery(sql, "inserting sensor reads", (result) => result);
}

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("esp32/test");
});

mqttClient.on("message", (topic, message) => {
  console.log(`Message received on topic ${topic}: ${message.toString()}`);
  io.emit("mqtt_message", { topic, message: message.toString() });
});

function generateSensorData() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;
  const temperature = "28.39 C";
  const heartRate = "0 bpm";
  const spo2 = "0 %";
  const sensorData = `start time: ${timeString} Temperature: ${temperature}, Heart Rate: ${heartRate}, SpO2: ${spo2}`;
  insertSensorReads({ temp: 28.39, hr: 70, spo2: 98 });
  return sensorData;
}

setInterval(() => {
  const topic = "sensor/data"; // Replace with the actual topic if needed
  io.emit("mqtt_message", { topic, message: generateSensorData() });
}, 5000); // 5000 milliseconds = 5 seconds

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("send_mqtt_message", (data) => {
    const { topic, message } = data;
    console.log(message);
    mqttClient.publish(topic, message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port);

console.log("**************", ip + ":" + port, "**************");
