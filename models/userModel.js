import db from '../config/db.js';

export const getAllUsers = callback => {
  db.query('SELECT * FROM users', callback);
};
