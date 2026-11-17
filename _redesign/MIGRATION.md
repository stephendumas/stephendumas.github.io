# WordPress to Jekyll migration notes

## Status

This is a local design review in `_redesign/`, alongside the existing al-folio
source. It is not a complete content migration and has not changed the live
domain, Hostinger account, or GitHub Pages settings.

The target is a static Jekyll website with distinct pages, a conventional menu,
light and dark modes, and Stephen's personal branding. The current preview
configuration uses `https://stephendumas.github.io` and an empty `baseurl`.

## Decisions before publication

1. Choose the preferred color scheme after reviewing both light and dark modes.
2. Confirm the top-level navigation and the hierarchy beneath Other Interests.
3. Approve page wording and decide which unfinished sections may be visible.
4. Supply or identify the intended heraldic artwork. The attached monograms and
   portrait are not a substitute for a verified heraldic achievement.
5. Confirm whether the portrait should remain the principal photograph.
6. Verify the current résumé, research summaries, publication list, and preferred
   public contact method. Do not infer professional dates or contact details.
7. Supply or verify game files, screenshots, historical descriptions, author
   credits, version compatibility, and download destinations.
8. Confirm names and spellings, including the requested “Belasarious” title,
   before changing them to a conventional spelling.
9. Provide the intended scope and material for Genealogy, Dreams, Music, and
   Heraldic Achievement. Review family information before making it public.

## Content inventory and old URLs

Export WordPress content and retain a copy of its media before discontinuing
hosting. Record each published URL and map it to its Jekyll destination. Prefer
keeping useful existing paths, especially paths with inbound links.

For every migrated page, verify:

- Text, headings, captions, image alternative text, and source attribution.
- Local images and documents, including media that currently uses a WordPress
  upload URL.
- Internal links and fragments after headings or page paths change.
- Download files, version labels, installation instructions, and author credits.
- Titles, descriptions, canonical URLs, sitemap entries, and the 404 page.

GitHub Pages serves static files. PHP, WordPress plugins, database queries, and
Apache `.htaccess` rules do not transfer. A contact page can use an approved
email link; a working web form requires a separately chosen submission service.
Do not leave a form that visually accepts a message without delivering it.

If an old path cannot be preserved, provide an explicit static redirect page
with a canonical URL, a visible destination link, and a redirect mechanism.
Avoid assuming that an Apache or Nginx server rule will run on Pages. Query-based
WordPress links such as `?p=123` require special planning; a path-only redirect
file cannot distinguish their query values by itself.

## Build isolation and the existing workflow

The repository's `.github/workflows/deploy.yml` builds al-folio from the root and
publishes generated files to `gh-pages`. It runs on pushes to `main` or `master`,
on matching pull requests, and by manual dispatch. Its publish step is excluded
for pull requests. `_redesign/` begins with an underscore and is not the root
Jekyll source; the review is built explicitly from that directory.

Keep the review branch isolated until the design is approved. Do not merge the
review and assume the existing workflow will automatically publish it. During
cutover, choose one of these approaches:

- Move the approved independent site to the repository root and replace the
  existing build/deployment workflow deliberately.
- Keep `_redesign/` as the explicit working directory and update one workflow to
  build it and publish its output.

The first option yields a simpler long-term repository. Preserve the old source
in version control so it can be recovered without keeping two active sites.

## Example GitHub Actions workflow for the final site

The following is documentation only. It is deliberately not installed as an
active workflow during design review. It assumes `_redesign/` is still the source
directory, that the final dependencies have a committed lock file, and that the
repository's Pages source is set to **GitHub Actions**.

When adopting it, disable or replace the existing `gh-pages` publisher so there
is one authoritative publication path. A manual-only initial trigger lets the
first deployment be inspected before enabling automatic publication on pushes.

```yaml
name: Publish Jekyll site

on:
  workflow_dispatch:
  # Enable after the first reviewed deployment:
  # push:
  #   branches: [main]

permissions:
  contents: read

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true
          working-directory: _redesign
      - uses: actions/configure-pages@v5
      - name: Build
        working-directory: _redesign
        env:
          JEKYLL_ENV: production
        run: bundle exec jekyll build --destination ../dist
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

If source moves to the root, remove the two `working-directory: _redesign`
settings and change the build destination to `dist`.

## Domain and HTTPS cutover

1. Back up the WordPress content, media, and current DNS records. Identify the
   domain registration, email, and other services bundled with Hostinger before
   cancelling any service.
2. Build and inspect the finished replacement on its GitHub Pages address.
3. Verify ownership of `stephendumas.com` in the GitHub account's Pages settings
   using the supplied TXT record. Keep the verification record in DNS.
4. Add `www.stephendumas.com` in the repository's Pages custom-domain setting
   before pointing its web DNS record at GitHub.
5. At the DNS provider, set the `www` CNAME to `stephendumas.github.io`, without a
   repository name or URL scheme. Configure the apex domain using the current
   A/AAAA or ALIAS/ANAME values in GitHub's official documentation if both domain
   forms should reach the site.
6. Preserve unrelated MX, SPF, DKIM, DMARC, verification, and other service
   records. Moving web hosting does not require moving the registrar or email.
7. After the content is complete and approved, set `review_mode: false` to remove
   the preview-only noindex directive. For the production build, set:

   ```yaml
   url: "https://www.stephendumas.com"
   baseurl: ""
   ```

8. After DNS and certificate provisioning complete, enable **Enforce HTTPS**.
   Verify the apex-to-www redirect, page paths, downloads, and assets. Inspect
   pages for old insecure `http://` asset references.
9. Keep the previous hosting available during verification. Cancel only the
   service no longer needed after checking any linked email or domain services.

With custom GitHub Actions publication, a repository `CNAME` file is ignored and
is not required; the Pages setting remains authoritative. Branch publication
uses a `CNAME` file. Do not mix the two deployment instructions.

## Files and hosting limits

GitHub Pages limits a published site to 1 GB and has a soft bandwidth limit of
100 GB per month. Its 10-builds-per-hour soft limit does not apply to custom
GitHub Actions publication. Regular Git repositories block individual files
larger than 100 MiB; browser uploads are limited to 25 MiB.

Keep ordinary page images and modest game downloads in the site when suitable.
For substantial audio/video libraries or large campaign packages, choose an
appropriate media host or GitHub Release assets and link to them. Do not put
large generated media into Git history by default or assume Git LFS removes
Pages' site-size limit.

GitHub Pages is free for public repositories on GitHub Free. Domain renewal,
email hosting, and any separate media services remain independent costs.

## Launch verification

- Run the actual Jekyll build with the committed dependency versions.
- Open every menu destination and check relative links at the final base path.
- Check keyboard focus, mobile menus, and both appearance modes.
- Check each chosen palette for readable text, link, and focus colors.
- Verify the portrait, monograms, favicon, and eventual heraldic artwork.
- Test the 404 page, redirects, sitemap, canonical URLs, and share metadata.
- Verify every download is real, correctly attributed, and labeled accurately.
- Review pending-content markers and remove any development-only controls or
  notes that are not intended for public visitors.

## Primary references

Consulted during the November 2026 design review:

- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verifying a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [HTTPS on GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Large files on GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
- [al-folio customization](https://github.com/alshedivat/al-folio/blob/main/docs/CUSTOMIZE.md)
- [al-folio installation and upgrade guidance](https://github.com/alshedivat/al-folio/blob/main/docs/INSTALL.md)
