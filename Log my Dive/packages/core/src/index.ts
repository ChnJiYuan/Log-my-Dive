// Models
export type { DiveLog, CreateDiveLogInput, UpdateDiveLogInput, DiveSource, DiveType, SeaCondition, TankType } from './models/DiveLog';
export { calcDurationMinutes, dedupKey } from './models/DiveLog';

export type { User, CreateUserInput, UnitSystem } from './models/User';

export type { ImportSource, ImportResult, ImportSourceType, ImportSourceStatus } from './models/ImportSource';

// Services
export type { DiveLogRepository, DiveLogFilter } from './services/DiveLogRepository';
export type { DiveStats } from './services/StatisticsService';
export { computeStats, formatDiveTime } from './services/StatisticsService';

// Utils
export {
  metresToDisplay,
  celsiusToDisplay,
  barToDisplay,
  kgToDisplay,
  displayToMetres,
  displayToCelsius,
  displayToBar,
  displayToKg,
} from './utils/units';
