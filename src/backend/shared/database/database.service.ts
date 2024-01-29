import mongoose from 'mongoose';
import { Config } from '../config';

export class DatabaseService {
   private static dbConnection: typeof mongoose | null = null;

   private constructor() {
      // Prevent public instantiation.
   }

   public static async connect() {
      if (this.dbConnection) {
         return this.dbConnection;
      }

      // const connectionString = Config.Database.CONNECTION_STRING;
      // const dbName = Config.Database.NAME;
      // this.dbConnection = await mongoose.connect(connectionString, {
      //    dbName: dbName,
      // });

      return this.dbConnection;
   }

   public static async disconnect() {
      if (this.dbConnection) {
         await mongoose.disconnect();
         this.dbConnection = null;
      }
   }
}
