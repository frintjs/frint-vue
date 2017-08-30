import getMountableComponent from './getMountableComponent';

export default {
  getData(key) {
    return this.component[key];
  },
  setData(key, value) {
    return this.component[key] = value;
  },
  getProps() {
    return Object
      .keys(this.component)
      .reduce((acc, key) => {
        return {
          ...acc,
          key: this.component[key],
        };
      }, {});
  },
  getProp(key) {
    return this.component[key];
  },
  getMountableComponent,
};
