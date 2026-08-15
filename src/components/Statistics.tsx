import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { ExpenseCategoryChart } from "@/components/charts/ExpenseCategoryChart";

export const Statistics = ({ monthly, expenseByCategory }) => {
  return (
    <section className="flex md:flex-row flex-col gap-4 justify-center mb-5">
      <div className="w-full md:flex-1 bg-white p-6 rounded-sm shadow">
        <CashFlowChart monthly={monthly} />
      </div>
      <div className="w-full md:flex-1 bg-white p-6 rounded-sm shadow">
        <ExpenseCategoryChart expenseByCategory={expenseByCategory} />
      </div>
    </section>
  );
};
