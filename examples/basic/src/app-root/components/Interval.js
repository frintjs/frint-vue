import { Observable } from 'rxjs';

import { observe, streamProps, Region } from 'frint-vue';

export function getProps$(app) {
  return streamProps()
    .set(
      Observable.interval(500),
      x => ({ interval: x })
    )
    .get$();
}

export const Component = {
  name: 'Interval',

  props: ['interval'],

  render(h) {
    return (
      <div>
        <p>Interval: {this.interval}</p>

        <Region name="sidebar" data={{interval: this.interval}} />
      </div>
    );
  }
};

export const Interval = observe(getProps$)(Component);
