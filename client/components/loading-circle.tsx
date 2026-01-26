import React from 'react'

const LoadingCircle = () => {
  return (
    <div className="flex items-center justify-center align-center h-32">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-400 border-t-transparent"
        ></div>
    </div>
  )
}

export default LoadingCircle