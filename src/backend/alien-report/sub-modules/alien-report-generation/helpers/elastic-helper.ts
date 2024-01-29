import { AlienReportEnv } from 'backend/alien-report/types/enums';
import { ReportElasticData } from '../types/interface/report-elastic-data.interface';

export class ElasticHelper {
   static getElasticRequestBody(params: {
      env: AlienReportEnv;
      from: number;
      to: number;
   }): Record<string, any> {
      const { env, from, to } = params;

      //  - "product.keyword" is always "ALIEN-GAMES"
      //  - "level.keyword" is always "INFORMATION"

      const query = {
         size: 1000,
         query: {
            bool: {
               must: [
                  {
                     term: {
                        'env.keyword.keyword': env,
                     },
                  },
                  {
                     range: {
                        timestamp: {
                           gte: from,
                           lte: to,
                        },
                     },
                  },
               ],
            },
         },
      };

      return query;
   }

   static parseElasticResponseBody(params: {
      from: number;
      to: number;
      responseBody: Record<string, any>;
   }): { success: boolean; data: ReportElasticData } {
      const { responseBody } = params;
      // const { from, to, responseBody } = params;

      const data: ReportElasticData = [];

      const hits = responseBody?.hits?.hits;

      console.log('responseBody', responseBody);
      console.log('hits', hits);

      for (const hit of hits) {
         data.push({
            timestamp: new Date(hit?._source?.timestamp).getTime(),
            uniquePlayersCount: hit?._source?.logData?.playerIdUniqueCount,
            totalBets: hit?._source?.logData?.betIdCount,
            totalBetAmountInUsd: hit?._source?.rt?.betAmountInUSDSum,
            totalWinAmountInUsd: hit?._source?.rt?.winAmountInUSDSum,
            totalPlInUsd: hit?._source?.rt?.plInUSDSum,
         });
      }

      console.log('data', data);


      return { success: true, data: data };
   }
}
