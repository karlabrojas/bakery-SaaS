import Image from "next/image";

export default function LandingPage() {
  return (
    <section className=" px-6 py-10 md:py-14 rounded-2xl">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
    
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-5">
            Mejora la gestión<br />de tu negocio
          </h2>

            <p className="text-[#5C3D2E] text-sm leading-relaxed mb-8 mt-6 max-w-sm">
                Conoce Bakesaas un sistema inteligente que te permite gestionar 
                de manera sencilla y rápida tu negocio.
            </p>

            <a
                href="/informacion"
                className="inline-block bg-[#C97B4B] hover:bg-[#A85E35] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors duration-200"
            >
            Quiero saber más...
            </a>
        </div>

        <div className="w-72 h-64 md:w-96 md:h-72 rounded-2xl overflow-hidden">
            <Image
                src="/images/landingPageImage.png"
                alt="imagen panaderia"
                width={400}
                height={300}
                className="w-full h-full object-cover"
            />
        </div>

      </div>
    </section>
  );
}