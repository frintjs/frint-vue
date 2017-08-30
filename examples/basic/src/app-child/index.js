import { createApp } from 'frint';
import { RegionService } from 'frint-vue';

import { Root } from './Root';

export default createApp({
  name: 'ChildApp',

  providers: [
    {
      name: 'component',
      useValue: Root,
    },
    {
      name: 'region',
      useClass: RegionService,
    },
  ],
});
