import {
   IsBoolean,
   IsEnum,
   IsNotEmpty,
   IsOptional,
   IsString,
} from 'class-validator';
import { ALienReportErrorCode } from '../../enums';

export class BaseResponseDto {
   @IsBoolean()
   @IsNotEmpty()
   success!: boolean;

   @IsString()
   @IsOptional()
   message?: string | null;

   @IsEnum(ALienReportErrorCode)
   @IsOptional()
   errorCode?: ALienReportErrorCode | null;

   errors?: any;
}
