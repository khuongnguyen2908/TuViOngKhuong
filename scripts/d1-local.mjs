// Giả lập D1 của Cloudflare bằng SQLite có sẵn trong Node (node:sqlite), dùng cho server chạy thử và kiểm thử.
// Chỉ hỗ trợ phần worker góp ý dùng: prepare(sql).bind(...).all() / first() / run().
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function d1Local(file = ':memory:') {
  const db = new DatabaseSync(file);
  db.exec(readFileSync(fileURLToPath(new URL('../worker/gop-y.sql', import.meta.url)), 'utf8'));
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    all: async () => ({ results: db.prepare(sql).all(...args).map((r) => ({ ...r })) }),
    first: async () => { const r = db.prepare(sql).get(...args); return r ? { ...r } : null; },
    run: async () => { const r = db.prepare(sql).run(...args); return { meta: { last_row_id: Number(r.lastInsertRowid), changes: r.changes } }; },
  });
  return { prepare: (sql) => stmt(sql), raw: db };
}
