export type FeatureSchemaVersion = 1;

export type FeatureEntityType = 'track' | 'set' | 'radio_show';

export type FeatureProvenance = 'human' | 'rule' | 'model' | 'imported';

export type NumericFeatureKey =
  | 'energy'
  | 'density'
  | 'texture'
  | 'space'
  | 'rhythm'
  | 'duration_ms'
  | 'bpm_est'
  | 'kick_pressure_score'
  | 'drop_density_score'
  | 'melodic_lift_score';

export type OrdinalFeatureLevel = 'low' | 'medium' | 'high' | 'extreme';

export type OrdinalFeatureKey = 'kick_pressure_level' | 'drop_density_level' | 'melodic_lift_level';

export type CategoricalNamespace = 'style' | 'scene' | 'function' | 'source' | 'legacy';

export type WeightedCategoryTag = {
  namespace: CategoricalNamespace;
  tag: string;
  rawWeight: number;
  normalizedWeight: number | null;
  provenance: FeatureProvenance;
};

export type NumericFeatureSet = Partial<Record<NumericFeatureKey, number | null>>;

export type OrdinalFeatureSet = Partial<Record<OrdinalFeatureKey, OrdinalFeatureLevel | null>>;

export type ContextFeatureSet = {
  region: string | null;
  eventType: string | null;
  isLive: boolean | null;
  isRadioShow: boolean | null;
  yearBand: string | null;
};

export type HybridFeatureVector = {
  schemaVersion: FeatureSchemaVersion;
  entityId: string;
  entityType: FeatureEntityType;
  sourcePlatform: string;
  sourceKind: string;
  sourceUrl: string;
  timestampIngested: string;
  numeric: NumericFeatureSet;
  ordinal: OrdinalFeatureSet;
  categorical: WeightedCategoryTag[];
  context: ContextFeatureSet;
  qualityScore: number;
};

export function createEmptyHybridFeatureVector(
  input: Omit<
    HybridFeatureVector,
    'schemaVersion' | 'numeric' | 'ordinal' | 'categorical' | 'context' | 'qualityScore'
  >,
): HybridFeatureVector {
  return {
    schemaVersion: 1,
    ...input,
    numeric: {},
    ordinal: {},
    categorical: [],
    context: {
      region: null,
      eventType: null,
      isLive: null,
      isRadioShow: null,
      yearBand: null,
    },
    qualityScore: 0,
  };
}
