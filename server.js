// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.dirname(fileURLToPath(import.meta.url))));

let notes = [];                 // in-memory array

// prune every minute
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  notes = notes.filter(n => n.createdAt > cutoff);
}, 60 * 1000);

app.get('/notes', (_req, res) => res.json(notes));

app.post('/notes', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Missing text');
  const note = { text, createdAt: Date.now() };
  notes.push(note);
  res.status(201).json(note);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
