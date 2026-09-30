import { STATES_DATA, CITIES_DATA } from './statesAndCities';
import { ATTRACTIONS_SOUTH } from './attractionsSouth';
import { ATTRACTIONS_NORTH_WEST } from './attractionsNorthWest';
import { WEATHER_ALERTS_DATA, TRAVEL_ALERTS_DATA, TRAVEL_UPDATES_DATA } from './alertsAndUpdates';
import { AttractionRecord } from '../types';

export const ALL_ATTRACTIONS: AttractionRecord[] = [
  ...ATTRACTIONS_SOUTH,
  ...ATTRACTIONS_NORTH_WEST,
];

export {
  STATES_DATA,
  CITIES_DATA,
  WEATHER_ALERTS_DATA,
  TRAVEL_ALERTS_DATA,
  TRAVEL_UPDATES_DATA,
};
