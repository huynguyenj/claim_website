import { Spin } from 'antd'
import { ReactNode, useEffect, useState } from 'react'

function LoadingScreen({children,loading}:{children:ReactNode,loading:boolean[]}) {
      const [isloadingFinal,setIsLoadingFinal] = useState<boolean>(false);
      useEffect(() => {
            if(loading.every((loadingState) => loadingState === true)){
                  setIsLoadingFinal(true)
            }else if(loading.every((loadingState) => loadingState === false)){
                  setIsLoadingFinal(false)
            }
      },[loading])
  return (
    <div className='relative min-h-screen'>
                   {isloadingFinal && (
                    <div className={`
          fixed inset-0 
          bg-black/30 backdrop-blur-sm
          flex flex-col items-center justify-center 
          z-[9999]
          transition-all duration-300
          ${isloadingFinal ? 'opacity-100' : 'opacity-0'}
        `}>
                        {/* Bouncing Dots Animation */}
                        <div className="flex space-x-2 mb-4">
                            {['L', 'O', 'A', 'D', 'I', 'N', 'G'].map((char, i) => (
                                <div
                                    key={i}
                                    className="text-white text-2xl font-bold"
                                    style={{
                                        animation: `bounce 1s infinite ${i * 0.1}s`,
                                    }}
                                >
                                    {char}
                                </div>
                            ))}
                            <div className="flex space-x-1">
                                {[1, 2, 3].map((dot) => (
                                    <div
                                        key={dot}
                                        className="w-2 h-2 bg-white rounded-full"
                                        style={{
                                            animation: `pulse 1.5s infinite ${dot * 0.3}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Antd Spin with custom styling */}
                        <Spin
                            size="large"
                            className="!text-white"
                            indicator={
                                <div className="relative w-10 h-10">
                                    <div className="absolute inset-0 border-4 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                    <div className="absolute inset-1 border-4 border-t-transparent border-r-transparent border-b-white border-l-white rounded-full animate-spin-reverse"></div>
                                </div>
                            }
                        />
                    </div>
                )}
                {children}
    </div>
  )
}

export default LoadingScreen