import connect, { sql } from "@databases/pg";

const db = connect();

/*
CREATE TABLE IF NOT EXISTS FriendStates (
  low_user_id INTEGER NOT NULL REFERENCES Users(id),
  high_user_id INTEGER NOT NULL REFERENCES Users(id),
  requester_user_id INTEGER NOT NULL REFERENCES Users(id),
  friend_state VARCHAR(16) NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  state_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (low_user_id, high_user_id),
  CHECK (low_user_id < high_user_id),
  CHECK (requester_user_id IN (low_user_id, high_user_id)),
  CHECK (friend_state IN ('pending', 'accepted', 'rejected', 'removed')),
  CHECK (state_at >= requested_at)
);
*/

export async function getFriendState(user_id_1, user_id_2) {
  const low_user_id = Math.min(user_id_1, user_id_2);
  const high_user_id = Math.max(user_id_1, user_id_2);

  return await db.query(sql`
    SELECT friend_state 
    FROM FriendStates
    WHERE low_user_id=${low_user_id} AND high_user_id=${high_user_id}
    ;`);
}

export async function getFriends(user_id) {
  return await db.query(sql`
    SELECT low_user_id, high_user_id 
    FROM FriendStates
    WHERE 
      (low_user_id=${user_id} OR high_user_id=${user_id}) AND
      friend_state = 'accepted'
    ;`);
}

export async function getIncomingFriendRequests(user_id) {
  return await db.query(sql`
    SELECT requester_user_id, requested_at 
    FROM FriendStates
    WHERE
      (low_user_id = ${user_id} OR high_user_id = ${user_id}) AND 
      requester_user_id <> ${user_id} AND 
      friend_state = 'pending';
    `);
}

export async function sendFriendRequest(requester_user_id, requested_user_id) {
  if (requester_user_id === requested_user_id) {
    throw new Error("Invalid user ids");
  }

  const low_user_id = Math.min(requester_user_id, requested_user_id);
  const high_user_id = Math.max(requester_user_id, requested_user_id);

  return await db.query(sql`
    INSERT INTO FriendStates (low_user_id, high_user_id, requester_user_id)
    VALUES (${low_user_id}, ${high_user_id}, ${requester_user_id});
    `);
}

export async function acceptFriendRequest(user_id, requester_user_id) {
  if (user_id === requester_user_id) {
    throw new Error("Invalid user ids");
  }

  const low_user_id = Math.min(user_id, requester_user_id);
  const high_user_id = Math.max(user_id, requester_user_id);

  return await db.query(sql`
    UPDATE FriendStates
    SET friend_state = 'accepted', state_at = CURRENT_TIMESTAMP
    WHERE 
      friend_state = 'pending' AND 
      requester_user_id = ${requester_user_id} AND
      low_user_id = ${low_user_id} AND
      high_user_id = ${high_user_id};
    `);
}

export async function rejectFriendRequest(user_id, requester_user_id) {
  if (user_id === requester_user_id) {
    throw new Error("Invalid user ids");
  }

  const low_user_id = Math.min(user_id, requester_user_id);
  const high_user_id = Math.max(user_id, requester_user_id);

  return await db.query(sql`
    UPDATE FriendStates
    SET friend_state= 'rejected', state_at = CURRENT_TIMESTAMP
    WHERE 
      friend_state = 'pending' AND 
      requester_user_id = ${requester_user_id} AND
      low_user_id = ${low_user_id} AND
      high_user_id = ${high_user_id};
    `);
}

export async function removeFriendship(user_id_1, user_id_2) {
  if (user_id_1 === user_id_2) {
    throw new Error("Invalid user ids");
  }

  const low_user_id = Math.min(user_id_1, user_id_2);
  const high_user_id = Math.max(user_id_1, user_id_2);

  return await db.query(sql`
    UPDATE FriendStates
    SET friend_state= 'removed', state_at = CURRENT_TIMESTAMP
    WHERE 
      friend_state = 'accepted' AND 
      low_user_id = ${low_user_id} AND
      high_user_id = ${high_user_id};
    `);
}
