import Vue from 'vue';

import getMountableComponent from './getMountableComponent';

export default function render(app, el) {
  const Component = getMountableComponent(app);

  const options = (typeof el === 'string')
    ? { el: el }
    : el;

  const vm = new Vue({
    name: 'Rendered' + Component.name,
    ...options,
    ...Component,
  });

  return vm;
}
