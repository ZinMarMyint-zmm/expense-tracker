import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { ExpenseCategoryChart } from "@/components/charts/ExpenseCategoryChart";
import { ExpenseCategoryData, MonthlyData } from "@/types/dashboard";

type StatisticsProps = {
  monthly: MonthlyData[];
  expenseByCategory: ExpenseCategoryData[];
};

export const Statistics = ({ monthly, expenseByCategory }: StatisticsProps) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-5 justify-center mb-5">
      <div className="w-full lg:col-span-3 bg-white p-6 rounded-sm shadow">
        <CashFlowChart monthly={monthly} />
      </div>
      <div className="w-full lg:col-span-2 bg-white p-6 rounded-sm shadow">
        <ExpenseCategoryChart expenseByCategory={expenseByCategory} />
      </div>
    </section>
  );
};
