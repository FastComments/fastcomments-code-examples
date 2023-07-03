# Deploy


## Build app

Build the app for production.

```sh
$ npm run build
```

That outputs to the `.next` directory.

### Preview

Preview output from above with a dev server. This mode supports hybrid pages - serving both statically-generated and server-side rendered pages.

```sh
$ npm start
```

Or run this to handle both the build and preview steps together.

```sh
$ npm run serve:prod
```

Then open the browser at:

- http://localhost:3000

### Export as static assets

Note that the default build output is _not_ set up as static output - there no `index.html`.

Run this command - it will run the `build` command and then turn the build output into statically generated Next site. Thanks to this [article](https://pagepro.co/blog/how-to-use-next-js-static-site-generator/).

```sh
$ npm run build:prod
```

This outputs to the `out/` directory, which will have an `index.html` file. That directory can then be served as static assets - for example with Nginx, GitHub Pages, or Netlify.


## Release

This will run checks, increment the minor tag version, and push the new tagged commit.

```sh
$ npm version minor
```

See more info on the [npm version](https://michaelcurrin.github.io/dev-cheatsheets/cheatsheets/package-managers/javascript/npm/commands/version.html) command.


## Deploy pipeline

On every commit or push on any branch, this repo will run checks and build steps using [GitHub Actions](https://github.com/features/actions).

See the [workflow](/.github/workflows/main.yml) config file. See log results on the [Actions](https://github.com/MichaelCurrin/next-js-quickstart/actions/) tab.

### Note
> A comment on the limitation of this template project

The CI above is only for quality control. If you want to _persist_ the built app to be hosted as a static site, you'll need to do more setup.

- Extend the GH Actions flow - see [Node GH Pages workflow][] recipe. 
- Or set up your app on [Netlify][].
- If you want server-side rendering, then deploy your app on [Vercel][].

[Node GH Pages workflow]: https://michaelcurrin.github.io/code-cookbook/recipes/ci-cd/github-actions/workflows/node/gh-pages.html
[Netlify]: https://michaelcurrin.github.io/dev-resources/resources/ci-cd/netlify/
[Vercel]: https://michaelcurrin.github.io/dev-resources/resources/ci-cd/vercel/
