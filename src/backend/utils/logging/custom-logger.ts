import pino from 'pino';

export class CustomLogger {
   private logger: pino.Logger;

   constructor(private context: string) {
      const isProduction = process.env.NODE_ENV === 'production';

      const transport = isProduction
         ? undefined
         : {
            // - Good for non-production environments
            // - https://github.com/pinojs/pino/blob/master/docs/pretty.md
            target: 'pino-pretty',
            options: { colorize: true },
         };

      this.logger = pino({
         base: { context },
         transport: transport,
      });
   }

   error(message: any): void {
      console.log(message);
      // this.logger.error(message);
   }

   warn(message: any): void {
      console.log(message);
      // this.logger.warn(message);
   }

   info(message: any): void {
      console.log(message);
      // this.logger.info(message);
   }

   debug(message: any): void {
      console.log(message);
      // this.logger.debug(message);
   }

   verbose(message: any): void {
      console.log(message);
      // this.logger.trace(message);
   }
}
