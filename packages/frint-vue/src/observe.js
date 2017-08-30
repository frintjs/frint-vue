import composeHandlers from 'frint-component-utils/lib/composeHandlers';
import ObserveHandler from 'frint-component-handlers/lib/ObserveHandler';

import VueHandler from './VueHandler';

export default function observe(getProps$) {
  return function (Component) {
    return {
      name: 'Observed' + Component.name,
      inject: ['app'],
      beforeCreate() {
        this._handler = composeHandlers(
          VueHandler,
          ObserveHandler,
          {
            component: this,
            getProps$: getProps$,
          },
        );
      },
      data() {
        return this._handler.getInitialData();
      },
      beforeMount() {
        this._handler.app = this.app; // context is resolved only now
        this._handler.beforeMount();
      },
      beforeDestroy() {
        this._handler.beforeDestroy();
      },
      render(h) { // eslint-disable-line
        return <Component {...{props: this.computedProps}} />;
      },
    };
  };
}
