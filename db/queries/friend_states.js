import { db, sql } from '../client.js';

export async function getFriendState(userId1, userId2) {
  const lowUserId = Math.min(userId1, userId2);
  const highUserId = Math.max(userId1, userId2);
  const rows = await db.query(sql`
    SELECT friend_state
    FROM FriendStates
    WHERE low_user_id=${lowUserId}
      AND high_user_id=${highUserId};
  `);

  return rows[0]?.friend_state ?? null;
}

export async function getIncomingFriendRequests(userId) {
  return db.query(sql`
    SELECT requester_user_id, requested_at
    FROM FriendStates
    WHERE friend_state='pending'
      AND requester_user_id<>${userId}
      AND (low_user_id=${userId} OR high_user_id=${userId})
    ORDER BY requested_at, requester_user_id;
  `);
}
