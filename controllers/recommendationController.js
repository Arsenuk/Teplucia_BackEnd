import { RecommendationService } from "../services/recommendationService.js";

export const getRecommendations = async (req, res) => {
  try {
    const recs = await RecommendationService.generate(req.user.id);
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
