import connect, { sql } from "@databases/pg";

const db = connect();

export async function getFriendState(user_id_1, user_id_2) {
  low_user_id = Math.min(user_id_1, user_id_2);
  high_user_id = Math.max(user_id_1, user_id_2);

  return await db.query(sql`
    SELECT friend_state 
    FROM FriendStates
    WHERE low_user_id=${low_user_id} AND high_user_id=${high_user_id}
    ;`);
}

export async function getIncomingFriendRequests(user_id) {
  return await db.query(sql`
    SELECT outgoing_user_id, requested_at 
    FROM FriendStates
    WHERE incoming_user_id=${user_id} AND friend_state='pending'
    ;`);
}

export async function acceptFriendRequest(low_user_id, high_user_id) {
  return await db.query(sql`
    UPDATE FriendStates
    SET friend_state='accepted'
    WHERE low_user_id=${low_user_id} AND high_user_id=${high_user_id}
    ;`);
}
