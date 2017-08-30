import { render } from 'frint-vue';

import RootApp from './app-root/app'
import ChildApp from './app-child';

window.app = new RootApp();
render(window.app, '#root');

window.app.registerApp(ChildApp, {
  regions: ['sidebar'],
});
