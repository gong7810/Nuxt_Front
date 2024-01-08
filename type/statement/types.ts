export interface AccountingSettlementStatusBean {
  accountPeriodNo: string;
  totalTrialBalance: string;
  incomeStatement: string;
  financialPosition: string;
  capitalStatement: string;
}
export interface CashFlowStatementBean {
  accountInnerCode: string;
  accountName: string;
  parentAccountCode: string;
  cashFlow: string;
  cashFlowSummary: string;
  earlyCashFlow: string;
  earlyCashFlowSummary: string;
  isThisYear: string;
}
export interface CashJournalBean {
  monthReportingDate: string;
  reportingDate: string;
  expenseReport: string;
  customerCode: string;
  customerName: string;
  deposit: number;
  withdrawal: number;
  balance: string;
}
export interface CostStatementBean {
  accountInnerCode: string;
  accountName: string;
  parentAccountCode: string;
  cost: string;
  costSummary: string;
  earlyCost: string;
  earlyCostSummary: string;
  isThisYear: string;
}
export interface DetailTrialBalanceBean {
  lev: number;
  accountInnerCode: string;
  debitsSum: number;
  exceptCashDebits: number;
  cashDebits: number;
  accountName: string;
  cashCredits: number;
  exceptCashCredits: number;
  creditsSum: number;
}
export interface EarlyAssetBean {
  gropuCode: string;
  accountInnerCode: string;
  accountName: string;
  price: string;
  statementsDivision: string;
  balanceDivision: string;
  leftDebitPrice: string;
  rightCreditsPrice: string;
}
export interface EarlyStatements2Bean {
  lev: number;
  debitsSumBalance: number;
  debitsSum: number;
  creditsSumBalance: number;
  creditsSum: number;
  code: string;
  accountPeriodNo: string;
  accountName: string;
}
export interface EarlyStatementsBean {
  earlyStatementsNo: string;
  accountPeriodNo: number;
  accountInnerCode: string;
  leftDebitPrice: number;
  rightCreditsPrice: number;
  lev: number;
  debitsSum: number;
  creditsSum: number;
}
export interface FinancialPositionBean {
  lev: number;
  category: string;
  accountName: string;
  accountCode: string;
  balanceDetail: number;
  balanceSummary: number;
  preBalanceDetail: number;
  preBalanceSummary: number;
  isThisYear: number;
}
export interface IncomeStatementBean {
  accountInnerCode: string;
  accountName: string;
  parentAccountCode: string;
  income: number;
  incomeSummary: number;
  earlyIncome: number;
  earlyIncomeSummary: number;
  isThisYear: string;
  lev: number;
  periodNo: string;
}
export interface MonthIncomeStatementBean {
  year: string;
  month: number;
  salesSummary: number;
  salesCostSummary: number;
  grossMargin: number;
  salesManageCostSummary: number;
  operatingProfit: number;
  nonOperatingProfitSummary: number;
  nonOperatingCostSummary: number;
  ordinaryProfit: number;
  corporateTaxSummary: number;
  netIncome: number;
}
export interface TotalTrialBalance1Bean {
  accountPeriodNo: string;
  lev: number;
  accountName: string;
  code: string;
  debitsSumBalance: number;
  debitsSum: number;
  creditsSum: number;
  creditsSumBalance: number;
}
