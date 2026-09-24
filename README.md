# Tin Mai — Portfolio

FL Studio–inspired personal portfolio for Tin Mai. Built with Next.js (static export) and deployed to GitHub Pages.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS (design tokens)
- Motion, Lucide React
- React Hook Form + Zod
- Formspree (optional contact delivery)

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build   # static export → out/
npm run lint
npm run format
```

## Content

Edit structured data in `data/`:

- `projects.ts`
- `experience.ts`
- `skills.ts`
- `navigation.ts`
- `social.ts`

## Contact form

1. Create a form at [Formspree](https://formspree.io)
2. Set `NEXT_PUBLIC_FORMSPREE_ID` locally (`.env.local`) and as a GitHub Actions **variable**
3. Without it, the form opens a `mailto:` draft

## Deploy

Push to `main`. The workflow builds the static site and deploys to [https://trngtnm.github.io/](https://trngtnm.github.io/).

Enable **Settings → Pages → Source: GitHub Actions** on the repository.
