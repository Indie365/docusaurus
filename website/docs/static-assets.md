---
id: static-assets
title: Static Assets
---

In general, every website needs assets: images, stylesheets, favicons and etc. In such cases,
you can create a folder named `static` at the root of your project. Every file you put into that folder will be copied into the generated build folder. E.g. if you add a file named `sun.jpg` to the static folder, it’ll be copied to `build/sun.jpg`

This means that if the site's baseUrl is `/`, an image in `static/img/docusaurus_keytar.svg` is available at `docusaurus_keytar.svg`.


## Referencing your static asset

You can reference assets from the static folder in your code with absolute path, i.e. starting with a slash /.

Markdown example:

```markdown
<!-- reference static/img/docusaurus.png -->
![alt-text](/img/docusaurus.png)
```

Result:

![alt-text](/img/docusaurus.png)

JSX example:

```jsx
// reference static/img/slash-birth.png
<img src="/img/slash-birth.png" alt="logo" />
```

Result:

<img src="/img/slash-birth.png" alt="logod" />


Keep in mind that:

- None of the files in static folder be post-processed or minified.
- Missing files will not be called at compilation time, and will cause 404 errors for your users.