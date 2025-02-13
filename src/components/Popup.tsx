type contentPopup = {
    icon?:React.ComponentType<{sx?:object}>,
    content:string

}

type AttributePopup = {
  isOpen:boolean,
  onClose:()=>void,
  title?:string,
  content:contentPopup[]
};

function Popup({isOpen,title,content}:AttributePopup) {
  if(!isOpen) return null
  return (
    <div className="fixed justify-center">
      {content.map((c,index)=>(
        <p key={index}>{c.content}</p>
      ))}
    </div>
  );
}

export default Popup;
