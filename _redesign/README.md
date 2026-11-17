# Stephen Michael Dumas — website design review

This directory contains an independent Jekyll redesign for review. The existing
al-folio site remains at the repository root. These files do not change the
Hostinger website, DNS, or GitHub Pages publication settings.

The review implements a conventional site with separate page URLs, a persistent
navigation bar, a structured interests and games archive, and light/dark
appearance. Color choices are design alternatives for Stephen to evaluate.

## Build and preview

Use a supported Ruby installation with Bundler. Ruby 3.3 is a suitable baseline.
From this directory:

```sh
bundle install
bundle exec jekyll build --destination ../dist
bundle exec jekyll serve --destination ../dist --host 127.0.0.1
```

The final command serves the site at `http://127.0.0.1:4000/`. Generated output
goes to `dist/` outside this source directory. Do not commit that output as
source. The included `Gemfile.lock` records the upstream dependencies used for
the verified build (Jekyll 4.4.1 on Ruby 3.3). Keep it under version control so
subsequent builds use the same dependencies.

For a release-style build:

```sh
JEKYLL_ENV=production bundle exec jekyll build --destination ../dist
```

For a temporary project site such as `https://example.github.io/review/`, supply
the matching base path when building:

```sh
bundle exec jekyll build --destination ../dist --baseurl /review
```

The configuration currently uses `https://stephendumas.github.io` with an empty
base path. It does not claim that the custom domain has been moved.

## Editing the site

- Edit page content in `_pages/` and the home page at `index.html`.
- Edit shared page structure in `_layouts/` and `_includes/`.
- Edit the navigation data in `_data/` to keep page relationships consistent.
- Edit styles and the appearance controls in `assets/`.
- Keep the two monogram variants and portrait as separate source assets.
- Keep every category page that appears in breadcrumbs or navigation available.

Ordinary content can be written in Markdown with YAML front matter. A typical
page begins with:

```yaml
---
title: Page title
permalink: /interests/example/
layout: page
---
```

Navigation metadata may also be needed to place a new page in the existing
hierarchy. Copy the conventions used by a neighboring page rather than inventing
a second navigation system.

## What this review is and is not

This is a design and navigation review, not a completed WordPress migration.
Content that has not been supplied or verified must remain clearly identified
as pending. Do not publish invented résumé entries, publication citations,
scenario descriptions, download links, family history, or contact details.

Before launch, choose the visual direction, complete and approve page content,
verify downloadable assets and their permissions, map existing URLs, and test
the final GitHub Pages build. See [MIGRATION.md](MIGRATION.md) for the deployment
sequence and outstanding content decisions.

## Dependencies and hosting

The source uses Jekyll and its normal bundled Markdown/Liquid pipeline. It does
not require WordPress, a database, a JavaScript build framework, or additional
Jekyll plugins. WEBrick is included for local preview on modern Ruby versions.

GitHub Pages can publish the generated static files. The existing repository
already contains an al-folio deployment workflow; this design review does not
replace or activate it. Choose one publication workflow during the final
migration rather than running both against the same destination.
