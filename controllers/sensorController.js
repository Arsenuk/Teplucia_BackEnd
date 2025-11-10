import { SensorService } from "../services/sensorService.js";

export const SensorController = {
  async createSensorData(req, res) {
    try {
      const data = req.body;

      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid JSON format" });
      }

      // 🔐 Прив’язуємо до поточного користувача
      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // 🔹 передаємо об’єкт напряму в сервіс
      const savedData = await SensorService.createFromPayload(data, userId);

      res.status(201).json({
        message: "Data saved successfully",
        data: savedData
      });
    } catch (error) {
      console.error("❌ Error saving sensor data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllSensorData(req, res) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // 👑 Якщо користувач — адмін → отримує всі дані
      const sensors = user.role === "admin"
        ? await SensorService.getAll()
        : await SensorService.getAllByUser(user.id);

      res.status(200).json(sensors);
    } catch (error) {
      console.error("❌ Error fetching sensors:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getLatest(req, res) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // 👑 Адмін бачить усіх, звичайний — тільки себе
      const latest = user.role === "admin"
        ? await SensorService.getLatest()
        : await SensorService.getLatestByUser(user.id);

      res.status(200).json(latest);
    } catch (error) {
      console.error("❌ Error fetching latest sensor data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
