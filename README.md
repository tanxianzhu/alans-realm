# Alan's Realm

A local-first, fully static educational website built with Astro and MDX.

## Local development

Install dependencies with `pnpm install`, then start the site with `pnpm dev`.
Open the local URL printed by Astro. Use `pnpm build` to create the static production output in `dist/`.

## Add a new lesson

1. Add an `.mdx` file under `src/content/lessons/<section>/`, where `<section>` is `economics`, `art`, or `wonder`.
2. Add the required frontmatter: `title`, `section`, `order`, `description`, and `status`. Use `published` to make it appear in a listing; use `coming-soon` while drafting.
3. Write the lesson in Markdown/MDX. Import `ThinkAboutIt`, `AudioPlayer`, `ImageFigure`, or `FeishuInteraction` at the top only when needed.
4. Add a dynamic route like `src/pages/art/[...slug].astro` when a new realm first gains published articles. It can follow the Economics route pattern.

Example frontmatter:

```yaml
---
title: "A new lesson"
section: economics
order: 4
description: "A short listing description."
date: 2026-08-10
status: published
---
```

## Add an image

Put images in `public/images/<section>/` and refer to them from MDX with a root-relative path:

```mdx
import ImageFigure from '../../../components/ImageFigure.astro';

<ImageFigure src="/images/economics/example.jpg" alt="A useful description" caption="Optional caption." />
```

## Add an MP3

Put recordings in `public/audio/<section>/` and reference them in MDX:

```mdx
import AudioPlayer from '../../../components/AudioPlayer.astro';

<AudioPlayer src="/audio/economics/value-price-cost-example.mp3" title="Listen to Alan's explanation" />
```

The component uses the browser's native audio controls; no custom audio engine is required.

## Maintain the Economics Q&A Session

The page uses the local fallback in `src/data/economics-qa.ts` until a local `.env` is configured. Copy `.env.example` to `.env`, then set the Feishu credentials and the Bitable app/table IDs. During Astro development and static builds, public, non-hidden rows are read from Feishu. The credentials are used only while building and are never sent to the browser.

Start the website and the local letter service in separate terminals:

```bash
pnpm dev
pnpm qa:api
```

The letter service writes submitted questions to Feishu. Private letters store only a salted passcode hash; a matching name and passcode can open only that sender’s private letters. For the `Questions` table, use `public` or `private` in `visibility`, and `pending`, `answered`, or `hidden` in `status`. New public rows are shown after the next local refresh/build; set a row to `hidden` to keep it out of the public page.

For production, deploy `server/qa-worker.mjs` as a Worker-compatible API and add the final site URL to `QA_ALLOWED_ORIGIN`. Do not put Feishu credentials in a static-site environment variable with a `PUBLIC_` prefix.

## Edit homepage content

Edit the realm titles, descriptions, and links in `src/pages/index.astro`. The reusable visual structure is in `src/components/SectionHero.astro`.

## Edit visual design

The global visual identity is centralized:

- `src/styles/tokens.css` — colors, type scales, spacing, content widths
- `src/styles/typography.css` — global typography rules
- `src/styles/layout.css` — shared page and reading layouts
- component-level `<style>` blocks — component-specific presentation

## Build

Run `pnpm build`. The static site is generated in `dist/` and can be hosted by any static file host.

## Future GitHub Pages deployment

When ready, add a GitHub Actions workflow that installs dependencies, runs `pnpm build`, and publishes `dist/` to GitHub Pages. If the site will be hosted beneath a repository path, add Astro's `site` and `base` settings to `astro.config.mjs` at that time. This first version does not deploy anything.

## Artwork sources

The three realm background images are resized local copies of public-domain artwork from Wikimedia Commons:

- [Ilya Repin, *Barge Haulers on the Volga*](https://commons.wikimedia.org/wiki/File:Ilya_Repin_-_Barge_Haulers_on_the_Volga_-_Google_Art_Project.jpg)
- [Claude Monet, *Haystacks*](https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Haystacks.jpg)
- [Vincent van Gogh, *Bedroom in Arles*](https://commons.wikimedia.org/wiki/File:Bedroom_of_Van_Gogh_in_Arles.jpg)
