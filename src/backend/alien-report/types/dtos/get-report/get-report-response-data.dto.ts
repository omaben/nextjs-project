export type ReportLabel = Date | string | number;

export enum ReportDatasetKey {
   uniquePlayers = 'uniquePlayers',
   totalBets = 'totalBets',
   totalBetAmountInUsd = 'totalBetAmountInUsd',
   totalWinAmountInUsd = 'totalWinAmountInUsd',
   totalPlInUsd = 'totalPlInUsd',
}
export type ReportDatasetItem = string | number;
export type ReportDataset = {
   [datasetKey: ReportDatasetKey | string]: ReportDatasetItem[];
};

export type GetReportResponseDataDto = {
   labels?: ReportLabel[] | null;
   datasets?: ReportDataset[] | null;
};
