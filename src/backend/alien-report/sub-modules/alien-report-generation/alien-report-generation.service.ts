import axios from 'axios';
import {
   ReportDataset,
   ReportDatasetItem,
   ReportDatasetKey,
   ReportLabel,
} from 'backend/alien-report/types/dtos/get-report/get-report-response-data.dto';
import {
   AlienReportEnv,
   AlienReportGranularity,
} from 'backend/alien-report/types/enums';
import { Config } from 'backend/shared';
import { CustomLogger } from 'backend/utils';
import path from 'path';
import { ElasticHelper } from './helpers/elastic-helper';
import { ReportElasticData } from './types/interface/report-elastic-data.interface';

export class AlienReportGenerationService {
   private readonly logger = new CustomLogger(
      AlienReportGenerationService.name
   );

   constructor() {}

   async generateReport(params: {
      from: number;
      to: number;
      granularity: AlienReportGranularity;
   }): Promise<{
      labels?: ReportLabel[];
      datasets?: ReportDataset[];
   }> {
      const { from, to } = params;

      let elasticApiFailed = false;
      const labels: ReportLabel[] = [];
      const datasets: ReportDataset[] = [];

      const reportElasticData = await this.getReportElasticData({
         from: from,
         to: to,
      });

      elasticApiFailed =
         !reportElasticData?.success || !reportElasticData?.data;
      if (elasticApiFailed) {
         this.logger.error(`getReportElasticData failed for ${params}`);
         console.log(reportElasticData);
         this.logger.error('Stopping report generation!');
         return {};
      }

      const uniquePlayers: ReportDatasetItem[] = [];
      const totalBets: ReportDatasetItem[] = [];
      const totalBetAmountInUsd: ReportDatasetItem[] = [];
      const totalWinAmountInUsd: ReportDatasetItem[] = [];
      const totalPlInUsd: ReportDatasetItem[] = [];
      for (const item of reportElasticData.data as ReportElasticData) {
         labels.push(item.timestamp);
         uniquePlayers.push(item.uniquePlayersCount);
         totalBets.push(item.totalBets);
         totalBetAmountInUsd.push(item.totalBetAmountInUsd);
         totalWinAmountInUsd.push(item.totalWinAmountInUsd);
         totalPlInUsd.push(item.totalPlInUsd);
      }

      datasets.push({
         [ReportDatasetKey.uniquePlayers]: uniquePlayers,
         [ReportDatasetKey.totalBets]: totalBets,
         [ReportDatasetKey.totalBetAmountInUsd]: totalBetAmountInUsd,
         [ReportDatasetKey.totalWinAmountInUsd]: totalWinAmountInUsd,
         [ReportDatasetKey.totalPlInUsd]: totalPlInUsd,
      });

      return {
         labels,
         datasets,
      };
   }

   private async getReportElasticData(params: {
      from: number;
      to: number;
   }): Promise<{
      success: boolean;
      data?: ReportElasticData | null;
   }> {
      const logLocation = 'AlienReportGenerationService.getReportElasticData()';

      const { from, to } = params;

      const baseApiUrl = Config.Elasticsearch.BASE_API_URL;
      const indexPattern =
         Config.Elasticsearch.IndexPattern.BET_RESULTS_BY_GENERAL_DAILY;
      const searchApiPath = '_search';
      const requestUrl = path.join(baseApiUrl, indexPattern, searchApiPath);

      const requestHeaders = {
         'Content-Type': 'application/json',
         Authorization: `ApiKey ${Config.Elasticsearch.API_KEY}`,
      };
      const requestConfig = {
         headers: requestHeaders,
         timeout: 15_000,
      };

      const requestBody = ElasticHelper.getElasticRequestBody({
         env: AlienReportEnv.PROD,
         from: from,
         to: to,
      });

      console.log('requestUrl', requestUrl);
      console.log('requestBody', requestBody);
      console.log('requestConfig', requestConfig);

      try {
         const response = await axios.post(
            requestUrl,
            requestBody,
            requestConfig
         );
         const responseBody = response.data;

         const aggregationFailed =
            !responseBody ||
            responseBody?.error ||
            responseBody?._shards.failed > 0 ||
            responseBody?.timed_out;
         if (aggregationFailed) {
            // EHlogger.infoError(
            //    `Elasticsearch API call failed to perform requested aggregations.`,
            //    logLocation,
            //    {
            //       callApiRes,
            //    }
            // );
            this.logger.error(
               'Elasticsearch API call failed to perform requested aggregations.'
            );
            this.logger.error(logLocation);
            this.logger.error(response?.status?.toString());
            this.logger.error(response?.data);

            return {
               success: false,
               data: null,
            };
         }

         const parsedResponseBody = ElasticHelper.parseElasticResponseBody({
            from,
            to,
            responseBody: responseBody,
         });

         return {
            success: parsedResponseBody.success,
            data: parsedResponseBody.data,
         };
      } catch (error: any) {
         this.logger.error(
            'Elasticsearch API call failed to perform requested aggregations.'
         );
         this.logger.error(logLocation);
         this.logger.error(error);

         return {
            success: false,
            data: null,
         };
      }
   }
}
