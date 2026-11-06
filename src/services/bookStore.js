const seed = require('../data/books');

// In-memory store; swap this module for a DB-backed one without touching routes.
class BookStore {
  constructor(books = seed) {
    this.books = new Map(books.map((b) => [b.id, { ...b }]));
  }

  all() {
    return [...this.books.values()];
  }

  get(id) {
    return this.books.get(id);
  }

  byCategory(category) {
    const c = category.toLowerCase();
    return this.all().filter((b) => b.category === c);
  }

  categories() {
    const counts = {};
    for (const b of this.all()) counts[b.category] = (counts[b.category] || 0) + 1;
    return Object.entries(counts)
      .map(([name, bookCount]) => ({ name, bookCount }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  hasCategory(category) {
    return this.byCategory(category).length > 0;
  }

  addRating(id, rating) {
    const b = this.books.get(id);
    if (!b) return null;
    const total = b.ratingAvg * b.ratingCount + rating;
    b.ratingCount += 1;
    b.ratingAvg = Math.round((total / b.ratingCount) * 10000) / 10000;
    return b;
  }
}

module.exports = BookStore;
