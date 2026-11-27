export interface UserStateRow {
	state: string | null;
}

export async function findUserStateByTgId(db: D1Database, tgId: number): Promise<UserStateRow | null> {
	return db.prepare('SELECT state FROM users WHERE tg_id = ?').bind(tgId).first<UserStateRow>();
}
