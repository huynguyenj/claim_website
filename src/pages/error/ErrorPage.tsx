import { useNavigate } from 'react-router-dom';
import simsons from '../../assets/simsoncrying.png'

function ErrorPage() {
      const navigate = useNavigate();
      const handleChangePage = ()=>{
            navigate('/',{replace:true})
      }
  return (
    <div className="bg-gray-100 w-full h-screen relative">
      <div className="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]">
            <div className="relative flex-col sm:flex sm:flex-row items-center gap-5 mb-3">
                  <div className="bg-red-400 absolute w-90 h-90 rounded-full -top-20 -left-30 -z-1 shadow-2xl"></div>
                  <div className='flex gap-2 justify-center items-center w-20 h-25 rounded-full bg-amber-500 z-1'>
                        <p className='text-6xl sm:text-9xl font-bold text-white'>4</p>
                        <img src={simsons} alt="simsons" />
                        <p className='text-6xl sm:text-9xl font-bold text-white'>4</p></div>
                  <h2 className="text-2xl sm:text-4xl sm:ml-20 text-gray-600">Page not found</h2>
            </div>
            <button onClick={handleChangePage} className="sm:mt-2 sm:m-20 hover:bg-orange-500 cursor-pointer rounded-2xl p-3 bg-amber-300 duration-200 ease-in-out border-2 text-[0.9rem] sm:text-[1.2rem] text-white">Back to home page</button>
            
      </div>
    </div>
  )
}

export default ErrorPage