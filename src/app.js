const express = require('express');
const cors = require('cors');
const BookStore = require('./services/bookStore');
const { recommend } = require('./services/recommender');

const err = (res, status, code, message) => res.status(status).json({ error: { code, message } });

function createApp(store = new BookStore()) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/categories', (req, res) => res.json({ categories: store.categories() }));

  app.get('/books', (req, res) => {
    const { category } = req.query;
    if (category === undefined) return res.json({ books: store.all() });
    if (!store.hasCategory(String(category))) {
      return err(res, 404, 'CATEGORY_NOT_FOUND', `Unknown category "${category}"`);
    }
    return res.json({ books: store.byCategory(String(category)) });
  });

  app.post('/books/:id/ratings', (req, res) => {
    const { rating } = req.body || {};
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return err(res, 400, 'INVALID_RATING', 'rating must be an integer from 1 to 5');
    }
    const book = store.addRating(req.params.id, rating);
    if (!book) return err(res, 404, 'BOOK_NOT_FOUND', `No book with id "${req.params.id}"`);
    return res.json(book);
  });

  app.get('/recommendations', (req, res) => {
    const { category, limit, exclude } = req.query;
    if (!category) return err(res, 400, 'MISSING_CATEGORY', 'category query parameter is required');

    let n = 5;
    if (limit !== undefined) {
      n = Number(limit);
      if (!Number.isInteger(n) || n < 1 || n > 50) {
        return err(res, 400, 'INVALID_LIMIT', 'limit must be an integer from 1 to 50');
      }
    }
    if (!store.hasCategory(String(category))) {
      return err(res, 404, 'CATEGORY_NOT_FOUND', `Unknown category "${category}"`);
    }
    const skip = exclude ? String(exclude).split(',').map((s) => s.trim()).filter(Boolean) : [];
    return res.json({
      category: String(category).toLowerCase(),
      recommendations: recommend(store, String(category), { limit: n, exclude: skip }),
    });
  });

  app.use((req, res) => err(res, 404, 'NOT_FOUND', `${req.method} ${req.path} not found`));
  // eslint-disable-next-line no-unused-vars
  app.use((e, req, res, next) => {
    if (e.type === 'entity.parse.failed') return err(res, 400, 'INVALID_JSON', 'Malformed JSON body');
    return err(res, 500, 'INTERNAL_ERROR', 'Unexpected error');
  });

  // Random app
  return app;
}

module.exports = createApp;
