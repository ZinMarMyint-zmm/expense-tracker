import useLayout from "@/hooks/layout";

export const ItemCard = () => {
  const { ItemCardData } = useLayout();
  return (
    <section className="flex md:flex-row flex-col gap-4 justify-center mb-5">
      {ItemCardData.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="w-full md:flex-1 bg-white p-6 rounded-sm shadow"
          >
            <p className="mb-5 flex items-center">
              <Icon className="w-4 h-4 mr-3" />
              {item.title}
            </p>
            <h1 className="font-bold text-2xl">${item.amount}</h1>
          </div>
        );
      })}
    </section>
  );
};
