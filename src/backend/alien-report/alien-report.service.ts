import { CustomLogger } from 'backend/utils';
import { AlienReportTimestampHelper } from './helpers';
import { AlienReportGenerationService } from './sub-modules/alien-report-generation/alien-report-generation.service';
import {
   GetReportRequestDto,
   GetReportResponseDto
} from './types/dtos';
import {
   GetReportResponseDataDto
} from './types/dtos/get-report/get-report-response-data.dto';

export class AlienReportService {
   private readonly logger = new CustomLogger(AlienReportService.name);

   constructor(
      private readonly alienReportGenerationService: AlienReportGenerationService
   ) {}

   async getReport(
      requestDto: GetReportRequestDto
   ): Promise<GetReportResponseDto> {
      try {
         const { from, to, granularity, breakdownType } = requestDto;

         const normalizedFrom = AlienReportTimestampHelper.normalizeTimestamp({
            timestamp: from,
            granularity: granularity,
         });
         const normalizedTo = AlienReportTimestampHelper.normalizeTimestamp({
            timestamp: to,
            granularity: granularity,
         });

         const { labels, datasets } =
            await this.alienReportGenerationService.generateReport({
               from: normalizedFrom,
               to: normalizedTo,
               granularity: granularity,
            });

         this.logger.debug('Generation succeeded!');
         // console.log(alienReportEntities);

         const responseData: GetReportResponseDataDto = {
            labels: labels || null,
            datasets: datasets || null,
         };

         if (responseData) {
            const responseDto: GetReportResponseDto = {
               success: true,
               data: responseData,
            };
            return responseDto;
         }

         // if (breakdownType === AlienReportBreakdownType.OP_ID) {
         //    const opIdBreakdown: GetReportResponseDataOpIdBreakdown =
         //       alienReportEntities.reduce((acc, entity) => {
         //          acc[entity.opId] = acc[entity.opId] || {};
         //          acc[entity.opId][entity.from] = entity;
         //          return acc;
         //       }, {} as GetReportResponseDataOpIdBreakdown);

         //    const responseDto: GetReportResponseDto = {
         //       success: true,
         //       data: opIdBreakdown,
         //    };

         //    return responseDto;
         // }

         // // Default
         // if (requestDto.breakdownType === AlienReportBreakdownType.TIME) {
         //    const timestampBreakdown: GetReportResponseDataTimestampBreakdown =
         //       alienReportEntities.reduce((acc, entity) => {
         //          acc[entity.from] = acc[entity.from] || {};
         //          acc[entity.from][entity.opId] = entity;
         //          return acc;
         //       }, {} as GetReportResponseDataTimestampBreakdown);

         //    const responseDto: GetReportResponseDto = {
         //       success: true,
         //       data: timestampBreakdown,
         //    };

         //    return responseDto;
         // }

         const responseDto: GetReportResponseDto = {
            success: false,
            data: null,
         };
         return responseDto;
      } catch (error) {
         const responseDto: GetReportResponseDto = {
            success: false,
            message: null,
            data: null,
         };

         return responseDto;
      }
   }
}
