# Vue3boilerplate

![Foundry v9](https://img.shields.io/badge/foundry-v9-green) | ![Vue 3](https://img.shields.io/badge/vue-3-blue)

This is a variant of the [Boilerplate system](https://gitlab.com/asacolips-projects/foundry-mods/boilerplate) that's configured to support Vue 3 for its character sheet template!

## Install dependencies

```bash
npm install

npm i -g gulp vite
```


## Build the scss

The base scss used by both the Handlebars and Vue sheets are compiled with gulp.

```bash
# Single build
npm run build

# Watch for changes
npm run watch
```

## Build the Vue components

The vue components under `src/*` can be built with Vite.

```bash
# Single build
npm run vite:build

# Watch for changes
npm run vite:watch
```

## Vue structure.

### The **_src/*_** directory

The Vue components are kept in `src/*`. This is further broken up into the following structure:

- `assets` - File/media assets that can be referenced by components.
- `components` - Vue components.
    - `index.js` - Main entrypoint used to determine which components should be exported during the compile (and made available to be imported by Foundry). Not every component needs to be listed here; you'll typically only export your main application component and a handful of utility/helper components (such as Tabs or a TinyMCE Editor).
    - `CharacterSheet.vue` - Main component for the vue character sheet. **Must** be exported.
    - `methods/` - Directory with exported methods that can be imported by components. For example, event handlers and text formatters that are useful in a wide number of components.
    - `parts/` - Sub-components referenced by other components, some of which are re-usable. For example, `Tabs`, `Editor`, and so forth.
    - `tabs/` - Content components that make up each of the tabs on the main character sheet component.

## Load vue.

The ES module version of Vue is stored in this repo at `module/lib/vue.esm-browser.js`. You'll typically only have to do this in character sheets or other applications utilizing Vue. To use it, you'll typically need to include the following in your file referencing it:

```js
import { createApp } from './module/lib/vue.esm-browser.js';
```

## Load your components

The compiled components are in the `dist/` directory.

### CSS
To import their CSS, add `dist/style.css` to the style's section of your `system.json` manifest file.

### JS
To import the component ES modules, you'll do something like the following:

```js
import { MyComponent } from './dist/components.vue.es.js';
```

Adjust the relative path as needed, such as prepending `../../` if imported in a file in `module/sheets/`.

## The sheet class

This module includes both a Handlebars sheet and a Vue sheet. With that in mind, it has both a `actor-sheet.mjs` file for Handlebars, and `actor-sheet.vue.mjs` for Vue, which extends the Handlebars version. That file is kept fairly lightweight, with the most important changes happening in:

- `getData()` - A few small changes from what's already happening in the regular sheet's getData(). In particular, active effects are converted from their document classes to plain objects.
- `render()` - Overrides the render() method to prevent it from constantly destroying and re-rendering the Vue application on form changes. This version will either a) create the Vue application if one doesn't exist, or b) update its main data property otherwise. You have to be careful when updating objects: if you replace the object the reactivity will be destroyed, so you instead have to replace the object keys.
- `close()` - Unmount and destroy the Vue app if the sheet is closed.
- `activateVueListeners()` - Most of our interactivity should be handled within the components `<script>` tags via methods. However, this can be used for some event listeners that are easier to implement in the sheet instance, such as activating TinyMCE editors.
- `activateListeners()` - We do **NOT** want Foundry's default sheet listeners to run on the Vue sheet. This is mainly used to disable them.

## Initializing the Vue app

Let's step through what's happening to actually enable the Vue app on our character sheet. In our `actor-sheet.vue.mjs` file:

### Import required classes

```js
import { CharacterSheet } from "../../dist/components.vue.es.js";
import { createApp } from "../lib/vue.esm-browser.js";
```

### Create the Vue app

In our render method, we need to initialize the Vue app:

```js
const context = this.getData();
// Render the vue application after loading. We'll need to destroy this
// later in the this.close() method for the sheet.
if (!this.vueApp) {
  // Create the app.
  this.vueApp = createApp({
    // Set our main data prop for the context object returned by this.getData().
    data() {
      return {
        context: context,
      }
    },
    // Allow our sheet component to be used.
    components: {
      'character-sheet': CharacterSheet
    },
    // Create a method that can be used to update the context prop later.
    methods: {
      updateContext(newContext) {
        // We can't just replace the object outright without destroying the
        // reactivity, so this instead updates the keys individually.
        for (let key of Object.keys(this.context)) {
          this.context[key] = newContext[key];
        }
      }
    }
  });
}
```

However, when changes are made to the sheet, we don't need to re-render it, we just need to update its data props. After the above if statement, we have an else to cover that:

```js
// Otherwise, perform update routines on the app.
else {
  // Pass new values from this.getData() into the app.
  this.vueRoot.updateContext(context);
  this.activateVueListeners($(this.form), true);
  return;
}
```

> - `this.vueApp` is the Vue application.
> - `this.vueRoot` is the mounted version of the Vue application.

Once we have an updated Vue app, we can execute Foundry's render:

```js
this._render(force, options).catch(err => {
  err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`;
  console.error(err);
  this._state = Application.RENDER_STATES.ERROR;
})
// Run Vue's render, assign it to our prop for tracking.
.then(rendered => {
  this.vueRoot = this.vueApp.mount(`[data-appid="${this.appId}"] .battleScarred-vue`);
  this.activateVueListeners($(this.form), false);
});

this.object.apps[this.appId] = this;
return this;
```

Finally, we need to destroy the Vue app if the sheet is closed. In our `close()` method:

```js
this.vueApp.unmount();
this.vueApp = null;
this.vueRoot = null;
return super.close(options);
```

### Build a character sheet mount point

While most of our template work will be in Vue, we do still need a mount point written in Handlebars for it to attach to. In our `templates/actor/actor-character-sheet.vue.html` file, we have the following:

```handlebars
<form class="{{cssClass}} {{actor.type}} v3boilerplate-vue flexcol" autocomplete="off">
  <character-sheet :context="context" :actor="context.actor">Failed to render Vue component.</character-sheet>
</form>
```

That gives us our standard form structure expected by sheets, and our `<character-sheet>` component that was mapped to `CharacterSheet` when we created our Vue application. We're passing in a pair of props related to the context and actor, and we have some fallback text in case the component fails to render.

## What about listeners?

As mentioned earlier, `activateListeners()` is generally incompatible with Vue sheets due to it firing too often for our needs. It's recommended that you instead apply any interactivity you need directly in the Vue components using methods and events such as `@click="myClickEventMethod"`. Several of the components in this repo include examples of that, such as `Tabs`, `ActorFeatures`, and everything under the `src/components/tabs/` directory.

## Suggest improvements!

If you have any recommendations or suggested improvements, feel free to open an issue or submit a new merge request!