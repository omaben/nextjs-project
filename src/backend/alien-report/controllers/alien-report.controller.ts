import { AlienReportService } from '../alien-report.service';
import type { GetReportRequestDto, GetReportResponseDto } from '../types/dtos';

export class AlienReportController {
   constructor(private readonly alienReportService: AlienReportService) {}

   async getReport(
      requestDto: GetReportRequestDto
   ): Promise<GetReportResponseDto> {
      const responseDto: GetReportResponseDto =
         await this.alienReportService.getReport(requestDto);
      return responseDto;
   }
}
