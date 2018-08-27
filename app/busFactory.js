/**
 * Toy bus Factory
 * It assembles a bus instance, injects its dependencies.
 * The factory returns a bus instance.
 */

import carPark from './carPark';

import Messenger from './messenger';
import config from './config';
import Bus from './bus';
export default new Bus(config.bus, new carPark(config.carPark), new Messenger(config.messenger));