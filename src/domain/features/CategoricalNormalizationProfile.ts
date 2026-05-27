import type { CategoricalNamespace, WeightedCategoryTag } from './HybridFeatureSchema';

export type CategoricalTagStat = {
  namespace: CategoricalNamespace;
  tag: string;
  documentFrequency: number;
};

export type CategoricalNormalizationProfile = {
  schemaVersion: 1;
  totalEntities: number;
  alpha: number;
  stats: CategoricalTagStat[];
  updatedAt: string;
};

export function normalizeCategoricalTags(
  tags: WeightedCategoryTag[],
  profile: CategoricalNormalizationProfile,
): WeightedCategoryTag[] {
  if (profile.totalEntities <= 0) {
    return tags.map((tag) => ({ ...tag, normalizedWeight: tag.rawWeight }));
  }

  const statMap = new Map(profile.stats.map((stat) => [`${stat.namespace}:${stat.tag}`, stat]));

  return tags.map((tag) => {
    const stat = statMap.get(`${tag.namespace}:${tag.tag}`);
    const df = stat?.documentFrequency ?? 0;
    const alpha = profile.alpha;
    const idfLike = Math.log((profile.totalEntities + alpha) / (df + alpha));

    return {
      ...tag,
      normalizedWeight: round4(tag.rawWeight * idfLike),
    };
  });
}

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}
