-- Bảng góp ý. Tạo một lần:  npx wrangler d1 execute tuvi-gop-y --remote --file=gop-y.sql
CREATE TABLE IF NOT EXISTS gop_y (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ten TEXT NOT NULL,
  sao INTEGER NOT NULL CHECK (sao BETWEEN 1 AND 5),
  noi_dung TEXT NOT NULL,
  luc INTEGER NOT NULL,            -- thời điểm gửi (mili giây)
  hien INTEGER NOT NULL DEFAULT 1, -- 1 = hiện, 0 = ẩn hoặc chờ duyệt
  ip_bam TEXT                      -- IP đã băm (kèm SALT), chỉ để giới hạn số lần gửi
);
CREATE INDEX IF NOT EXISTS gop_y_hien ON gop_y (hien, id);
CREATE INDEX IF NOT EXISTS gop_y_ip ON gop_y (ip_bam, luc);
