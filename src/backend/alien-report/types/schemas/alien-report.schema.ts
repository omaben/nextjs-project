import mongoose, { Schema } from 'mongoose';
import { AlienReportEntity } from '../entities';
import {
   AlienReportEnv,
   AlienReportGranularity,
   AlienReportType,
} from '../enums';

export const ALIEN_REPORT_COLLECTION_NAME = 'collection_alien_report';
export const ALIEN_REPORT_MODEL_NAME = ALIEN_REPORT_COLLECTION_NAME;

const schemaOptions = {
   timestamps: true,
   strict: false,
};

/**
 * `id`: `type-env-opId-granularity-from`
 */
export const AlienReportSchema = new Schema(
   {
      id: { type: String, required: true, unique: true, index: true },

      opId: { type: String, required: true, index: true },

      opFullId: { type: String, index: true },

      granularity: {
         type: String,
         enum: AlienReportGranularity,
         required: true,
         index: true,
      },

      from: { type: Number, required: true, index: true },

      to: { type: Number, required: true, index: true },

      type: {
         type: String,
         enum: AlienReportType,
         required: true,
         index: true,
      },

      env: {
         type: String,
         enum: AlienReportEnv,
         required: true,
         index: true,
      },

      // #region Report Data
      totalBets: { type: Number, required: true, index: true },

      totalBetAmountInUsd: { type: Number, required: true, index: true },

      totalPlInUsd: { type: Number, required: true, index: true },
      // #endregion

      // #region DateTime
      createdAt: { type: Date, index: true },

      updatedAt: { type: Date, index: true },
      // #endregion
   },
   schemaOptions
);

export const AlienReportModel = mongoose.model<AlienReportEntity & Document>(
   'AlienReport',
   AlienReportSchema
);
