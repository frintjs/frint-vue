import { createApp } from 'frint';

import Root from '../components/Root';

export default createApp({
  name: 'RootApp',

  providers: [
    {
      name: 'component',
      useValue: Root,
    },
  ],
});
