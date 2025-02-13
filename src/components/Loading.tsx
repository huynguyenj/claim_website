import shiba from '../assets/loadingshiba.png'
function Loading() {
  return (
    <div className="relative w-full h-screen bg-cyan-900">
      <div className="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]">
            <img className='w-50 h-50' src={shiba} alt='shiba' />
            <p className='text-center text-4xl text-white uppercase'>Loading...</p>
      </div>
    </div>
  )
}

export default Loading