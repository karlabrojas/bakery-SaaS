import { Calendar, Clock, ClipboardList, FileText } from "lucide-react";

export default function SeccionInfo() {
    const cards = [
        { icon: <Calendar className="w-5 h-5 text-[#C97B4B]" />, titulo: "Registro digital de pedidos", descripcion: "Evita pedidos olvidados o incorrectos" },
        { icon: <Clock className="w-5 h-5 text-[#C97B4B]" />, titulo: "Planeación de producción", descripcion: "No desperdicies producto" },
        { icon: <ClipboardList className="w-5 h-5 text-[#C97B4B]" />, titulo: "Control de inventario", descripcion: "Que no te falte materia prima" },
        { icon: <FileText className="w-5 h-5 text-[#C97B4B]" />, titulo: "Reportes automáticos", descripcion: "Lleva una buena organización" },
    ]

  return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-5xl mx-auto px-9 ">
            {cards.map((f) => (
                <div key={f.titulo} className="flex items-center gap-3 bg-[#FCEEE4] border border-[#E8C4A8] rounded-xl p-6">
                <div className="w-10 h-10  flex items-center justify-center bg-[#F5E6D3] rounded-lg">
                    {f.icon}
                </div>
                <div>
                    <p className="text-sm font-bold text-[#3B2B1A]">{f.titulo}</p>
                    <p className="text-xs text-[#7A5040]">{f.descripcion}</p>
                </div>
                </div>
            ))}
        </div>
  )
}
