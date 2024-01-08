export interface PeriodEntity {
  accountPeriodNo: string;
  periodStartDate: string;
  periodEndDate: string;
  workplaceCode: string;
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

export interface BudgetEntity {
  accountInnerCode: string;
  accountPeriodNo: string;
  budgetingCode: string;
  deptCode: string;
  workplaceCode: string;
  m1Budget?: string;
  m2Budget?: string;
  m3Budget?: string;
  m4Budget?: string;
  m5Budget?: string;
  m6Budget?: string;
  m7Budget?: string;
  m8Budget?: string;
  m9Budget?: string;
  m10Budget?: string;
  m11Budget?: string;
  m12Budget?: string;
}

export interface BudgetProductPK {
  accountInnerCode: string;
  accountPeriodNo: string;
  budgetingCode: string;
  deptCode: string;
  workplaceCode: string;
}

export interface BudgetBean {
  budgetingCode: string;
  deptCode: string;
  workplaceCode: string;
  accountInnerCode: string;
  accountPeriodNo: string;
  m1Budget: number;
  m2Budget: number;
  m3Budget: number;
  m4Budget: number;
  m5Budget: number;
  m6Budget: number;
  m7Budget: number;
  m8Budget: number;
  m9Budget: number;
  m10Budget: number;
  m11Budget: number;
  m12Budget: number;
}

export interface BudgetBeanPK {
  deptCode: string;
  workplaceCode: string;
  accountInnerCode: string;
  accountPeriodNo: string;
  budgetingCode: string;
}

export interface BudgetComparisonStatusBean {
  sortation: string;
  applicationBudget: string;
  compilationBudget: string;
  executionBudget: string;
  executionPerformance: string;
  exampleCompare: string;
}

export interface BudgetStatusBean {
  accountInnerCode: string;
  accountName: string;
  annualBudgetRecord: number;
  annualBudget: number;
  remainingBudget: number;
  budgetExecRatio: number;
  monthBudgetRecord: number;
  monthBudget: number;
  remainingMonthBudget: number;
  monthBudgetExecRatio: number;
}

export interface ComparisonBudgetBean {
  budgetDate: string;
  appBudget: string;
  orgBudget: string;
  execPerform: string;
  budgetAccountComparison: string;
}
