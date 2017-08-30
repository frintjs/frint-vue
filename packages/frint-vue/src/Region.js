import composeHandlers from 'frint-component-utils/lib/composeHandlers';
import RegionHandler from 'frint-component-handlers/lib/RegionHandler';

import VueHandler from './VueHandler';

export default {
  name: 'Region',
  inject: ['app'],
  props: [
    'name',
    'uniqueKey',
    'data',
  ],
  beforeCreate() {
    this._handler = composeHandlers(
      VueHandler,
      RegionHandler,
      {
        component: this,
      },
    );
  },
  data() {
    return this._handler.getInitialData();
  },
  updated() {
    this._handler.afterUpdate();
  },
  beforeMount() {
    this._handler.app = this.app; // context is resolved only now
    this._handler.beforeMount();
  },
  beforeDestroy() {
    this._handler.beforeDestroy();
  },
  render(h) { // eslint-disable-line
    if (this.listForRendering.length === 0) {
      return null;
    }

    return (
      <div>
        {this.listForRendering.map((item) => {
          const { Component, name } = item; // eslint-disable-line

          // @TODO: what to do with `key`? is it needed in Vue, like React?
          return (
            <Component key={`app-${name}`} />
          );
        })}
      </div>
    );
  }
};
