import {
   IsArray,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
} from 'class-validator';
import { AlienReportBreakdownType, AlienReportGranularity } from '../../enums';
import { BaseRequestDto } from '../base';

export class GetReportRequestDto extends BaseRequestDto {
   @IsNumber()
   @IsNotEmpty()
   from!: number;

   @IsNumber()
   @IsNotEmpty()
   to!: number;

   @IsEnum(AlienReportGranularity)
   @IsOptional()
   granularity: AlienReportGranularity = AlienReportGranularity.DAY;

   @IsEnum(AlienReportBreakdownType)
   @IsOptional()
   breakdownType?: AlienReportBreakdownType = AlienReportBreakdownType.TIME;

   @IsString({ each: true })
   @IsArray()
   @IsOptional()
   opIds?: string[] | null;
}
