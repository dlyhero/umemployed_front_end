import React from 'react'
import Form from './Form'

function Login() {
  return (
    <div>
      <div className='container max-w-6xl mx-auto flex '>
        <div id='left-section'>
          <img src="/images/login.webp" alt="" />
        </div>
        <div id='right-section' className='w-[60%] p-4'>
          <div className='flex flex-col items-center w-full'>
            <div className="top-section w-full text-center">
              <div className="border-gray-300 p-4 gap-2">
                <div className="heading">
                  <h1 className='text-gray-900 font-black'>Welcome Back!</h1>
                  <h2 className="text-gray-500">Please log in to your account</h2>
                </div>
              </div>
              <div id="alt-auth" className="flex gap-2 justify-center">
                <div className="wrapper shadow border border-gray-300 p-2 h-fit rounded-lg">
                  <img src="/icons/google.png" alt="google-icon" className='h-8 w-8' />
                </div>
                <div className="wrapper shadow border border-gray-300 p-2 h-fit rounded-lg">
                  <img src="/icons/apple.png" alt="apple-icon" className='h-8 w-8' />

                </div>
                <div className="wrapper shadow border border-gray-300 p-2 h-fit rounded-lg">
                  <img src="/icons/fb.png" alt="fb-icon" className='h-8 w-8' />
                </div>
              </div>
            </div>
            <div className="flex items-center my-4 w-full">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
          <div className="bottom-section w-full">
           <Form />
           <div className='mt-2 text-center'>
            <span className='text-gray-5000'>Don't have an accoutn? </span><span className='text-[#1e90ff]'>Sign up</span>
           </div>
          </div>
        </div>
      </div>
    </div>
    </div >
  )
}

export default Login
