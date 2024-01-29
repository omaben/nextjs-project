export type ReportElasticData = ReportElasticDataItem[];

export interface ReportElasticDataItem {
   // #region Elasticsearch Aggregation Response Data
   timestamp: number;
   uniquePlayersCount: number;
   totalBets: number;
   totalBetAmountInUsd: number;
   totalWinAmountInUsd: number;
   totalPlInUsd: number;
   // #endregion

   // #region Computed Data
   // opId: string;
   // from: number;
   // to: number;
   // #endregion
}
