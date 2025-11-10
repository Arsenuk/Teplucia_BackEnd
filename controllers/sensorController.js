import { SensorService } from "../services/sensorService.js";

export class SensorController {
  constructor() {
    this.service = new SensorService();
  }

  createSensorData = async (req, res) => {
    try {
      const data = req.body;
      const userId = req.user?.id;

      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid JSON format" });
      }
      if (!userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const savedData = await this.service.createFromPayload(data, userId);
      res.status(201).json({ message: "Data saved successfully", data: savedData });
    } catch (error) {
      console.error("❌ Error saving sensor data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getAllSensorData = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(403).json({ error: "Unauthorized" });

      const sensors =
        user.role === "admin"
          ? await this.service.getAll()
          : await this.service.getAllByUser(user.id);

      res.status(200).json(sensors);
    } catch (error) {
      console.error("❌ Error fetching sensors:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getLatest = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(403).json({ error: "Unauthorized" });

      const latest =
        user.role === "admin"
          ? await this.service.getLatest()
          : await this.service.getLatestByUser(user.id);

      res.status(200).json(latest);
    } catch (error) {
      console.error("❌ Error fetching latest sensor data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
