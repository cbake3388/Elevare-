# Elevare – Adaptive Hypertrophy Coach (Vite + React + Tailwind)

## Quick start
```bash
npm install
npm run dev
```

## Deploy
- **Vercel**: Vite detected automatically. Build `vite build`, output `dist`.
- **Netlify**: Build `vite build`, publish `dist`. Functions under `/.netlify/functions/coach`.
- **GitHub Pages**: Use `404.html` fallback and `vite build` to `dist`.

## AI Coaching (optional)
Set `OPENAI_API_KEY` on your host (Vercel/Netlify). Without it, the local coach runs.
