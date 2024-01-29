import { validate } from 'class-validator';
import { ValidationResult } from './validation-result.interface';

/**
 *
 * @example
 * ```ts
 * const validationResult = await validateDto(dtoClass: SampleDtoClass, dto: dto);
 * ```
 */
export async function validateDto(params: {
   dtoClass: any;
   dto: any;
}): Promise<ValidationResult> {
   const { dtoClass, dto } = params;
   const dtoObject = Object.assign(new dtoClass(), dto);
   const errors = await validate(dtoObject);

   if (errors.length > 0) {
      return {
         success: false,
         errors: errors,
      };
   }

   return {
      success: true,
      errors: null,
   };
}
