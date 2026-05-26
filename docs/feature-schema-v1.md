# Feature Schema v1

This document fixes the early abstraction layers for mixed feature types.

SQL-first backend planning draft:
- `docs/sql/backend_schema_v1.sql`

## Scope

- Numerical features and categorical features are treated as different families.
- Raw source fields are separated from derived and normalized feature fields.
- Mood signals are a separate input channel and can be empty in early iterations.

## Core Columns

Use these as canonical backend columns for `track`, `set`, and `radio_show` entities.

1. Identity and source:
- `entity_id`
- `entity_type`
- `source_platform`
- `source_kind`
- `source_url`
- `timestamp_ingested`

2. Numerical:
- `duration_ms`
- `bpm_est`
- `energy`
- `density`
- `texture`
- `space`
- `rhythm`
- `kick_pressure_score`
- `drop_density_score`
- `melodic_lift_score`

3. Ordinal:
- `kick_pressure_level`
- `drop_density_level`
- `melodic_lift_level`

4. Context:
- `region`
- `event_type`
- `is_live`
- `is_radio_show`
- `year_band`

5. Governance:
- `feature_schema_version`
- `quality_score`
- `provenance`

## Categorical Normalization (Planned)

Use bridge rows instead of packed CSV-style columns.

- `entity_tag_weights`
  - `entity_id`
  - `entity_type`
  - `namespace` (`style|scene|function|source|legacy`)
  - `tag`
  - `raw_weight`
  - `normalized_weight`
  - `provenance`

- `categorical_tag_stats`
  - `namespace`
  - `tag`
  - `document_frequency`
  - `total_entities`
  - `alpha`
  - `updated_at`

Normalization rule:

```text
idf_like = log((total_entities + alpha) / (document_frequency + alpha))
normalized_weight = raw_weight * idf_like
```

## Mood Signal Layer (Planned)

Keep this fully separate from content features.

- `user_mood_signals`
  - `signal_id`
  - `user_id`
  - `entity_id`
  - `entity_type`
  - `emoji_code`
  - `intensity`
  - `valence`
  - `arousal`
  - `dominance`
  - `context`
  - `created_at`
  - `mood_schema_version`

- `emoji_mood_mapping`
  - `emoji_code`
  - `valence`
  - `arousal`
  - `dominance`
  - `default_weight`
  - `mood_schema_version`

- `user_mood_profile`
  - `user_id`
  - `valence_mean`
  - `arousal_mean`
  - `dominance_mean`
  - `signal_count`
  - `confidence`
  - `updated_at`
