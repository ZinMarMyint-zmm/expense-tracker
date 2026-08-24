export interface ItemCard {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  amount: number;
}

export interface MonthlyData {
  month: string;
  INCOME: number;
  EXPENSE: number;
  BALANCE: number;
}
export interface CashFlowChartProps {
  monthly: MonthlyData[];
}

export interface ExpenseCategoryData {
  category: string;
  amount: number;
}

export interface ExpenseCategoryChartProps {
  expenseByCategory: ExpenseCategoryData[];
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}