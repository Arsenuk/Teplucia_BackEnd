// controllers/ArduinoController.js
import { ArduinoService } from "../services/arduinoService.js";

export class ArduinoController {
  constructor() {
    this.service = new ArduinoService();
  }

  async receiveData(req, res) {
    try {
      const sensors = req.body;
      if (!sensors || typeof sensors !== "object") {
        return res.status(400).json({ message: "Invalid payload" });
      }
  
      const result = await this.service.processPayload(sensors);
  
      res.status(200).json({
        message: "🌿 Data saved via API key",
        saved: result, // опціонально — що саме було збережено
      });
    } catch (err) {
      console.error("❌ API key insert error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
  
}
