import { AlienReportGranularity, AlienReportType } from '../enums';

export interface AlienReportEntity {
   /// type-env-opId-granularity-from
   id: string;

   opId: string;

   opFullId?: string | null;

   granularity: AlienReportGranularity;

   /// When stored, minutes and seconds and milliseconds should be zero (zero-out any digits after granularity -- now only HOUR)
   from: number;

   /// When stored, minutes and seconds and milliseconds should be zero (zero-out any digits after granularity -- now only HOUR)
   to: number;

   env: string;

   // #region Report Data
   type: AlienReportType;

   totalBets: number;

   totalBetAmountInUsd: number;

   totalWinAmountInUsd: number;

   totalPlInUsd: number;
   // #endregion

   // #region DateTime
   createdAt?: Date | null;

   updatedAt?: Date | null;
   // #endregion
}
