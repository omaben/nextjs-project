import {
   ALienReportErrorCode,
   AlienReportBreakdownType,
   AlienReportController,
   AlienReportGranularity,
   AlienReportService,
   GetReportRequestDto,
   GetReportResponseDto,
} from 'backend/alien-report';
import { AlienReportGenerationService } from 'backend/alien-report/sub-modules/alien-report-generation/alien-report-generation.service';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   // const validationResult = await validateDto({
   //    dto: req.body,
   //    dtoClass: GenerateReportRequestDto,
   // });
   if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
   }

   // Validate Request
   const requestDto: GetReportRequestDto = {
      from: req.body?.from,
      to: req.body?.to,
      granularity: req.body?.granularity || AlienReportGranularity.DAY,
      breakdownType: req.body?.breakdownType || AlienReportBreakdownType.TIME,
      opIds: req.body?.opIds,
   };

   // Setup dependencies
   const alienReportGenerationService = new AlienReportGenerationService();
   const alienReportService = new AlienReportService(
      alienReportGenerationService
   );
   const alienReportController = new AlienReportController(alienReportService);

   try {
      const response = await alienReportController.getReport(requestDto);
      res.status(200).json(response);
   } catch (error: any) {
      const response: GetReportResponseDto = {
         success: false,
         message: error?.message,
         errorCode: ALienReportErrorCode.INTERNAL_ERROR,
      };
      res.status(400).json(response);
   }
}
