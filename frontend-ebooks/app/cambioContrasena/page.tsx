"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OlvidePasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch("https://myebooks-ka5x.onrender.com/usuarios/olvide-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const textoRespuesta = await respuesta.text();
      let datos: any = {};
      try {
        datos = textoRespuesta ? JSON.parse(textoRespuesta) : {};
      } catch (parseError) {
        console.error("Respuesta no JSON:", textoRespuesta);
      }

      if (!respuesta.ok) {
        // AQUÍ ESTÁ LA MAGIA: Si el servidor devuelve un 404 (No encontrado), forzamos un mensaje conciso
        if (respuesta.status === 404) {
          throw new Error("No existe ninguna cuenta asociada a este correo.");
        }
        
        const mensajeError = typeof datos.detail === 'string' 
          ? datos.detail 
          : "Hubo un problema al procesar la solicitud.";
        throw new Error(mensajeError);
      } 

      // Si todo va bien, el mensaje ahora es directo y afirmativo
      setMensaje("Enlace de recuperación enviado. Revisa tu bandeja de entrada.");
      setEmail(""); 
      
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        setError("El servidor está desconectado. Verifica FastAPI.");
      } else {
        setError(err.message || "Error al conectar con el servidor.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#0a0806] overflow-hidden font-sans">
      
      {/* Fondo de la Biblioteca */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/libreriaa.jpg')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-ba from-[#0a0806]/40 via-[#0a0806]/80 to-[#0a0806]" />

      {/* Tarjeta Principal */}
      <div className="relative z-10 w-full max-w-[460px] bg-[#0f0c09]/80 backdrop-blur-xl border border-[#d4b483]/20 rounded-3xl p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
        
        {/* Cabecera */}
        <div className="flex flex-col items-center mb-8">
          <svg className="w-14 h-14 text-[#d4b483] mb-4 drop-shadow-[0_2px_10px_rgba(212,180,131,0.2)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h1 className="text-3xl font-serif text-[#f5f1e8] tracking-wide mb-3 text-center">
            Recuperar Acceso
          </h1>
          <p className="text-xs text-[#f5f1e8]/60 text-center leading-relaxed max-w-[85%]">
            Introduce el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarSolicitud} className="flex flex-col gap-6">
          
          {/* Input: Correo Electrónico */}
          <div>
            <label className="block text-[10px] text-[#d4b483]/90 tracking-widest uppercase mb-2 ml-1">
              Correo Electrónico
            </label>
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#d4b483]/50 group-focus-within:text-[#d4b483] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full bg-[#14110e]/80 border border-[#d4b483]/30 rounded-xl py-3.5 pl-12 pr-4 text-[#f5f1e8] text-[13px] outline-none placeholder:text-[#f5f1e8]/20 focus:border-[#d4b483]/80 transition-all focus:bg-[#1a1612]/90"
              />
            </div>
          </div>

          {/* Mensajes de Éxito y Error */}
          {error && (
            <div className="text-red-400/90 bg-red-950/30 border border-red-900/50 py-3 px-4 rounded-xl text-xs text-center animate-in fade-in duration-300">
              {error}
            </div>
          )}
          {mensaje && (
            <div className="text-emerald-400/90 bg-emerald-950/30 border border-emerald-900/50 py-3 px-4 rounded-xl text-xs text-center leading-relaxed animate-in fade-in duration-300">
              {mensaje}
            </div>
          )}

          {/* Botón Principal */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-2 bg-gradient-to-r from-[#dfc299] via-[#d4b483] to-[#c29b62] text-[#1a140d] font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {cargando ? "Enviando..." : "Enviar enlace de recuperación"}
            {!cargando && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            )}
          </button>
        </form>

        {/* Botón de Regreso */}
        <div className="mt-8 flex justify-center border-t border-[#d4b483]/10 pt-6">
          <button 
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-[12px] text-[#f5f1e8]/50 hover:text-[#d4b483] transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Volver al inicio de sesión
          </button>
        </div>

      </div>
    </main>
  );
}