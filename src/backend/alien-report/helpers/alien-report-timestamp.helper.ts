import { AlienReportGranularity } from '../types/enums';

export class AlienReportTimestampHelper {
   /**
    * Truncate/Normalize/Floor the input `timestamp` according to the specified `granularity`.
    *
    * For example, when specifying HOUR granularity, the timestamp is truncated to the hour -- zeroing-out minutes, seconds, and milliseconds.
    */
   static normalizeTimestamp(params: {
      timestamp: number;
      granularity: AlienReportGranularity;
   }): number {
      const { timestamp, granularity } = params;

      let normalizedTimestamp: number;

      switch (granularity) {
         case AlienReportGranularity.HOUR: {
            const date = new Date(timestamp);

            const year = date.getUTCFullYear();
            const month = date.getUTCMonth();
            const day = date.getUTCDate();
            const hour = date.getUTCHours();

            // hh:00:00 UTC same day
            const normalizedDate = new Date(
               Date.UTC(year, month, day, hour, 0, 0, 0)
            );

            normalizedTimestamp = normalizedDate.getTime();

            break;
         }
         case AlienReportGranularity.DAY: {
            const date = new Date(timestamp);

            const year = date.getUTCFullYear();
            const month = date.getUTCMonth();
            const day = date.getUTCDate();

            // 00:00:00 UTC same day
            const normalizedDate = new Date(
               Date.UTC(year, month, day, 0, 0, 0, 0)
            );

            normalizedTimestamp = normalizedDate.getTime();

            break;
         }
         default:
            const errorMessage = `Unexpected AlienReportGranularity ${granularity}`;
            console.error(errorMessage);
            throw errorMessage;
            normalizedTimestamp = timestamp;
            break;
      }

      return normalizedTimestamp;
   }
}
