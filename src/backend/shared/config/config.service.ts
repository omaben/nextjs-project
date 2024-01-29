export class Config {
   // static Database = class {
   //    static CONNECTION_STRING: string =
   //       process.env.DATABASE_CONNECTION_STRING!;
   //    static NAME: string;
   // };

   static Elasticsearch = class {
      static BASE_API_URL: string = process.env.ELASTICSEARCH_BASE_API_URL!;
      static API_KEY: string = process.env.ELASTICSEARCH_API_KEY!;

      static IndexPattern = class {
         static BET_RESULTS_BY_GENERAL_DAILY =
            'transform-alien-bet-results-general-daily-13';
      };
   };

   static Service = class {
      static PRODUCT: string = process.env.SERVICE_PRODUCT!;
      static TYPE: 'ALIEN_REPORT';
      static ID: string = process.env.SERVICE_ID!;
      static UUID: string;
      static ENV: string = process.env.SERVICE_ENV!;
      static FULL_NAME: string;
      static MAINTENANCE: boolean = false;
      static INIT_SUCCESSFULLY: boolean = false;
      static LOCAL: boolean = process.env.LOCAL === 'true';
   };

   static async init(/*serviceType: ServiceType*/) {
     
   }
}
