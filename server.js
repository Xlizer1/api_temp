require("dotenv").config();
require("./src/config/db");
const http = require("http");
const app = require("./app");
const { executeQuery } = require("./src/helper/common");

const port = process.env.SERVER_PORT || 3001;
const ip = process.env.SERVER_HOST || "localhost";
const useFakeData = process.env.USE_FAKE_DATA === "true";

const server = http.createServer(app);

const mqtt = require("mqtt");
const socketIo = require("socket.io");
const redis = require("redis");
const cron = require("node-cron");

// MQTT client setup
const mqttClient = mqtt.connect("mqtt://13.48.192.48:1883", {
  reconnectPeriod: 1000,
});

// Redis clients for caching and publishing
const redisClient = redis.createClient({
  host: "127.0.0.1", // Default Redis IP (localhost)
  port: 6379, // Default Redis port
});

const redisPublisher = redis.createClient({
  host: "127.0.0.1", // Same host for publisher
  port: 6379, // Same port for publisher
});

// Ensure Redis clients are connected
redisClient.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
});

redisPublisher.connect().catch((err) => {
  console.error("Failed to connect to Redis publisher:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

redisPublisher.on("connect", () => {
  console.log("Redis publisher connected");
});

redisPublisher.on("error", (err) => {
  console.error("Redis publisher error:", err);
});

// Socket.IO configuration with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

function insertSensorReads({ temp, hr, spo2, timestamp }) {
  const sql = `
    INSERT INTO sensor_reads (temp, hr, spo2, created_at, created_by)
    VALUES (${temp}, ${hr}, ${spo2}, FROM_UNIXTIME(${timestamp / 1000}), 1)
  `;
  executeQuery(sql, "inserting sensor reads", (result) => result);
}

// Handle incoming MQTT messages
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("esp32/test");
});

setInterval(() => {
  const topic = "sensor/data";
  let message;

  if (useFakeData) {
    message = generateSensorData(); // Generate fake data
  } else {
    // Handle real data from MQTT broker
    mqttClient.on("message", (topic, messageData) => {
      try {
        const parsedData = JSON.parse(messageData.toString());
        const timestamp = Date.now();

        // Cache real data in Redis with a limited lifespan
        redisClient.rPush(
          "sensorData",
          JSON.stringify({ ...parsedData, timestamp }),
          (err) => {
            if (err) console.error("Error pushing real data to Redis:", err);
            else console.log("Real data pushed to Redis:", parsedData);
          }
        );

        redisClient.expire("sensorData", 600); // Cache for 10 minutes

        // Publish real-time data for Socket.IO streaming
        redisPublisher.publish(
          "sensorUpdates",
          JSON.stringify({ ...parsedData, timestamp })
        );
        io.emit("mqtt_message", { topic, message: parsedData });
      } catch (err) {
        console.error("Failed to parse MQTT message:", err);
      }
    });
    return;
  }

  // Emit data to the front-end (for testing or production use)
  io.emit("mqtt_message", { topic, message });
}, 5000);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  redisPublisher.subscribe("sensorUpdates");

  redisPublisher.on("message", (channel, message) => {
    try {
      const data = JSON.parse(message);
      socket.emit("sensor_data", data); // Emit real-time data to client
    } catch (err) {
      console.error("Failed to parse Redis message:", err);
    }
  });

  socket.on("send_mqtt_message", ({ topic, message }) => {
    mqttClient.publish(topic, message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Periodically move data from Redis to MySQL
cron.schedule("*/60 * * * * *", async () => {
  try {
    const data = await redisClient.lRange("sensorData", 0, -1); // Retrieve all data from Redis

    if (data.length > 0) {
      const sensorReadings = data.map(JSON.parse); // Parse the stored JSON data

      // Insert cached sensor data into MySQL in bulk
      const sqlValues = sensorReadings
        .map(
          ({ temp, hr, spo2, timestamp }) =>
            `(${temp}, ${hr}, ${spo2}, FROM_UNIXTIME(${timestamp / 1000}), 1)`
        )
        .join(", ");
      const sql = `
        INSERT INTO sensor_reads (temp, hr, spo2, created_at, created_by)
        VALUES ${sqlValues};
      `;

      executeQuery(sql, "Bulk insert sensor readings", (result) => {
        console.log("Stored sensor readings in MySQL:", result);
      });

      // Optionally, do not clear Redis data if you want to retain it.
      await redisClient.del("sensorData"); // Comment or remove this line to prevent clearing Redis data
    }
  } catch (err) {
    console.error("Error retrieving data from Redis:", err);
  }
});

// Emit simulated data every 5 seconds for testing
function generateSensorData() {
  const now = new Date().getTime();

  // Generate random values for each sensor
  const simulatedData = {
    temp: (Math.random() * (38 - 28) + 28).toFixed(2), // Random temperature between 28 and 38°C
    hr: Math.floor(Math.random() * (100 - 60 + 1) + 60), // Random heart rate between 60 and 100 bpm
    spo2: Math.floor(Math.random() * (100 - 90 + 1) + 90), // Random SpO2 between 90% and 100%
    timestamp: now,
  };

  // Cache the simulated (or real) data in Redis
  redisClient.rPush("sensorData", JSON.stringify(simulatedData), (err) => {
    if (err) console.error("Error pushing data to Redis:", err);
    else console.log("Data pushed to Redis:", simulatedData);
  });

  // Set Redis expiration time (10 minutes)
  redisClient.expire("sensorData", 600); // Cache for 10 minutes

  // Return a string with the generated random data
  return `start time: ${new Date(now).toLocaleTimeString("en-GB", {
    hour12: false,
  })}, Temperature: ${simulatedData.temp} C, Heart Rate: ${
    simulatedData.hr
  } bpm, SpO2: ${simulatedData.spo2} %`;
}

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://${ip}:${port}`);
});

// Close Redis connections gracefully during server shutdown
process.on("SIGINT", () => {
  console.log("Shutting down...");
  redisClient.quit();
  redisPublisher.quit();
  server.close(() => {
    console.log("Server closed");
  });
});
