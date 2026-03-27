import React from 'react'

const page = () => {
  return (
    <div className="w-full min-h-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-4xl font-bold text-center">
          Nossa História
        </h1>

        {/* SEÇÃO 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 lg:gap-24 mt-15">
          <img
            src="https://picsum.photos/500/300?random=1"
            alt="historia"
            className="rounded-lg w-full md:w-[55%] lg:w-[40%] object-cover"
          />

          <div className="space-y-4 max-w-md md:max-w-lg">
            <h2 className="text-2xl font-semibold">
              Como tudo começou
            </h2>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Vestibulum euismod, nisi vel consectetur interdum, nisl nisi 
              aliquet nunc, vitae egestas nunc nisl sit amet lorem. 
              Suspendisse potenti. Integer at lorem ut lacus suscipit 
              tincidunt non a odio.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Vestibulum euismod, nisi vel consectetur interdum, nisl nisi 
              aliquet nunc, vitae egestas nunc nisl sit amet lorem. 
              Suspendisse potenti. Integer at lorem ut lacus suscipit 
              tincidunt non a odio.
            </p>
          </div>
        </div>

        {/* SEÇÃO 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20 lg:gap-24 mt-15">
          <img
            src="https://picsum.photos/500/300?random=2"
            alt="crescimento"
            className="rounded-lg w-full md:w-[55%] lg:w-[40%] object-cover"
          />

          <div className="space-y-4 max-w-md md:max-w-lg">
            <h2 className="text-2xl font-semibold">
              Nosso crescimento
            </h2>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Vestibulum euismod, nisi vel consectetur interdum, nisl nisi 
              aliquet nunc, vitae egestas nunc nisl sit amet lorem. 
              Suspendisse potenti. Integer at lorem ut lacus suscipit 
              tincidunt non a odio.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Vestibulum euismod, nisi vel consectetur interdum, nisl nisi 
              aliquet nunc, vitae egestas nunc nisl sit amet lorem. 
              Suspendisse potenti. Integer at lorem ut lacus suscipit 
              tincidunt non a odio.
            </p>
          </div>
        </div>

        {/* SEÇÃO 3 */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 lg:gap-24 mt-15">
          <img
            src="https://picsum.photos/500/300?random=3"
            alt="futuro"
            className="rounded-lg w-full md:w-[55%] lg:w-[40%] object-cover"
          />

          <div className="space-y-4 max-w-md md:max-w-lg">
            <h2 className="text-2xl font-semibold">
              Nosso futuro
            </h2>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Vestibulum euismod, nisi vel consectetur interdum, nisl nisi 
              aliquet nunc, vitae egestas nunc nisl sit amet lorem. 
              Suspendisse potenti. Integer at lorem ut lacus suscipit 
              tincidunt non a odio.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Vestibulum euismod, nisi vel consectetur interdum, nisl nisi 
              aliquet nunc, vitae egestas nunc nisl sit amet lorem. 
              Suspendisse potenti. Integer at lorem ut lacus suscipit 
              tincidunt non a odio.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page