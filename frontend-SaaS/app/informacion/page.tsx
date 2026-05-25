import Image from "next/image";

export default function InformacionPage() {
  return (
    <div className="min-h-screen bg-[#904939] flex items-center justify-center p-4">
      {/* Contenedor principal con el fondo café oscuro */}
      <div className="w-full max-w-5xl bg-[#66260B] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* --- COLUMNA IZQUIERDA: Beneficios --- */}
        <div className="relative w-full md:w-1/2 p-8 md:p-12">
          {/* Imagen de fondo con opacidad */}
          <div className="absolute inset-0 z-0">
             <Image 
                src="/images/panes.png" 
                alt="Panes"
                fill
                className="object-cover opacity-30"
             />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-serif font-bold text-white mb-8">
              Beneficios
            </h1>
            <ul className="text-white text-lg space-y-4 font-medium">
              <li className="flex items-start">• <span className="ml-2">Reduce desperdicios y pérdidas.</span></li>
              <li className="flex items-start">• <span className="ml-2">Mejora la organización del negocio.</span></li>
              <li className="flex items-start">• <span className="ml-2">Evita faltantes de ingredientes.</span></li>
              <li className="flex items-start">• <span className="ml-2">Optimiza compras y producción.</span></li>
              <li className="flex items-start">• <span className="ml-2">Centraliza pedidos, ventas e inventario en un solo lugar.</span></li>
              <li className="flex items-start">• <span className="ml-2">Ahorra tiempo en procesos administrativos.</span></li>
            </ul>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: Registro (Color #CC8034) --- */}
        <div className="w-full md:w-1/2 bg-[#C1583B] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-4">Registro</h2>
          <p className="text-white text-sm mb-8 leading-tight">
            ¡Optimiza tu panadería! Regístrate para que nos pongamos en contacto contigo
          </p>

          <form className="space-y-6">
            {/* Inputs con el color de fondo específico del formulario */}
            <div className="space-y-1">
              <label className="block text-white text-sm font-semibold">Nombre:</label>
              <input type="text" className="w-full h-12 bg-[#D49880] rounded-2xl px-4 outline-none text-[#66260B] font-medium" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-white text-sm font-semibold">Correo electrónico:</label>
              <input type="email" className="w-full h-12 bg-[#D49880] rounded-2xl px-4 outline-none text-[#66260B] font-medium" />
            </div>
            
            <div className="space-y-1">
              <label className="block text-white text-sm font-semibold">¿Qué problema quieres resolver?</label>
              <input type="text" className="w-full h-12 bg-[#D49880] rounded-2xl px-4 outline-none text-[#66260B] font-medium" />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-[#66260B] text-white font-bold py-3 rounded-full shadow-lg transition-transform hover:scale-[1.02]"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}