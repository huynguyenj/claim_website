import { ReactNode } from "react";

type AttributePopup = {
  isOpen: boolean;
  children: ReactNode;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

function Popup({ isOpen, children, top, right, bottom, left }: AttributePopup) {
  if (!isOpen) return null;
  return (
    <div className={`absolute z-99`} style={{ top, right, bottom, left }}>
      {children}
    </div>
  );
}

export default Popup;
