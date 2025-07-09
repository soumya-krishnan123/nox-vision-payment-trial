const db = require('../config/db');

// notificationModel.js

exports.createNotification = async ({ user_id, title, message, type }) => {
  const query = `
    INSERT INTO notifications (user_id, title, message, type, is_read, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, false, 'active', NOW(), NOW())
    RETURNING *;
  `;
  const values = [user_id, title, message, type];
  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.getNotificationsForUser = async (user_id) => {
  const query = `
    SELECT * FROM notifications
    WHERE user_id = $1 AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 20;
  `;
  const { rows } = await db.query(query, [user_id]);
  return rows;
};
