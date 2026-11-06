const raw = [
  ['fiction', 'To Kill a Mockingbird', 'Harper Lee', 1960, 4.3, 5200],
  ['fiction', '1984', 'George Orwell', 1949, 4.2, 6100],
  ['fiction', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 3.9, 5800],
  ['fiction', 'Beloved', 'Toni Morrison', 1987, 4.0, 1900],
  ['fiction', 'Pride and Prejudice', 'Jane Austen', 1813, 4.3, 4700],
  ['science-fiction', 'Dune', 'Frank Herbert', 1965, 4.3, 5500],
  ['science-fiction', 'Neuromancer', 'William Gibson', 1984, 3.9, 2300],
  ['science-fiction', 'The Left Hand of Darkness', 'Ursula K. Le Guin', 1969, 4.1, 1500],
  ['science-fiction', 'Foundation', 'Isaac Asimov', 1951, 4.2, 3900],
  ['science-fiction', 'The Martian', 'Andy Weir', 2011, 4.4, 4800],
  ['fantasy', 'The Hobbit', 'J.R.R. Tolkien', 1937, 4.3, 6000],
  ['fantasy', 'A Wizard of Earthsea', 'Ursula K. Le Guin', 1968, 4.0, 1700],
  ['fantasy', 'The Name of the Wind', 'Patrick Rothfuss', 2007, 4.5, 4200],
  ['fantasy', 'American Gods', 'Neil Gaiman', 2001, 4.1, 3100],
  ['mystery', 'The Hound of the Baskervilles', 'Arthur Conan Doyle', 1902, 4.1, 2600],
  ['mystery', 'And Then There Were None', 'Agatha Christie', 1939, 4.3, 5100],
  ['mystery', 'Gone Girl', 'Gillian Flynn', 2012, 4.1, 5400],
  ['mystery', 'The Big Sleep', 'Raymond Chandler', 1939, 4.0, 1300],
  ['non-fiction', 'Sapiens', 'Yuval Noah Harari', 2011, 4.4, 6500],
  ['non-fiction', 'Educated', 'Tara Westover', 2018, 4.5, 4600],
  ['non-fiction', 'The Immortal Life of Henrietta Lacks', 'Rebecca Skloot', 2010, 4.0, 2800],
  ['non-fiction', 'Thinking, Fast and Slow', 'Daniel Kahneman', 2011, 4.2, 3700],
  ['biography', 'Steve Jobs', 'Walter Isaacson', 2011, 4.2, 3500],
  ['biography', 'The Diary of a Young Girl', 'Anne Frank', 1947, 4.3, 4900],
  ['biography', 'Long Walk to Freedom', 'Nelson Mandela', 1994, 4.4, 1800],
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

module.exports = raw.map(([category, title, author, year, ratingAvg, ratingCount]) => ({
  id: slug(title), title, author, category, year, ratingAvg, ratingCount,
}));
