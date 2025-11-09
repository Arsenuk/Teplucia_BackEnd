import { SensorService } from "../services/sensorService.js";

export const SensorController = {
  async createSensorData(req, res) {
    try {
      const data = req.body;

      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid JSON format" });
      }

      // 🔹 передаємо об’єкт напряму в сервіс, хай він розбирається
      const savedData = await SensorService.createFromPayload(data);

      res.status(201).json({ message: "Data saved successfully", data: savedData });
    } catch (error) {
      console.error("Error saving sensor data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllSensorData(req, res) {
    try {
      const sensors = await SensorService.getAll();
      res.status(200).json(sensors);
    } catch (error) {
      console.error("Error fetching sensors:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getLatest(req, res) {
    try {
      const latest = await SensorService.getLatest();
      res.status(200).json(latest);
    } catch (error) {
      console.error("Error fetching latest sensor data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
