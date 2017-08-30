import { AppName } from './AppName';
import { Interval } from './Interval';
import { Counter } from './Counter';

export default {
  name: 'Root',

  render(h) {
    return (
      <div>
        <p>Hello World from <strong>RootApp</strong>!</p>

        <AppName />

        <Interval />

        <Counter />
      </div>
    );
  }
}
