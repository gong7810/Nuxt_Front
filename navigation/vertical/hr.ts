export default [
  {
    title: "hrHome",
    to: { name: "hr-Home" },
    icon: { icon: "tabler-smart-home" },
  },
  {
    title: '인사관리',
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "전표조회",
        to: { name: "account-account-SlipFormPage" },
      },
      {
        title: "전표추가",
        to: { name: "account-account-AddSlipFormPage" },
      },
      {
        title: "전표승인",
        to: { name: "account-account-ApprovalManagerFormPage" },
      },
      {
        title: "분개장",
        to: { name: "account-account-JournalFormPage" },
      },
    ],
  },
  {
    title: "지출증빙관리",
    icon: { icon: "tabler-receipt" },
    children: [
      {
        title: "지출증빙 관리",
        to: { name: "account-account-ReceiptFormPage" },
      },
    ],
  },
  {
    title: "장부관리",
    icon: { icon: "tabler-notebook" },
    children: [
      {
        title: "계정별원장",
        to: { name: "account-base-AccountLedgerPage" },
      },
      {
        title: "총계정원장",
        to: { name: "account-base-GeneralAccountLedgerPage" },
      },
      {
        title: "일(월)계표",
        to: { name: "account-base-DetailTrialBalancePage" },
      },
      {
        title: "현금출납장",
        to: { name: "account-base-CashJournalPage" },
      },
    ],
  },
  {
    title: "결산/재무제표관리",
    icon: { icon: "tabler-calculator" },
    children: [
      {
        title: "합계잔액시산표",
        to: { name: "account-statement-TotalTrialBalancePage" },
      },
      {
        title: "재무상태표",
        to: { name: "account-statement-FinancialPositionPage" },
      },
      {
        title: "손익계산서",
        to: { name: "account-statement-IncomeStatementPage" },
      },
      {
        title: "원가명세서",
        to: { name: "account-statement-CostStatementPage" },
      },
      {
        title: "이익잉여금처분계산서",
        to: { name: "account-statement-RetainedEarningsStatementPage" },
      },
      {
        title: "기간별손익계산서",
        to: { name: "account-statement-MonthIncomeStatementPage" },
      },
      {
        title: "기간별원가명세서",
        to: { name: "account-statement-MonthCostStatementPage" },
      },
      {
        title: "현금흐름표",
        to: { name: "account-statement-CashFlowStatementPage" },
      },
    ],
  },
  {
    title: "고정자산관리",
    icon: { icon: "tabler-backhoe" },
    children: [
      {
        title: "고정자산등록",
        to: { name: "account-assets-FixedAssetRegistrationPage" },
      },
      {
        title: "감가상각비현황",
        to: { name: "account-assets-DepreciationSchedulePage" },
      },
      {
        title: "고정자산관리대장",
        to: { name: "account-assets-FixedAssetLedgerPage" },
      },
    ],
  },
  {
    title: "자금관리",
    icon: { icon: "tabler-building-bank" },
    children: [
      {
        title: "일자별자금계획입력",
        to: { name: "account-funds-DailyFundPlanInputFormPage" },
      },
      {
        title: "자금계획카렌다",
        to: { name: "account-funds-FundPlanningCalendarFormPage" },
      },
      {
        title: "받을어음명세서",
        to: { name: "account-funds-NoteReceivableSpecificationFormPage" },
      },
      {
        title: "지급어음명세서",
        to: { name: "account-funds-NotePayableSpecificationFormPage" },
      },
      {
        title: "일일자금/분개현황",
        to: { name: "account-funds-DailyFundJournalFormPage" },
      },
    ],
  },
  {
    title: "예산관리",
    icon: { icon: "tabler-coins" },
    children: [
      {
        title: "예산 신청",
        to: { name: "account-budget-BudgetRequest-BudgetRequestPage" },
      },
      {
        title: "예산 편성",
        to: { name: "account-budget-BudgetFormulation-TestTest" },
      },
      {
        title: "예산 실적 현황",
        to: { name: "account-budget-BudgetStatus-BudgetStatusPage" },
      },
    ],
  },
  {
    title: "업무용승용차관리",
    icon: { icon: "tabler-car" },
    children: [
      {
        title: "업무용승용차 차량등록",
        to: { name: "account-vehicle-VehicleRegistrationPage" },
      },
      {
        title: "업무용승용차 운행기록부",
        to: { name: "account-vehicle-VehicleLogbookPage" },
      },
    ],
  },
  {
    title: "기초정보관리",
    icon: { icon: "tabler-pencil" },
    children: [
      {
        title: "계정과목관리",
        to: { name: "account-base-AccountCodeManager" },
      },
      {
        title: "거래처관리",
        to: { name: "account-base-CustomerManagerPage" },
      },
    ],
  },
];
