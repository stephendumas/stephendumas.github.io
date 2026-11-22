# The Personal Archive — Jekyll template

Stephen Michael Dumas's approved website design, implemented as a standalone
Jekyll source tree. The template uses the Personal Archive layout, the Heraldic
Library palette, the selected shield in the shared header, and the professional
portrait in the homepage body. Light and dark modes share the same layout.

This directory is self-contained. It can stay in `_redesign/` while the original
al-folio site remains at the repository root, or its contents can later become
the source of a separate Jekyll repository. It does not depend on al-folio.

## Run locally

Install Ruby and Bundler, then run these commands from the directory containing
this README and `Gemfile`:

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open `http://127.0.0.1:4000/`. The server rebuilds changed content automatically.
Restart it after changing `_config.yml`. A build without a development server is:

```sh
bundle exec jekyll build
```

Jekyll writes the generated site to `_site/` by default. Ruby 3.3 is the baseline
for this project; the committed `Gemfile.lock` records Jekyll 4.4.1 and Bundler
2.6.7. Keep that lock file in version control. No Node installation or JavaScript
build step is required.

For a public build:

```sh
JEKYLL_ENV=production bundle exec jekyll build
```

`JEKYLL_ENV=production` does not itself remove the preview's search-engine
exclusion. Set `review_mode: false` when the content is ready for public indexing.
That setting affects the robots metadata and `robots.txt`; it is not access
control and does not make a publicly hosted preview private.

## What is ready

- Shared header, selected shield, monogram, and crimson menu bar.
- Light and dark modes, device preference by default, and a remembered override.
- A responsive homepage based on the selected directory layout.
- Separate pages for every destination in the supplied menu hierarchy.
- Reusable content, archive, project, and heraldry layouts.
- Breadcrumbs, section navigation, a site map, and a 404 page.
- A documented GitHub Pages deployment example for the later migration.

The individual pages are deliberately unfinished. Their short placeholders and
`status: draft` markers distinguish the working template from a completed
biography, resume, research archive, or collection of projects. No downloads or
contact forms are represented as working when their content is absent.

## Where to edit

| File or directory | Purpose |
| --- | --- |
| `_config.yml` | Site title, subtitle, description, canonical origin, base path, and review mode |
| `index.html` | Homepage content and layout selection |
| `_pages/` | Markdown or HTML content pages and their front matter |
| `_data/navigation.yml` | Page titles, URLs, parent relationships, and directory descriptions |
| `_layouts/` | Reusable page structures |
| `_includes/` | Shared header/navigation helpers and other reusable fragments |
| `assets/css/site.css` | Typography, responsive layout, and the selected light/dark palette |
| `assets/js/site.js` | Theme preference and navigation behavior |
| `assets/img/` | Original identity artwork and portrait |
| `assets/icons/` | Approved favicon master and generated PNG icon sizes |
| `examples/` | Copyable page and deployment examples, excluded from the generated site |

### Add or finish a page

Write content in Markdown beneath its YAML front matter. A basic page is:

```markdown
---
layout: page
title: Bio
permalink: /bio/
nav_id: bio
description: Biography and academic background.
status: draft
---

Write the page content here.

## A section heading

Add paragraphs, lists, images, and links as needed.
```

Remove `status: draft` when that page's content is ready. This custom status is a
visible preparation marker: it does not suppress output as Jekyll's `_drafts/`
post feature would. The skeleton URLs remain navigable while content is built.

For local links and images, use `relative_url` so they also work under a project
base path:

```liquid
[Research]({{ '/research/' | relative_url }})

![Descriptive alternative text]({{ '/assets/img/example.png' | relative_url }})
```

Do not put `baseurl` into each page's `permalink` or into the navigation data.

### Layout choices

| Layout | Use |
| --- | --- |
| `home` | The selected homepage composition |
| `page` | Biography, research, resume, contact, and ordinary articles |
| `archive` | Category pages that list child destinations from the navigation data |
| `project` | Individual campaigns, scenarios, maps, and related projects |
| `heraldry` | The dedicated achievement page, with themed artwork and a contents list |

Navigation uses a flat list with stable IDs and parent IDs. A new page under
Other Interests might be registered as:

```yaml
- id: example
  title: Example
  url: /interests/example/
  parent: interests
  description: A short description of the page.
```

Give the corresponding page `nav_id: example`. Existing deep game URLs and
project titles are preserved, including the supplied spelling `Belasarious`.
Use a unique ID even when several archives contain a page named `Misc`.

### Project details and downloads

The `project` layout accepts optional metadata as a key/value mapping and an
optional list of downloads. For example:

```yaml
project_meta:
  Game: Age of Empires
  Version: "Your version label"
downloads:
  - title: "Download the campaign"
    url: /assets/downloads/example.zip
    description: "File format, size, and compatibility notes"
```

These values are examples, not claims about an existing project. Add a download
entry only after its file or verified external URL is available. The layout
creates the Downloads heading and links automatically; avoid adding a second
Downloads section in the Markdown when using this field. Metadata is displayed
as plain text; the `url` value is the link destination. Local download paths use
the same base-path handling as other assets.

### Heraldic artwork

The shared header uses `assets/img/shield-original.png`, the exact uploaded
transparent shield selected for the site. Keep it as a separate source asset;
do not replace it with a shield redrawn from a mockup. The portrait likewise
uses the supplied professional photograph.

The full achievement belongs to the dedicated heraldry page. Its layout accepts
these optional front-matter values when the final page artwork is ready:

```yaml
artwork_light: /assets/img/achievement-light.png
artwork_dark: /assets/img/achievement-dark.png
sections:
  - id: arms
    title: Arms
  - id: crest
    title: Crest
  - id: supporters
    title: Supporters
  - id: mottoes
    title: Mottoes
```

The filenames in that example are suggestions, not existing downloads. Add the
actual image files before setting those paths. Until artwork is configured, the
layout displays a clearly labeled area for it. While this page has
`status: draft`, the layout also supplies placeholder sections and their anchor
IDs. When replacing those placeholders with the real content, remove that
status marker and write matching heading IDs, for example `## Arms {#arms}` in
Markdown; this prevents duplicate anchors. The two artwork variants should
depict the same achievement with the approved light/dark surroundings; they
are page content, not shared header decoration.

### Favicon

The favicon uses the approved gold SMD monogram and full laurel wreath on a
blue circle with a fine gold rim. It is the same in every theme; the website's
theme switch does not change it. The header's shield and light/dark monogram
remain separate identity artwork.

`assets/icons/favicon-master.png` is the source artwork. Regenerate the icon
exports with `scripts/build-favicons.sh`: `favicon.ico` contains 16-, 32-, and
48-pixel variants, `assets/icons/favicon-16.png`, `favicon-32.png`, and
`favicon-48.png` provide those sizes as PNGs, and
`assets/icons/apple-touch-icon.png` supplies the 180-pixel touch icon. The shared
layout references these files through `relative_url`, including under a
GitHub Pages project base path.

## Hosting paths

`url` is the origin, without a trailing slash. `baseurl` is the optional path
prefix, also without a trailing slash.

```yaml
# User site, or a custom domain at its root:
url: "https://stephendumas.github.io"
baseurl: ""

# Example project site:
# url: "https://example.github.io"
# baseurl: "/personal-archive"
```

To check a nonempty base path locally:

```sh
bundle exec jekyll serve --baseurl /personal-archive
```

Open `http://127.0.0.1:4000/personal-archive/`. The source uses Jekyll URL filters
for navigation and assets. Configure the final production origin before relying
on its canonical links or sitemap.

## GitHub Pages later

[`examples/github-pages.yml`](examples/github-pages.yml) is a manual-only
workflow example. It is outside `.github/workflows/` and therefore does not
publish anything. It builds the locked Jekyll dependencies explicitly rather
than relying on GitHub Pages' preselected Jekyll theme stack.

When adopting it, choose a single publication workflow, configure the repository
Pages source as GitHub Actions, and follow [MIGRATION.md](MIGRATION.md). The
WordPress content, domain/DNS change, and final page writing are separate steps.

## References

- [Jekyll command-line usage](https://jekyllrb.com/docs/usage/)
- [Jekyll front matter](https://jekyllrb.com/docs/front-matter/)
- [Jekyll data files](https://jekyllrb.com/docs/datafiles/)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Ruby setup and Bundler caching](https://github.com/ruby/setup-ruby)
