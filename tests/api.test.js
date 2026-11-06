const request = require('supertest');
const createApp = require('../src/app');
const BookStore = require('../src/services/bookStore');

const fresh = () => createApp(new BookStore());

describe('categories and books', () => {
  it('lists categories with counts', async () => {
    const res = await request(fresh()).get('/categories');
    expect(res.status).toBe(200);
    expect(res.body.categories).toContainEqual({ name: 'fantasy', bookCount: 4 });
  });

  it('filters books by category, case-insensitively', async () => {
    const res = await request(fresh()).get('/books?category=Mystery');
    expect(res.status).toBe(200);
    expect(res.body.books.every((b) => b.category === 'mystery')).toBe(true);
  });

  it('404s on unknown category', async () => {
    const res = await request(fresh()).get('/books?category=cooking');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('CATEGORY_NOT_FOUND');
  });
});

describe('GET /recommendations', () => {
  it('returns top books for a category, best score first, default limit 5', async () => {
    const res = await request(fresh()).get('/recommendations?category=science-fiction');
    expect(res.status).toBe(200);
    const { recommendations: r } = res.body;
    expect(r.length).toBeLessThanOrEqual(5);
    expect(r[0].id).toBe('the-martian');
    expect(r.map((b) => b.score)).toEqual([...r.map((b) => b.score)].sort((a, b) => b - a));
  });

  it('respects limit and exclude', async () => {
    const res = await request(fresh()).get('/recommendations?category=fantasy&limit=2&exclude=the-name-of-the-wind');
    expect(res.body.recommendations).toHaveLength(2);
    expect(res.body.recommendations.map((b) => b.id)).not.toContain('the-name-of-the-wind');
  });

  it('ranks by weighted score, not raw average', async () => {
    const store = new BookStore([
      { id: 'a', title: 'A', author: 'x', category: 'c', year: 2000, ratingAvg: 5, ratingCount: 2 },
      { id: 'b', title: 'B', author: 'x', category: 'c', year: 2000, ratingAvg: 4.5, ratingCount: 5000 },
      { id: 'z', title: 'Z', author: 'x', category: 'other', year: 2000, ratingAvg: 1, ratingCount: 1 },
    ]);
    const res = await request(createApp(store)).get('/recommendations?category=c');
    expect(res.body.recommendations.map((b) => b.id)).toEqual(['b', 'a']);
  });

  it.each([
    ['', 400, 'MISSING_CATEGORY'],
    ['?category=fantasy&limit=0', 400, 'INVALID_LIMIT'],
    ['?category=fantasy&limit=abc', 400, 'INVALID_LIMIT'],
    ['?category=nope', 404, 'CATEGORY_NOT_FOUND'],
  ])('rejects %s', async (qs, status, code) => {
    const res = await request(fresh()).get(`/recommendations${qs}`);
    expect(res.status).toBe(status);
    expect(res.body.error.code).toBe(code);
  });
});

describe('POST /books/:id/ratings', () => {
  it('updates average and count', async () => {
    const app = fresh();
    const before = (await request(app).get('/books?category=mystery')).body.books.find((b) => b.id === 'gone-girl');
    const res = await request(app).post('/books/gone-girl/ratings').send({ rating: 1 });
    expect(res.status).toBe(200);
    expect(res.body.ratingCount).toBe(before.ratingCount + 1);
    expect(res.body.ratingAvg).toBeLessThan(before.ratingAvg);
  });

  it('validates rating and book', async () => {
    const app = fresh();
    expect((await request(app).post('/books/gone-girl/ratings').send({ rating: 6 })).status).toBe(400);
    expect((await request(app).post('/books/gone-girl/ratings').send({})).status).toBe(400);
    expect((await request(app).post('/books/nope/ratings').send({ rating: 3 })).status).toBe(404);
  });
});

describe('misc', () => {
  it('health and 404', async () => {
    const app = fresh();
    expect((await request(app).get('/health')).body).toEqual({ status: 'ok' });
    expect((await request(app).get('/nope')).status).toBe(404);
  });
});
