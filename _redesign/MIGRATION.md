# Moving the finished template to GitHub Pages

## Current stage

The visual direction is approved and implemented as a standalone Jekyll
template in `_redesign/`. The page structure is in place; the next step is to
write the individual pages and add their final content. The original al-folio
source is retained at the repository root.

The selected design uses the Personal Archive layout, the Heraldic Library
palette, the supplied transparent shield in the header, and the professional
portrait on the homepage. The full achievement is reserved for its own page.

## Finish the content

Complete and review the biography, research, resume, contact details, and
interest pages. Add real game files, screenshots, credits, and installation
notes as the project pages are developed. Replace placeholder content and
remove `status: draft` from pages that are ready. Keep intentional omissions
explicit rather than adding inferred professional details or download links.

Export any WordPress content and media needed for the new site, and retain a
backup. List existing published URLs and map them to the new paths. Static
redirect pages may be needed where paths change; WordPress/PHP behavior and
Apache `.htaccess` rules are not part of a GitHub Pages build.

## Choose the source location

Two approaches work with the provided template:

1. Keep `_redesign/` as the explicit Jekyll source and use the example workflow
   unchanged.
2. Move the template contents to the repository root as the finished site. In
   the example workflow, change the Ruby setup `working-directory` and the
   build step `working-directory` from `_redesign` to `.`.

The second option gives a simpler long-term repository. Preserve the previous
source in Git history. Adopt one authoritative Pages workflow; the existing
al-folio publisher should not also publish a different tree to the same site.

## Deployment example

The example is at [`examples/github-pages.yml`](examples/github-pages.yml).
It is documentation only until copied to `.github/workflows/`. Its only trigger
is `workflow_dispatch`, so the first deployment is deliberate. Select
**GitHub Actions** as the repository's Pages source before using it.

The build installs dependencies from the committed `Gemfile.lock`, builds with
Jekyll, uses the Pages base path, and uploads the generated output. A separate
deploy job waits for the build and uses the `github-pages` environment with
`pages: write` and `id-token: write` permissions.

When public content is ready, set the correct `url` and `baseurl` in
`_config.yml`, then set `review_mode: false`. Review mode emits noindex and a
robots exclusion; it is not authentication or private access control.

## Domain cutover

Keep the Hostinger site available while the replacement is checked at its
GitHub Pages address. Back up the current DNS settings and confirm which
services depend on Hostinger, especially domain registration and email.

Verify domain ownership in GitHub and configure the repository's custom domain
before changing its web DNS records. Use the current values and procedure in
[GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
Preserve unrelated email and service records. After DNS and certificate
provisioning complete, enable HTTPS and check both domain forms, page links,
assets, and downloads.

For the intended canonical address, the final configuration is:

```yaml
url: "https://www.stephendumas.com"
baseurl: ""
review_mode: false
```

Changing that configuration does not itself alter DNS or GitHub Pages settings.

## Verify the finished site

Build with the locked dependencies. Check each menu destination, deep game
path, breadcrumb, site map, and 404 page. Test the layout at phone and desktop
widths, keyboard navigation, and both appearance modes. Confirm that every
listed download exists and that the original portrait and chosen shield are
used directly. Check final canonical links and sitemap URLs after setting the
production origin.

## Primary guidance

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Publishing-source settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verifying a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [HTTPS on GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

Build/deployment documentation checked against the primary Jekyll, GitHub, and
ruby/setup-ruby documentation on 20 November 2026. Recheck the domain procedure
when the actual migration takes place.
