import { getAllUsers } from '../models/userModel.js';

export const getUsers = (req, res) => {
  getAllUsers((err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};
