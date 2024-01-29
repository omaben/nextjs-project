import { IsObject, IsOptional } from 'class-validator';
import { BaseResponseDto } from '../base';
import type { GetReportResponseDataDto } from './get-report-response-data.dto';

export class GetReportResponseDto extends BaseResponseDto {
   @IsObject()
   @IsOptional()
   data?: GetReportResponseDataDto | null;
}
