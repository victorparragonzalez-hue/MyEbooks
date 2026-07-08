"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Se encapsula el formulario en un componente para poder usar Suspense (requerido por Next.js al leer parámetros de URL)
function FormularioRestablecer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Atrapa el token de la URL

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const manejarCambioPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!token) {
      setError("Enlace inválido o caducado. Vuelve a solicitar la recuperación.");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (nuevaPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch("https://myebooks-ka5x.onrender.com/usuarios/-olvide-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nueva_password: nuevaPassword }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.detail || "Error al actualizar la contraseña.");
      }

      setMensaje("¡Tu contraseña ha sido actualizada con éxito!");
      
      // Redirige al login tras 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarCambioPassword} className="flex flex-col gap-6">
      {!token && (
        <div className="text-red-400/90 bg-red-950/30 py-3 px-4 rounded-xl text-xs text-center mb-4">
          Falta el código de seguridad. Asegúrate de haber copiado el enlace completo de tu correo.
        </div>
      )}

      <div>
        <label className="block text-[10px] text-[#d4b483]/90 tracking-widest uppercase mb-2 ml-1">
          Nueva Contraseña
        </label>
        <div className="relative group">
          <input
            type={mostrarPassword ? "text" : "password"}
            required
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#14110e]/80 border border-[#d4b483]/30 rounded-xl py-3.5 px-4 text-[#f5f1e8] text-[13px] outline-none placeholder:text-[#f5f1e8]/20 focus:border-[#d4b483]/80 transition-all focus:bg-[#1a1612]/90 tracking-widest"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-[#d4b483]/90 tracking-widest uppercase mb-2 ml-1">
          Confirmar Contraseña
        </label>
        <div className="relative group">
          <input
            type={mostrarPassword ? "text" : "password"}
            required
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#14110e]/80 border border-[#d4b483]/30 rounded-xl py-3.5 px-4 text-[#f5f1e8] text-[13px] outline-none placeholder:text-[#f5f1e8]/20 focus:border-[#d4b483]/80 transition-all focus:bg-[#1a1612]/90 tracking-widest"
          />
        </div>
        <div className="flex justify-end mt-2">
          <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} className="text-[11px] text-[#d4b483]/60 hover:text-[#d4b483] transition-colors">
            {mostrarPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-400/90 bg-red-950/30 py-2 px-3 rounded-xl text-xs text-center">{error}</div>}
      {mensaje && <div className="text-emerald-400/90 bg-emerald-950/30 py-2 px-3 rounded-xl text-xs text-center">{mensaje} Redirigiendo...</div>}

      <button
        type="submit"
        disabled={cargando || !token}
        className="w-full mt-2 bg-gradient-to-r from-[#dfc299] via-[#d4b483] to-[#c29b62] text-[#1a140d] font-medium py-3.5 rounded-xl flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {cargando ? "Guardando..." : "Guardar Nueva Contraseña"}
      </button>
    </form>
  );
}

export default function RestablecerPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#0a0806] overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/libreriaa.jpg')" }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-ba from-[#0a0806]/40 via-[#0a0806]/80 to-[#0a0806]" />

      <div className="relative z-10 w-full max-w-[460px] bg-[#0f0c09]/80 backdrop-blur-xl border border-[#d4b483]/20 rounded-3xl p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-serif text-[#f5f1e8] tracking-wide mb-3 text-center">Crear Contraseña</h1>
          <p className="text-xs text-[#f5f1e8]/60 text-center">Ingresa tu nueva contraseña para acceder a tu biblioteca.</p>
        </div>
        
        <Suspense fallback={<div className="text-[#d4b483] text-center text-sm">Cargando sistema de seguridad...</div>}>
          <FormularioRestablecer />
        </Suspense>
      </div>
    </main>
  );
}