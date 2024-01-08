export interface SlipBean {
  slipNo: string;
  accountPeriodNo: string;
  slipType: string;
  expenseReport: string;
  postingDate: string;
  reportingDate: string;
  reportingEmpCode: string;
  reportingEmpName?: string;
  slipStatus?: string;

  deptCode?: string;
  slipDescription?: string;
  balanceDivision?: string;
  approvalEmpCode?: string;
  approvalDate?: string;
  positionCode?: string;
  authorizationStatus?: string;
  deptName?: string;
  journalList?: JournalBean[];
  journalDeadline?: JournalDeadlineDivsionBean[];
}

export interface JournalBean {
  journalNo: string;
  slipNo: string;
  accountInnerCode: string;
  accountName: string;
  customerCode: string;
  customerName: string;
  balanceDivision: string;
  leftDebitPrice: string;
  rightCreditPrice: string;
  Price?: string;
  accountCode?: string;
  JournalDetailList?: JournalDetailBean[];
}

export interface JournalDetailBean {
  journalDetailNo: number;
  journalNo: string;
  accountControlName: string;
  accountControlType: string;
  journalDescription: string;
  showDetails?: string;
}

export interface JournalDeadlineDivsionBean {
  deliveryNo: string;
  estimateNo: string;
  contractNo: string;
  contractDetailNo: string;
  customerCode: string;
  personCodeInCharge: string;
  itemCode: string;
  itemName: string;
  unitOfDelivery: string;
  deliveryAmount: string;
  unitPrice: string;
  sumPrice: string;
  deliverydate: string;
  deliveryPlaceName: string;
  finalizeStatus: string;
  empCode: string;

  applyYearMonth: string;
  salary: string;
  totalExtSal: string;
  totalPayment: string;
  totalDeduction: string;
  realSalary: string;
  cost: string;
  unusedDaySalary: string;
  deptCode: string;
}

export interface JournalDoubleBean {
  reportingDate: string;
  leftAccountName: string;
  leftDebitPrice: string;
  rightAccountName: string;
  rightCreditsPrice: string;
  customerName: string;
  expenseReport: string;
}

export interface JournalSeparatorBean {
  slipNo: string;
  deliveryNo: string;
  empCode: string;
  applyYearMonth: string;
  seqNo: string;
}

export interface GeneralAccountLedgerBean {
  reportingDate: string;
  accountName: string;
  leftDebitPrice: string;
  rightCreditsPrice: string;
  customerName: string;
  expenseReport: string;
}
