// Bayesian weighted rating: pulls books with few votes toward the global mean
// so a 5.0 from three people doesn't outrank a 4.5 from thousands.
const MIN_VOTES = 500;

function recommend(store, category, { limit = 5, exclude = [] } = {}) {
  const all = store.all();
  const globalMean = all.reduce((s, b) => s + b.ratingAvg, 0) / (all.length || 1);
  const skip = new Set(exclude);

  return store
    .byCategory(category)
    .filter((b) => !skip.has(b.id))
    .map((b) => {
      const v = b.ratingCount;
      const score = (v / (v + MIN_VOTES)) * b.ratingAvg + (MIN_VOTES / (v + MIN_VOTES)) * globalMean;
      return { ...b, score: Math.round(score * 1000) / 1000 };
    })
    .sort((a, b) => b.score - a.score || b.ratingCount - a.ratingCount)
    .slice(0, limit);
}

module.exports = { recommend, MIN_VOTES };
