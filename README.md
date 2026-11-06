# book-recommendation-service

REST API that recommends books by category. Contract: [`openapi.yaml`](openapi.yaml).

```
npm install
npm start        # PORT=3000 by default
npm test
```

| Endpoint | Purpose |
|---|---|
| `GET /categories` | Categories with book counts |
| `GET /books?category=` | List books, optionally by category |
| `GET /recommendations?category=&limit=5&exclude=id1,id2` | Top books for a category |
| `POST /books/:id/ratings` `{ "rating": 1-5 }` | Submit a rating |

## Ranking

Books are ranked by a Bayesian weighted rating, `(v/(v+m))·R + (m/(v+m))·C`
(`R` book average, `v` its votes, `C` catalog mean, `m`=500), so a 5.0 from two
readers doesn't beat a 4.5 from thousands. See `src/services/recommender.js`.

## Storage

Seed data in `src/data/books.js`, held in memory (`src/services/bookStore.js`);
ratings reset on restart. Replace `BookStore` with a DB-backed class exposing the
same methods to persist.
