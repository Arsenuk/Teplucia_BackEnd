// controllers/RecommendationController.js
import { RecommendationService } from "../services/recommendationService.js";

export class RecommendationController {
  constructor() {
    this.service = new RecommendationService();
  }

  getRecommendations = async (req, res) => {
    try {
      const recs = await this.service.generate(req.user.id);
      res.json(recs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}
