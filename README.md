# Smart Aquaculture Monitoring System

A modern React/Vite prototype for the B.Tech Artificial Intelligence & Data Science Community Service Project:

**Correlation Between Water pH Levels and Fish Mortality Rate**

The application demonstrates the complete story: collect pond observations, monitor pH, calculate mortality, analyze correlation, detect risk, and review recommendations.

## Included

- 2-3 second professional splash screen
- Responsive dashboard with summary cards and current water status
- Pond monitoring table with pond/date filters
- Add pond data form with automatic mortality-rate calculation
- LocalStorage persistence with demo/sample records preloaded
- Recharts scatter, pH trend, and mortality trend visualizations
- Pearson correlation analysis with a non-causation note
- Rule-based AI mortality risk demonstration, clearly labeled as a prototype
- Smart warning and critical pH recommendations
- About project and future scope pages
- Mobile-friendly sidebar navigation

> The initial records are realistic demo/sample data for presentation. They are not actual measurements from Nayudugudem village.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Deploy to Netlify

1. Push this folder to a GitHub repository.
2. In Netlify, choose **Add new site** > **Import an existing project**.
3. Select the repository and set:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy the site.

This is a static client-side app and does not require a database, backend, login, or external API.
