export function Advertisement({
  orientation = "horizontal",
  className = "",
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div
      className={`bg-gray-300 border border-gray-300 flex items-center justify-center text-gray-400 font-bold tracking-[0.2em] ${
        orientation === "horizontal"
          ? "w-full min-h-[100px] text-xl"
          : "w-full h-[600px] text-sm"
      } ${className}`}
    >
      <span
        style={
          orientation === "vertical"
            ? { writingMode: "vertical-rl", transform: "rotate(180deg)" }
            : {}
        }
      >
        ADVERTISEMENT
      </span>
    </div>
  );
}
