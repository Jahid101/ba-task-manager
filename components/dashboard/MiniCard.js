import React from "react";
import CardContent from "@/components/customUI/CardContent";

const MiniCard = ({ cardData }) => {
  function Card(props) {
    return (
      <CardContent className="p-3">
        <section className="flex justify-between gap-2">
          {/* label */}
          <p className="text-primary">{props.label}</p>
          {/* icon */}
          <p className="text-[18px] text-primary mt-[3px]">{props.icon}</p>
        </section>
        <section className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-primary">{props.amount}</h2>
          <p className="text-xs text-primary">{props.description}</p>
        </section>
      </CardContent>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 gap-x-4 transition-all sm:grid-cols-2 xl:grid-cols-3 h-fit">
      {cardData.map((d, i) => (
        <Card key={d.id} amount={d.amount} description={d.description} icon={d.icon} label={d.label} />
      ))}
    </div>
  );
};

export default MiniCard;
