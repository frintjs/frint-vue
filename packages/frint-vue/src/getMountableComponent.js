export default function getMountableComponent(app) {
  const AppComponent = { // eslint-disable-line
    inject: ['app'],
    ...app.get('component'),
  };

  return {
    provide: {
      app: app,
    },
    render(h) { // eslint-disable-line
      return <AppComponent />;
    },
  };
}
