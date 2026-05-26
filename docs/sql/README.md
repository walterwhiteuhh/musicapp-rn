# SQL Planning Notes

This directory contains backend planning DDL for future iterations.

- [backend_schema_v1.sql](C:/Users/timof/Downloads/musicapp-rn/docs/sql/backend_schema_v1.sql) is non-destructive (`IF NOT EXISTS`) and intended as an architecture contract.
- The script assumes a canonical `users` table already exists and references it through `user_id`.
- `external_api_credentials` is designed for encrypted API key storage only (`credential_ciphertext`, `key_version`, `secret_fingerprint`), not plaintext keys.
- No migration runner is configured in the app yet. Apply this schema only in backend infrastructure repos/environments.
