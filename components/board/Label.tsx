export const Label = ({ key, color, name }: any) => {
  console.log(key, color, name);

  return (
    <span
      key={key}
      className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {name}
    </span>
  );
};
