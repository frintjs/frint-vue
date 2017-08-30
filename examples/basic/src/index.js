import FrintVue from '../../../packages/frint-vue';

window.FrintVue = FrintVue;

const App = require('./app-root/app').default;
const ChildApp = require('./app-child').default;

window.app = new App();
FrintVue.render(window.app, '#root');

window.app.registerApp(ChildApp, {
  regions: ['sidebar'],
});
