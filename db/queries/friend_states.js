import { db, sql } from '../client.js';

export async function getFriendState(user_id_1, user_id_2) {
  const low_user_id = Math.min(user_id_1, user_id_2);
  const high_user_id = Math.max(user_id_1, user_id_2);

  return db.query(sql`
    SELECT friend_state
    FROM FriendStates
    WHERE low_user_id=${low_user_id}
      AND high_user_id=${high_user_id};
  `);
}

export async function getIncomingFriendRequests(user_id) {
  return db.query(sql`
    SELECT requester_user_id, requested_at
    FROM FriendStates
    WHERE friend_state='pending'
      AND requester_user_id<>${user_id}
      AND (low_user_id=${user_id} OR high_user_id=${user_id});
  `);
}
