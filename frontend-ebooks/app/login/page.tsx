"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpia errores previos
    console.log("Se ha pulsado el botón Login");
    setCargando(true);

    try {
      const respuesta = await fetch("https://myebooks-ka5x.onrender.com/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const datos = await respuesta.json();

      // Si las credenciales son incorrectas o hay cualquier error (401, 404, 422)
      if (!respuesta.ok) {
        // Traductor seguro: extrae el texto exacto de FastAPI o usa un mensaje por defecto
        const mensajeError = typeof datos.detail === 'string' 
          ? datos.detail 
          : "Correo o contraseña incorrectos.";
        throw new Error(mensajeError);
      }

      // Si todo va bien, se guarda la credencial y se abre la puerta principal
      localStorage.setItem("usuario", JSON.stringify(datos.usuario));
      router.push("/principal"); // Redirección directa a la zona VIP de la biblioteca
      
    } catch (err: any) {
      // Si el servidor de Python está apagado, el navegador arroja "Failed to fetch"
      if (err.message === "Failed to fetch") {
        setError("El servidor está desconectado. Verifica FastAPI.");
      } else {
        // Se inyecta el mensaje de credenciales incorrectas en el recuadro rojo
        setError(err.message);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#0a0806] overflow-hidden font-sans">
      
      {/* 1. Fondo de la Biblioteca (Asegurar que la imagen existe en la carpeta public) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/libreriaa.jpg')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-ba from-[#0a0806]/40 via-[#0a0806]/80 to-[#0a0806]" />

      {/* 2. Tarjeta Principal (Glassmorphism oscuro con borde dorado sutil) */}
      <div className="relative z-10 w-full max-w-[460px] bg-[#0f0c09]/80 backdrop-blur-xl border border-[#d4b483]/20 rounded-3xl p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
        
        {/* Cabecera y Logotipo */}
        <div className="flex flex-col items-center mb-8">
          {/* Icono del Libro con Estrellas */}
         
         <svg 
            className="w-16 h-16 text-[#d4b483] mb-2 drop-shadow-[0_2px_10px_rgba(212,180,131,0.2)]" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Cubierta exterior (líneas más gruesas para simular la silueta oscura) */}
            <path d="M2 13L4 4c3 2 6 3 8 4 2-1 5-2 8-4l2 9c-1 4-6 6-10 7.5C8 19 3 17 2 13z" strokeWidth="2.5" />
            
            {/* Lomo central de la encuadernación */}
            <path d="M12 8v12.5" strokeWidth="2.5"/>
            
            {/* Páginas interiores en abanico (Lado Izquierdo) */}
            <path d="M12 10.5c-3-1-6-2-8-6" strokeWidth="1.5" />
            <path d="M12 13.5c-3-1-6-2-8-5" strokeWidth="1.5" />
            <path d="M12 16.5c-3-1-6.5-1.5-9-4" strokeWidth="1.5" />
            
            {/* Páginas interiores en abanico (Lado Derecho) */}
            <path d="M12 10.5c3-1 6-2 8-6" strokeWidth="1.5" />
            <path d="M12 13.5c3-1 6-2 8-5" strokeWidth="1.5" />
            <path d="M12 16.5c3-1 6.5-1.5 9-4" strokeWidth="1.5" />

            {/* Efecto 3D: Grosor del bloque de hojas en la base */}
            <path d="M12 18.5c-4.5-1.5-8-3-9.5-6" />
            <path d="M12 18.5c4.5-1.5 8-3 9.5-6" />

            {/* Remaches decorativos (Los 4 puntos de las esquinas) */}
            <circle cx="5.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="4.5" cy="12.5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="18.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
            <circle cx="19.5" cy="12.5" r="0.8" fill="currentColor" stroke="none" />
          </svg>

          <h1 className="text-4xl font-serif text-[#f5f1e8] tracking-wide mb-3">
            MyEbooks
          </h1>
          <p className=" font-semibold text-[10px] tracking-[0.35em] text-[#d4b483]/80 uppercase">
            Biblioteca Digital
          </p>

          {/* Divisor de Diamante */}
          <div className="flex items-center justify-center gap-3 mt-6 w-full">
            <div className="h-px bg-[#d4b483]/20 w-16" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#d4b483]/50" />
            <div className="h-px bg-[#d4b483]/20 w-16" />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarLogin} className="flex flex-col gap-6">
          
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

          {/* Input: Contraseña */}
          <div>
            <label className="block text-[10px] text-[#d4b483]/90 tracking-widest uppercase mb-2 ml-1">
              Contraseña
            </label>
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#d4b483]/50 group-focus-within:text-[#d4b483] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={mostrarPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#14110e]/80 border border-[#d4b483]/30 rounded-xl py-3.5 pl-12 pr-12 text-[#f5f1e8] text-[13px] outline-none placeholder:text-[#f5f1e8]/20 focus:border-[#d4b483]/80 transition-all focus:bg-[#1a1612]/90 tracking-widest"
              />
              {/* Botón de Ojo (Mostrar/Ocultar) */}
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4b483]/50 hover:text-[#d4b483] transition-colors focus:outline-none"
              >
                {mostrarPassword ? (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            
            {/* Olvidaste Contraseña alineado a la derecha */}
            <div className="flex justify-end mt-3">
              <button 
                type="button"
                onClick={() => router.push("/cambioContrasena")}
                className="text-[11px] text-[#d4b483]/80 underline underline-offset-4 decoration-[#d4b483]/30 hover:decoration-[#d4b483] hover:text-[#d4b483] cursor-pointer transition-all outline-none"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          {/* Mensaje de Error de la API */}
          {error && (
            <div className="text-red-400/90 bg-red-950/30 border border-red-900/50 py-2 px-3 rounded-lg text-xs text-center">
              {error}
            </div>
          )}

          {/* Botón Principal (Gradiente Dorado) */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full mt-2 bg-gradient-to-r from-[#dfc299] via-[#d4b483] to-[#c29b62] text-[#1a140d] font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {cargando ? "Accediendo..." : "Iniciar sesión"}
            {!cargando && (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </button>
        </form>

        {/* Divisor Inferior con Libro Pequeño */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px bg-[#d4b483]/10 w-full" />
          <svg className="w-5 h-5 text-[#d4b483]/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          <div className="h-px bg-[#d4b483]/10 w-full" />
        </div>

        {/* Pie de Página: Registro */}
        <div className="flex items-center justify-center gap-4">
          <span className="text-[12px] text-[#f5f1e8]/60">
            ¿No tienes una cuenta?
          </span>
          <button   onClick={() => router.push("/registro")}
            className="border border-[#d4b483]/30 text-[#d4b483]/90 text-[12px] px-5 py-2 rounded-lg hover:bg-[#d4b483]/10 hover:border-[#d4b483]/60 transition-colors"
          >
            Regístrate
          </button>
        </div>

      </div>
    </main>
  );
}