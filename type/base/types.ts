// Entity Types
export interface AccountEntity {
  accountInnerCode: string;
  parentAccountInnerCode: string;
  accountCode: string;
  accountCharacter: string;
  accountName: string;
  accountDisplayNameWithCode: string;
  accountDisplayName: string;
  accountDivision: string;
  accountUseCheck: string;
  accountDescription: string;
  groupCode: string;
  editable: string;
  target: string;
  budget: string;
}

export interface DepartmentEntity {
  workplaceCode: string;
  deptCode: string;
  workplaceName: string;
  deptName: string;
  companyCode: string;
  deptStartDate: string;
  deptEndDate: string;
}

export interface DepartmentPK {
  workplaceCode: string;
  deptCode: string;
}

export interface DepartmentSelectList {
  getWorkplaceCode(): string;
  getWorkplaceName(): string;
}

export interface PeriodEntity {
  accountPeriodNo: string;
  periodStartDate: string;
  periodEndDate: string;
  workplaceCode: string;
}

// TO Types
export interface Account {
  accountInnerCode: string;
  parentAccountInnerCode: string;
  accountCode: string;
  accountCharacter: string;
  accountName: string;
  accountDisplayNameWithCode: string;
  accountDisplayName: string;
  accountDivision: string;
  accountUseCheck: string;
  accountDescription: string;
  groupCode: string;
  editable: string;
  target: string;
  budget: string;
  status: string;
}

export interface AccountBean {
  accountControlList: [];
  accountInnerCode: string;
  parentAccountInnercode: string;
  accountCode: string;
  accountCharacter: string;
  accountName: string;
  accountDivision: string;
  accountUseCheck: string;
  accountDescription: string;
  groupCode: string;
  editable: string;
  lev: string;
  status: string;
}

export interface AccountCodeBean {
  accountLevel: string;
  leaf: string;
  accountInnerCode: string;
  parentAccountInnerCode: string;
  accountCode: string;
  accountCharacter: string;
  accountName: string;
  accountDisplayNameWithCode: string;
  accountDisplayName: string;
  accountDivision: string;
  accountUseCheck: string;
  accountDescription: string;
  groupCode: string;
}

export interface AccountControlBean {
  accountControlCode: string;
  accountControlName: string;
  accountControlType: string;
}

export interface AddressBean {
  zipNo: string;
  zipcode: string;
  sido: string;
  sigungu: string;
  dong: string;
  ri: string;
  bunji: string;
  sidoname: string;
  roadName: string;
  buildingCode1: string;
  buildingCode2: string;
}

export interface BusinessBean {
  businessName: string;
  classificationCode: string;
  remarks: string;
}

export interface CodeBean {
  divisionCodeNo: string;
  codeType: string;
  divisionCodeName: string;
}

export interface CustomerBean {
  customerCode: string;
  workplaceCode: string;
  customerName: string;
  customerType: string;
  customerCeo: string;
  businessLicenseNumber: string;
  socialSecurityNumber: string;
  customerBusinessConditions: string;
  customerBusinessItems: string;
  customerZipCode: string;
  customerBasicAddress: string;
  customerDetailAddress: string;
  customerTelNumber: string;
  customerFaxNumber: string;
  accountNumber: string;
  cardNumber: string;
  customerNote: string;
  cardType: string;
  cardMemberName: string;
  cardOpenPlace: string;
  financialInstituteName: string;
  financialInstituteCode: string;
  status: string;
}

export interface DetailBusinessBean {
  detailBusinessName: string;
  ChildClassificationCode: string;
  remarks: string;
}

export interface DetailCodeBean {
  divisionCodeNo: string;
  detailCode: string;
  detailCodeName: string;
  description: string;
}

export interface IncomeStatementResultBean {
  errorCode: Number;
  errorMsg: string;
}

export interface IreportBean {
  slipNo: string;
  reportingDate: string;
  deptName: string;
  empName: string;
  accountName: string;
  expenseReport: string;
  leftDebitPrice: string;
  rightCreditsPrice: string;
}

export interface LedgerByAccountBean {
  carryForward: string;
  reportingDate: string;
  accountName: string;
  customerName: string;
  leftDebitPrice: string;
  rightCreditsPrice: string;
  totalPrice: string;
  expenseReport: string;
  customerCode: string;
}

export interface MenuBean {
  MenuCode: string;
  MenuName: string;
  ParentMenuCode: string;
  Url: string;
  UPositionCodel: string;
}

export interface OpenApiBean {
  sidonm: string;
  co: string;
  no: string;
  so: string;
  tsp: string;
  pm: string;
  voc: string;
  pm2: string;
  nh3: string;
}

export interface OpenApiBean2 {
  dateName: string;
  locdate: string;
}

export interface PeriodBean {
  accountPeriodNo: string;
  fiscalYear: string;
  workplaceCode: string;
  periodStartDate: string;
  periodEndDate: string;
}

export interface TrialBalanceResultBean {
  errorCode: Number;
  errorMsg: string;
}

export interface SlipIreportBean {
  slipNo: string;
  reportingDate: string;
  deptName: string;
  empName: string;
  accountName: string;
  expenseReport: string;
  leftDebitPrice: string;
  rightCreditsPrice: string;
}

export interface WorkplaceBean {
  workplaceCode: string;
  companyCode: string;
  workplaceName: string;
  businessLicense: string;
  corporationLicence: string;
  workplaceCeoName: string;
  businessConditions: string;
  businessItems: string;
  workplaceTelNumber: string;
  workplaceFaxNumber: string;
  workplaceBasicAddress: string;
  approvalStatus: string;
}
