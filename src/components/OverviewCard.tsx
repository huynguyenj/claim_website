type Card = {
      title: string,
      image?:string,
      content?:string
}
function OverviewCard({title,image,content}:Card) {
  return (
    <div className="flex flex-col gap-5 p-4 items-center justify-center w-full h-80 bg-transparent hover:ring-4 ring-2 ring-cyan-500 rounded-3xl hover:scale-105 duration-400 ease-in-out">
            <img className="w-30 h-30 rounded-full" src={image} alt="image" />
            <div>
                  <h1 className="text-2xl text-center">{title}</h1>
                  <p className="text-[0.9rem] text-center text-gray-400">{content}</p>
            </div>
    </div>
  )
}

export default OverviewCard