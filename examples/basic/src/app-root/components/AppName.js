import { observe, streamProps } from 'frint-vue';

export function getProps$(app) {
  return streamProps()
    .set('appName', app.getName())
    .get$();
}

export const Component = {
  name: 'AppName',

  props: ['appName'],

  render(h) {
    return (
      <div>
        <p>AppName: {this.appName}</p>
      </div>
    );
  }
};

export const AppName = observe(getProps$)(Component);
