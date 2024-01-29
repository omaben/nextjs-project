import { AlienReportGranularity, AlienReportType } from '../types/enums';

const ALIEN_REPORT_ID_SEPARATOR = '_';

export class AlienReportIdHelper {
   static generateId(params: {
      type: AlienReportType;
      env: string;
      opId: string;
      granularity: AlienReportGranularity;
      from: number;
   }): string {
      const { type, env, opId, granularity, from } = params;

      const idComponents = [type, env, opId, granularity, from];

      const id = idComponents.join(ALIEN_REPORT_ID_SEPARATOR);

      return id;
   }
}
