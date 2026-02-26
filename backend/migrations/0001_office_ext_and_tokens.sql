-- Migration: Download Tokens Table
CREATE TABLE IF NOT EXISTS download_tokens (
    token TEXT PRIMARY KEY,
    real_url TEXT NOT NULL,
    expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_token_expires ON download_tokens(expires_at);
