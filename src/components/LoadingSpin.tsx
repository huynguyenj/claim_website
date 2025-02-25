type StyleLoading = {
  width: string;
  height: string;
  border_color: string;
  border_top_clr: string;
};
function LoadingSpin({
  width,
  height,
  border_color,
  border_top_clr,
}: StyleLoading) {
  return (
    <div
      className="rounded-full animate-loading border-2"
      style={{
        width: `${width}`,
        height: `${height}`,
        borderColor: `${border_color}`,
        borderTopColor: `${border_top_clr}`,
      }}
    ></div>
  );
}

export default LoadingSpin;
