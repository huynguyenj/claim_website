type ContentType = {
  title:string,
  content:string,
  date: Date
}

type AttributePopup = {
  width: string;
  bg_color: string;
  textColor?: string;
  textSize?: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  padding_x?: number;
  padding_y?: number;
  content?: ContentType[];
};

function Popup({
  width,
  bg_color,
  textColor,
  textSize,
  top,
  right,
  left,
  bottom,
  padding_x,
  padding_y,
  content,
}: AttributePopup) {
  return (
    <div
      className={`absolute rounded-2xl flex flex-col leading-7 ${ top ? `top-${top}` : ""} ${right ? `right-${right}` : ""} ${left ? `left-${left}` : ""} ${bottom ? `bottom-${bottom}` : ""} w-${width} ${padding_x? `px-${padding_x}`:""} ${padding_y ? `py-${padding_y}`:""} `}
      style={{
        backgroundColor: bg_color,
        color: textColor,
        fontSize: textSize,
      }}
    >
      {content && content?.map((c)=>(
        <div className="flex flex-col items-center">
        <div className="flex gap-2">
            <p>{c.title}:</p>
            <p>{c.content}</p>
        </div>
          <p>({new Date(c.date).toLocaleDateString('en-US')})</p>
        </div>

      ))}
    </div>
  );
}

export default Popup;
