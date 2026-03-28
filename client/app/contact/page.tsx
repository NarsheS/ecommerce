import React from 'react'

const page = () => {
  return (
    <div className="w-full min-h-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        <h1 className="text-4xl font-bold text-center">
          Contato
        </h1>

        {/* SEÇÃO 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 lg:gap-24">

          <img
            src="https://picsum.photos/500/300?random=10"
            alt="contato"
            className="rounded-lg w-full md:w-[55%] lg:w-[40%] object-cover"
          />

          <div className="space-y-4 max-w-md md:max-w-sm lg:max-w-md">
            <h2 className="text-2xl font-semibold">
              Fale conosco
            </h2>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="text-sm space-y-1">
              <p><strong>Email:</strong> contato@empresa.com</p>
              <p><strong>Telefone:</strong> (31) 99999-9999</p>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20 lg:gap-24">

          <img
            src="https://picsum.photos/500/300?random=11"
            alt="suporte"
            className="rounded-lg w-full md:w-[55%] lg:w-[40%] object-cover"
          />

          <div className="space-y-4 max-w-md md:max-w-sm lg:max-w-md">
            <h2 className="text-2xl font-semibold">
              Suporte ao cliente
            </h2>
            <p className="text-muted-foreground">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco 
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="text-sm space-y-1">
              <p><strong>Horário:</strong> Seg - Sex, 08:00 às 18:00</p>
              <p><strong>Chat:</strong> Disponível via Whatsapp</p>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3 */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 lg:gap-24">

          <img
            src="https://picsum.photos/500/300?random=12"
            alt="localizacao"
            className="rounded-lg w-full md:w-[55%] lg:w-[40%] object-cover"
          />

          <div className="space-y-4 max-w-md md:max-w-sm lg:max-w-md">
            <h2 className="text-2xl font-semibold">
              Nossa localização
            </h2>
            <p className="text-muted-foreground">
              Duis aute irure dolor in reprehenderit in voluptate velit esse 
              cillum dolore eu fugiat nulla pariatur.
            </p>

            <div className="text-sm space-y-1">
              <p><strong>Endereço:</strong> Rua Exemplo, 123</p>
              <p><strong>Cidade:</strong> Ipatinga - MG</p>
              <p><strong>CEP:</strong> 35160-000</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default page