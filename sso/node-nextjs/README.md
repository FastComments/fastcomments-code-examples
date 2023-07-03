# Next.js Quickstart
> Starter template for a Next.js app with docs and CI

<!-- Badges generated with: https://michaelcurrin.github.io/badge-generator/ -->

[![Node CI](https://github.com/MichaelCurrin/next-js-quickstart/workflows/Node%20CI/badge.svg)](https://github.com/MichaelCurrin/next-js-quickstart/actions)
[![GitHub tag](https://img.shields.io/github/tag/MichaelCurrin/next-js-quickstart)](https://github.com/MichaelCurrin/next-js-quickstart/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license "Go to license section")

[![Made with Node](https://img.shields.io/badge/Node.js->=14-blue?logo=node.js&logoColor=white)](https://nodejs.org)

[![Package - next](https://img.shields.io/github/package-json/dependency-version/MichaelCurrin/next-quickstart/next?logo=next.js)](https://www.npmjs.com/package/next)
[![Package - react](https://img.shields.io/github/package-json/dependency-version/MichaelCurrin/next-quickstart/react?logo=react)](https://www.npmjs.com/package/react)
[![Package - eslint](https://img.shields.io/github/package-json/dependency-version/MichaelCurrin/next-quickstart/dev/eslint?logo=eslint)](https://www.npmjs.com/package/eslint)


## Preview

<div align="center">
    <img src="/sample.png" alt="Sample screenshot" width="600" />
</div>


## Use this project

<div align="center">

[![Use this template](https://img.shields.io/badge/generate-Use_this_template-2ea44f?style=for-the-badge)](https://github.com/MichaelCurrin/next-quickstart/generate)

</div>


## About

This is a static website built on Next.js, which is a framework build on React.

Next.js is "The React Framework for Production".

As with React, you can build more advanced web apps but in this case this template uses a simple site which can be hosted as static site. You can look into use _Vercel_ as a host if you want server-side rendering.

See [Next.js](https://michaelcurrin.github.io/dev-resources/resources/javascript/packages/next/) resources to learn more.

### Create a fresh project from scratch

From [Create a Next.js App](https://nextjs.org/learn/basics/create-nextjs-app) tutorial on the homepage using [vercel/next-learn](https://github.com/vercel/next-learn) repo.

```sh
$ npx create-next-app \
  nextjs-blog \
  --use-npm \
  --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"
$ cd nextjs-blog
```

That will create:

- [pages](/pages/) directory with one JS file.
- [public](/public/) directory with an SVG logo and favicon.
- [.gitignore](/.gitignore) file.
- [package.json](package.json) - it comes with Next 11 but I've set up Next 12 for my template here.
- `README.md` file - with just one line.

This template project extends the base project by adding:

- GH Actions CI flow - [main.yml](/.github/workflows/main.yml).
- Linting (ESLint installed and configured).
- Docs (see below).


## Documentation
> How to install, run and deploy this project

<div align="center">

[![View Project Docs](https://img.shields.io/badge/View-Project_Docs-blue?style=for-the-badge)](/docs/ "Go to project docs")

</div>


## License

Released under [MIT](/LICENSE) by [@MichaelCurrin](https://github.com/MichaelCurrin).
