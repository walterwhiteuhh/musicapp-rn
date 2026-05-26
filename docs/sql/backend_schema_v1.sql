-- Klangfeld Backend Schema v1 (planning contract)
-- Target: PostgreSQL 14+
-- Safety:
-- 1) Non-destructive DDL only (`IF NOT EXISTS`).
-- 2) `users` is treated as an existing canonical table.
-- 3) API keys are stored encrypted (ciphertext), never as plaintext.

BEGIN;

-- Required extension for uuid generation in local/dev setups.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Assumption: canonical users table already exists in auth/core schema.
-- Expected minimal shape:
--   users(id uuid primary key, created_at timestamptz, ...)
-- ---------------------------------------------------------------------------

-- Content entities used by recommendation/statistics layers.
CREATE TABLE IF NOT EXISTS feature_entities (
  entity_id text PRIMARY KEY,
  entity_type text NOT NULL CHECK (entity_type IN ('track', 'set', 'radio_show')),
  source_platform text NOT NULL,
  source_kind text NOT NULL,
  source_url text NOT NULL,
  source_id text,
  title text,
  primary_artist text,
  timestamp_ingested timestamptz NOT NULL DEFAULT now(),
  feature_schema_version smallint NOT NULL DEFAULT 1,
  provenance text NOT NULL DEFAULT 'imported'
    CHECK (provenance IN ('human', 'rule', 'model', 'imported')),
  quality_score numeric(5,4) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Numerical and ordinal feature layer (single row per entity per schema version).
CREATE TABLE IF NOT EXISTS entity_numeric_features (
  entity_id text NOT NULL REFERENCES feature_entities(entity_id) ON DELETE CASCADE,
  feature_schema_version smallint NOT NULL DEFAULT 1,
  duration_ms integer,
  bpm_est numeric(6,2),
  energy numeric(5,2),
  density numeric(5,2),
  texture numeric(5,2),
  space numeric(5,2),
  rhythm numeric(5,2),
  kick_pressure_score numeric(5,2),
  drop_density_score numeric(5,2),
  melodic_lift_score numeric(5,2),
  kick_pressure_level text CHECK (kick_pressure_level IN ('low', 'medium', 'high', 'extreme')),
  drop_density_level text CHECK (drop_density_level IN ('low', 'medium', 'high', 'extreme')),
  melodic_lift_level text CHECK (melodic_lift_level IN ('low', 'medium', 'high', 'extreme')),
  region text,
  event_type text,
  is_live boolean,
  is_radio_show boolean,
  year_band text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_id, feature_schema_version)
);

-- Weighted multi-label categorical features.
CREATE TABLE IF NOT EXISTS entity_tag_weights (
  entity_id text NOT NULL REFERENCES feature_entities(entity_id) ON DELETE CASCADE,
  feature_schema_version smallint NOT NULL DEFAULT 1,
  namespace text NOT NULL CHECK (namespace IN ('style', 'scene', 'function', 'source', 'legacy')),
  tag text NOT NULL,
  raw_weight numeric(8,6) NOT NULL,
  normalized_weight numeric(10,6),
  provenance text NOT NULL DEFAULT 'rule'
    CHECK (provenance IN ('human', 'rule', 'model', 'imported')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (entity_id, feature_schema_version, namespace, tag)
);

CREATE INDEX IF NOT EXISTS idx_entity_tag_weights_namespace_tag
  ON entity_tag_weights(namespace, tag);

-- Global statistics for categorical normalization.
CREATE TABLE IF NOT EXISTS categorical_tag_stats (
  feature_schema_version smallint NOT NULL DEFAULT 1,
  namespace text NOT NULL CHECK (namespace IN ('style', 'scene', 'function', 'source', 'legacy')),
  tag text NOT NULL,
  document_frequency integer NOT NULL,
  total_entities integer NOT NULL,
  alpha numeric(8,6) NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (feature_schema_version, namespace, tag)
);

-- User explicit mood signals (emoji + projected numeric abstraction).
CREATE TABLE IF NOT EXISTS user_mood_signals (
  signal_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_id text NOT NULL REFERENCES feature_entities(entity_id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('track', 'set', 'radio_show')),
  emoji_code text NOT NULL,
  intensity smallint NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  valence numeric(5,4) NOT NULL CHECK (valence BETWEEN -1 AND 1),
  arousal numeric(5,4) NOT NULL CHECK (arousal BETWEEN -1 AND 1),
  dominance numeric(5,4) NOT NULL CHECK (dominance BETWEEN -1 AND 1),
  context text,
  mood_schema_version smallint NOT NULL DEFAULT 1,
  source text NOT NULL DEFAULT 'explicit_user' CHECK (source = 'explicit_user'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_mood_signals_user_created_at
  ON user_mood_signals(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_mood_signals_entity
  ON user_mood_signals(entity_id, created_at DESC);

-- Versioned emoji -> valence/arousal/dominance mapping.
CREATE TABLE IF NOT EXISTS emoji_mood_mapping (
  mood_schema_version smallint NOT NULL DEFAULT 1,
  emoji_code text NOT NULL,
  valence numeric(5,4) NOT NULL CHECK (valence BETWEEN -1 AND 1),
  arousal numeric(5,4) NOT NULL CHECK (arousal BETWEEN -1 AND 1),
  dominance numeric(5,4) NOT NULL CHECK (dominance BETWEEN -1 AND 1),
  default_weight numeric(8,6) NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (mood_schema_version, emoji_code)
);

-- Aggregated user mood abstraction profile.
CREATE TABLE IF NOT EXISTS user_mood_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  mood_schema_version smallint NOT NULL DEFAULT 1,
  valence_mean numeric(5,4) NOT NULL DEFAULT 0,
  arousal_mean numeric(5,4) NOT NULL DEFAULT 0,
  dominance_mean numeric(5,4) NOT NULL DEFAULT 0,
  signal_count integer NOT NULL DEFAULT 0,
  confidence numeric(5,4) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Future-proof secure storage for third-party API credentials.
-- Do NOT store provider API keys in plaintext.
CREATE TABLE IF NOT EXISTS external_api_credentials (
  credential_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  scope text NOT NULL DEFAULT 'user' CHECK (scope IN ('user', 'service')),
  key_label text NOT NULL,
  credential_ciphertext bytea NOT NULL,
  key_version text NOT NULL,
  nonce bytea,
  auth_tag bytea,
  secret_fingerprint text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  expires_at timestamptz,
  rotated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_external_api_credentials_provider
  ON external_api_credentials(provider, status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_external_api_credentials_scope_label
  ON external_api_credentials(provider, key_label, scope, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid));

COMMIT;
