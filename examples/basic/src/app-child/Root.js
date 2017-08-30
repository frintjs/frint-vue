import { observe, streamProps } from 'frint-vue';

const Component = {
  name: 'Root',

  props: [
    'appName',
    'interval',
  ],

  render(h) {
    return (
      <div>
        <p>
          Hello World from <strong>{this.appName}</strong>!
          With interval: {this.interval}.
        </p>
      </div>
    );
  }
};

export const Root = observe(function (app) {
  return streamProps()
    .set('appName', app.getName())
    .set(
      app.get('region').getData$(),
      data => ({ interval: data.interval })
    )
    .get$();
})(Component);
