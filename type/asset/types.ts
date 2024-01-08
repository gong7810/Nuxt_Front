export interface CurrentAssetBean {
  accountCode: string;
  accountName: string;
  assetCode: string;
  assetName: string;
  progress: string;
  finalizeStatus: string;
  checkStatus: string;
  currentAssetDetailBean: [];
}
export interface CurrentAssetDetailBean {
  assetCode: string;
  acquistionCost: string;
  depreciation: string;
  bookValue: string;
  amortizationWay: string;
  amortizationFinalYear: string;
  usefulLife: string;
  amortizationRate: string;
  month: string;
  normalAmortization: string;
  RAccumulatedAmortization: string;
  accumulatedAmortization: string;
  bookValueEnd: string;
}
