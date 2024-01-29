import { ValidationError } from 'class-validator';

export interface ValidationResult {
   success: boolean;
   errors?: ValidationError[] | null;
}
