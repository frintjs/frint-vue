# frint-vue

[![npm](https://img.shields.io/npm/v/frint-vue.svg)](https://www.npmjs.com/package/frint-vue)

> Vue.js integration with FrintJS

This project is an experiment for integrating [Vue.js](https://vuejs.org) components with [FrintJS](https://frint.js.org).

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Regions](#regions)
  - [Region and data](#region-and-data)
  - [Observing components](#observing-components)
  - [Multi-instance Apps](#multi-instance-apps)
- [API](#api)
  - [render](#render)
  - [observe](#observe)
  - [Region](#region)
  - [RegionService](#regionservice)
  - [streamProps](#streamprops)
  - [VueHandler](#vuehandler)

<!-- /MarkdownTOC -->

---

# Guide

The guide below is a Vue.js adaptation of [frint-react](https://frint.js.org/packages/frint-react).

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save vue frint-vue
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.4.0/Rx.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.min.js"></script>

<script src="https://unpkg.com/frint@latest/dist/frint.min.js"></script>
<script src="https://unpkg.com/frint-vue@latest/dist/frint-vue.min.js"></script>

<script>
  // available as `window.FrintVue`
</script>
```

## Usage

We start by importing the necessary functions from the library:

```js
import { createApp } from 'frint';
import { render } from 'frint-vue';
```

Now let's create our first Component:

```js
const Root = {
  render(h) {
    return (
      <div>
        <p>Hello World!</p>
      </div>
    );
  }
}
```

Now we need to create our Root App, and assign the previously defined Component as our root component for the App:

```js
const RootApp = createApp({
  name: 'MyRootApp',
  providers: [
    {
      name: 'component',
      useValue: Root
    }
  ]
});
```

Now that we have everything ready, we can instantiate our app, and render it:

```js
window.app = new RootApp();
render(window.app, 'root');
```

The code above asumes your page has an element with an id `root`:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## Regions

The library already ships with a `Region` component, and a `RegionService`.

We use the concept of regions for defining areas in our Components, where other Apps can load themselves in.

For example, imagine the Root component of our Root App above, we can define a Region named `sidebar` as follows:

```js
import { Region } from 'frint-vue';

const Root = {
  render(h) {
    return (
      <div>
        <p>Hello World!</p>

        <Region name="sidebar" />
      </div>
    );
  }
}
```

That's just defining the Region only. Let's now create an App, and assign it to the `sidebar` region:


```js
import { createApp } from 'frint';

const AppComponent = {
  render(h) {
    return (
      <div>
        <p>I am from MyApp.</p>
      </div>
    );
  }
}

const App = createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'component',
      useValue: AppComponent,
    }
  ],
});
```

Now that we have our App defined, we can register it to our Root App:

```js
window.app.registerApp(App, {
  regions: ['sidebar'], // name of regions to target
  weight: 10, // the lower the number, the higher they would appear
});
```

Now when you refresh your browser, you would notice your App being rendered inside the Region `sidebar`.

## Region and data

It is possible that when defining the Region with a name, you would also want to pass some data to it, so that whenever an App gets rendered inside it, the App would be able to access that data.

From the above example of `sidebar` Region, imagine us passing some data too via props:

```js
const Root = {
  render(h) {
    const data = {
      foo: 'bar'
    };

    return (
      <div>
        <p>Hello World from Root App!</p>

        <Region name="sidebar" data={data} />
      </div>
    );
  },
}
```

That's only the `Region` component's implementation part. How do we access it from our App now?

Enter `RegionService`. This is a Service that we can pass in our App's providers list, allowing us to later have access to Region's props.

```js
import { RegionService } from 'frint-vue';

const App = createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'component',
      useValue: AppComponent,
    },
    {
      name: 'region',
      useClass: RegionService, // `useClass` because `RegionService` will be instantiated
    },
  ],
});
```

Once your App is registered and rendered, you can get access to your App instance, which can then allow you to deal with Region's props:

```js
const myApp = window.app.getAppInstance('MyApp');
const region = myApp.get('region');

// Region's data as an Observable
const regionData$ = region.getData$();

regionData$.subscribe((data) => {
  console.log(data); // { foo: 'bar' }
});
```

We will discuss more in details how to get Region's props in your App's components via `observe` in the next section.

## Observing components

We encourage everyone to write their components in as dumb way as possible. Meaning, we just pass the props, and Components just render them. Nothing more.

But real-world applications are complex, and data can come from anywhere, at any time, asynchronously.

Enter `observe`. This is a function that we ship with the library for making your Components reactive.

A very simple example would be:

```js
const MyComponent = {
  props: ['interval'],

  render(h) {
    return (
      <p>Interval: {this.interval}</p>
    );
  },
};
```

We just created a component, that prints out a prop called `interval`. Nothing fancy there. But we wish the interval to update itself every second. Instead of handling it from within the Component, we can do it with `observe` as follows:

```js
import { Observable } from 'rxjs';
import { observe } from 'frint-vue';

const MyObservedComponent = observe(function () {
  return Observable
    .interval(1000) // emits an integer every 1 second
    .map(x => ({ interval: x })); // map the integer to a props-compatible object
})(MyComponent);
```

We have just made our simple Component reactive, by wrapping it with `observe`. Now it will continue to update the `interval` prop every second until the Component has unmounted itself.

### Observing Region's data

In previous example, we showed you how to access Region's data via `RegionService`. Now let's see how we can pass it to your App's component too:

```js
const ObservedAppComponent = observe(function (app) {
  // `app` is your App instance

  // let's keep our first interval Observable too
  const interval$ = Observable
    .interval(1000)
    .map(x => ({ interval: x }));

  const region = app.get('region'); // the RegionService instance
  const regionData$ = region.getData$()
    .map(regionData => ({ regionData: regionData }));

  // now we have two observables, `interval$` and `regionData$`.
  // we need to merge them both into a single props-compatible object:
  return interval$
    .merge(regionData$)
    .scan((props, emitted) => {
      return {
        ...props,
        ...emitted,
      };
    }, {});
})(AppComponent);
```

When your App's component renders, latest props will be passed to it in this structure:

```js
{
  // will keep updating every second,
  interval: 1,

  // will update whenever sidebar Region's props change
  regionData: {
    foo: 'bar'
  }
}
```

### Helper function for streaming props

As the number of observables grow, it might be difficult to maintain your `observe` implementation. That's why we are also shipping a `streamProps` function in the library to make it easier for you:

```js
import { streamProps } from 'frint-vue';

const MyObservedComponent = observe(function (app) {
  return streamProps({}) // start streaming with a default plain object
    // interval
    .set(
      Observable.interval(1000),
      x => ({ interval: x }),
    )

    // region data
    .set(
      app.get('region').getData$(),
      regionData => ({ regionData })
    )

    // plain object
    .set({
      key: 'value'
    })

    // key/value pairs
    .set('myKey', 'myValue')

    // return everything as a single merged Observable
    .get$();
})(AppComponent);
```

The props available inside your Component would then be in this format:

```js
{
  interval: 1,
  regionData: { foo: 'bar' },
  key: 'value',
  myKey: 'myValue'
}
```

## Multi-instance Apps

This is a use case where you have multiple instances of Region with the same name mounted in the DOM. And the apps rendered in them should have their own independent scoped instances too.

Think of a scenario where you have a TodoList, and you want a Region defined for each Todo item:

```js
const MyComponent = {
  render(h) {
    const todos = [
      { id: '1', title: 'First todo' },
      { id: '2', title: 'Second todo' },
      { id: '3', title: 'Third todo' },
    ];

    return (
      <ul>
        {todos.map((todo) => {
          return (
            <li>
              <h3>{todo.title}</h3>

              <Region
                name="todo-item"
                data={{ todo }}
                uniqueKey={`todo-item-${todo.id}`}
              />
            </li>
          );
        })}
      </ul>
    );
  },
};
```

Now we may have an App that we want to be rendered in `todo-item` Regions.

Let's create an App, that will receive the `todo` object, and render the title in UPPERCASE format.

```js
import { createApp } from 'frint';
import { observe, RegionService } from 'frint-vue';

const AppComponent = {
  props: ['todo'],

  render(h) {
    return <p>Todo in upper case: {this.todo.title.toUpperCase()}</p>
  },
};

const ObservedAppComponent = observe(function (app) {
  return streamProps()
    .set(
      app.get('region').getData$(),
      data => ({ todo: data.todo })
    )
    .get$();
})(AppComponent);

const App = createApp({
  name: 'MyApp',
  providers: [
    {
      name: 'component',
      useValue: ObservedAppComponent
    },
    {
      name: 'region',
      useClass: RegionService
    }
  ]
});
```

Now comes the part of registering our App as a multi-instance app:

```js
window.app.registerApp(App, {
  regions: ['todo-item'],

  // this tells Root App to treat this app as a multi-instance one
  multi: true,
});
```

---

# API

## render

> render(app, node)

Renders a Root App in target DOM node.

### Arguments

1. `app` (`App`): The Root App instance.
1. `selector` (`String`): The DOM Element selector where you want your App to render.

## observe

> observe(fn)(MyComponent)

### Arguments

1. `fn` (`Function`): The function returning an Observable.
    * The `fn` accepts `app` as an argument, which is the instance of your Root App or the App in scope
    * It should return an `Observable`

### Returns

`Function`: that can be called with a Component to return an observed Component ready for embedding and rendering anywhere.

## Region

> Region

The Region component.

### Props

1. `name` (`String`): The name of the Region
1. `data` (`Object`): Data to be made available to rendered App
1. `uniqueKey` (`String` [optional]): Used when there are multiple Regions of the same `name`. It prop must be unique and fixed throughout the whole app.

## RegionService

Exported from [`frint-component-handlers`](https://frint.js.org/packages/frint-component-handlers#streamprops).

## streamProps

Exported from [`frint-component-utils`](https://frint.js.org/packages/frint-component-utils#streamprops).

## VueHandler

> VueHandler

Handler for React, according to the spec defined in [`frint-component-utils`](https://frint.js.org/packages/frint-component-utils).
