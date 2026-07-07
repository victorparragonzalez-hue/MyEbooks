"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Libro {
  id_lectura: string; 
  id_libro_global: string; 
  titulo: string;
  autor: string;
  estrellas: number;
  portada: string;
  comentario: string;
  estado: string; 
}

export default function DashboardPage() {
  const router = useRouter();
  
  const [usuarioActual, setUsuarioActual] = useState<any>(null);
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [libros, setLibros] = useState<Libro[]>([]); 

  const [seccionActiva, setSeccionActiva] = useState<"Leído" | "Pendiente">("Leído");

  const cargarBiblioteca = useCallback(async (id_usuario: string) => {
    try {
      const respuesta = await fetch(`https://myebooks-ka5x.onrender.com/${id_usuario}`);
      if (!respuesta.ok) throw new Error("Fallo al cargar la biblioteca");
      
      const datos = await respuesta.json();
      
      const librosFormateados: Libro[] = datos.map((item: any) => ({
        id_lectura: item.id_lectura,
        id_libro_global: item.detalles_libro.id_libro,
        titulo: item.detalles_libro.titulo,
        autor: item.detalles_libro.autor,
        estrellas: item.puntuacion || 0,
        portada: item.detalles_libro.imagen_portada || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
        comentario: item.resena || "",
        estado: item.estado, 
      }));

      setLibros(librosFormateados);
    } catch (error) {
      console.error("Error cargando libros:", error);
    }
  }, []);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const usuarioObj = JSON.parse(usuarioGuardado);
      setUsuarioActual(usuarioObj);
      cargarBiblioteca(usuarioObj.id_usuario);
    } else {
      router.push("/login");
    }
  }, [router, cargarBiblioteca]);

  // ==========================================
  // NUEVA FUNCIÓN: CERRAR SESIÓN
  // ==========================================
  const cerrarSesion = () => {
    const confirmar = window.confirm("¿Seguro que deseas cerrar tu sesión?");
    if (!confirmar) return;

    // 1. Limpiar el almacenamiento local (borra la identidad del usuario)
    localStorage.removeItem("usuario");
    
    // 2. Redirigir al inicio de sesión
    router.push("/login");
  };

  const [modalAbierto, setModalAbierto] = useState(false);
  const [libroActivo, setLibroActivo] = useState<Libro | null>(null);
  const [textoComentario, setTextoComentario] = useState("");
  
  const [modalBuscadorAbierto, setModalBuscadorAbierto] = useState(false);
  const [queryBusqueda, setQueryBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const eliminarLibroDeBiblioteca = async (idLectura: string) => {
    const confirmar = window.confirm("¿Deseas remover este libro de tu cuenta?");
    if (!confirmar) return;

    try {
      const respuesta = await fetch(`https://myebooks-ka5x.onrender.com/lecturas/${idLectura}`, { method: "DELETE" });
      if (!respuesta.ok) throw new Error("No se pudo eliminar el registro.");
      setLibros(libros.filter(libro => libro.id_lectura !== idLectura));
    } catch (error) {
      alert("Hubo un error al intentar quitar el libro.");
    }
  };

  const marcarComoLeido = async (idLectura: string) => {
    setLibros(libros.map(libro => 
      libro.id_lectura === idLectura ? { ...libro, estado: "Leído" } : libro
    ));

    try {
      await fetch(`https://myebooks-ka5x.onrender.com/lecturas/${idLectura}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Leído" })
      });
    } catch (error) {
      console.error("Error al actualizar el estado del libro", error);
    }
  };

  const actualizarEstrellas = async (idLectura: string, nuevaValoracion: number) => {
    setLibros(libros.map(libro => 
      libro.id_lectura === idLectura ? { ...libro, estrellas: nuevaValoracion } : libro
    ));

    try {
      await fetch(`https://myebooks-ka5x.onrender.com/lecturas/${idLectura}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puntuacion: nuevaValoracion })
      });
    } catch (error) {}
  };

  const abrirModal = (libro: Libro) => {
    setLibroActivo(libro);
    setTextoComentario(libro.comentario);
    setModalAbierto(true);
  };

  const guardarComentario = async () => {
    if (!libroActivo) return;

    setLibros(libros.map(libro => 
      libro.id_lectura === libroActivo.id_lectura ? { ...libro, comentario: textoComentario } : libro
    ));
    setModalAbierto(false);

    try {
      await fetch(`https://myebooks-ka5x.onrender.com/lecturas/${libroActivo.id_lectura}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resena: textoComentario })
      });
    } catch (error) {}
    
    setLibroActivo(null);
  };

  const buscarEnBackend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryBusqueda.trim()) return;

    setBuscando(true);
    setErrorBusqueda("");

    try {
      const respuesta = await fetch(`https://myebooks-ka5x.onrender.com/libros/buscar?q=${encodeURIComponent(queryBusqueda)}`);
      if (!respuesta.ok) throw new Error("Fallo");
      const datos = await respuesta.json();
      setResultadosBusqueda(datos);
    } catch (error) {
      setErrorBusqueda("No se encontraron resultados.");
      setResultadosBusqueda([]);
    } finally {
      setBuscando(false);
    }
  };

  const guardarLibroEnBackend = async (libroSeleccionado: any) => {
    if (!usuarioActual) return;

    try {
      const payload = {
        id_usuario: usuarioActual.id_usuario,
        google_books_id: libroSeleccionado.google_books_id,
        titulo: libroSeleccionado.titulo,
        autor: libroSeleccionado.autor,
        sinopsis: libroSeleccionado.sinopsis || "Sin sinopsis",
        imagen_portada: libroSeleccionado.imagen_portada || null,
        estado: seccionActiva, 
        puntuacion: 0,
        resena: ""
      };

      const respuesta = await fetch("https://myebooks-ka5x.onrender.com/lecturas/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) throw new Error("Error al guardar el libro.");

      cargarBiblioteca(usuarioActual.id_usuario);
      setModalBuscadorAbierto(false);
      setQueryBusqueda("");
      setResultadosBusqueda([]);

    } catch (error: any) {
      setErrorBusqueda("El libro ya existe en esta colección."); 
    }
  };

  const librosMostrar = libros.filter(libro => libro.estado === seccionActiva);

  return (
    <div className="flex h-screen bg-[#0a0806] overflow-hidden font-sans text-[#f5f1e8]">
      
      {/* FONDO */}
      <div className="fixed inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/libreriaa.jpg')" }} />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0a0806]/80 via-[#0a0806]/95 to-[#0a0806]" />

      {/* MENÚ LATERAL */}
      <aside className={`relative z-20 flex flex-col bg-[#0f0c09]/90 backdrop-blur-2xl border-r border-[#d4b483]/20 transition-all duration-300 ease-in-out ${menuAbierto ? "w-64" : "w-20"}`}>
        <div className="flex items-center justify-between p-5 border-b border-[#d4b483]/10">
          {menuAbierto && (
            <div className="flex items-center gap-2 overflow-hidden">
              <svg className="w-8 h-8 text-[#d4b483]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="font-serif text-xl tracking-wide text-[#f5f1e8] whitespace-nowrap">MyEbooks</span>
            </div>
          )}
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="p-2 rounded-lg hover:bg-[#d4b483]/10 text-[#d4b483]/70 hover:text-[#d4b483] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
          </button>
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
          <button 
            onClick={() => setSeccionActiva("Leído")}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all overflow-hidden group ${seccionActiva === "Leído" ? "bg-[#d4b483]/10 border border-[#d4b483]/30 text-[#d4b483]" : "hover:bg-[#d4b483]/5 text-[#f5f1e8]/50 hover:text-[#f5f1e8]"}`}
          >
            <svg className={`w-6 h-6 flex-shrink-0 ${seccionActiva === "Leído" ? "text-[#d4b483]" : "group-hover:text-[#d4b483]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            {menuAbierto && <span className="text-sm font-medium tracking-wide whitespace-nowrap">Biblioteca</span>}
          </button>

          <button 
            onClick={() => setSeccionActiva("Pendiente")}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all overflow-hidden group ${seccionActiva === "Pendiente" ? "bg-[#d4b483]/10 border border-[#d4b483]/30 text-[#d4b483]" : "hover:bg-[#d4b483]/5 text-[#f5f1e8]/50 hover:text-[#f5f1e8]"}`}
          >
            <svg className={`w-6 h-6 flex-shrink-0 ${seccionActiva === "Pendiente" ? "text-[#d4b483]" : "group-hover:text-[#d4b483]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
            {menuAbierto && <span className="text-sm font-medium tracking-wide whitespace-nowrap">Libros Pendientes</span>}
          </button>
        </nav>

        {/* ZONA INFERIOR: CERRAR SESIÓN */}
        <div className="p-3 border-t border-[#d4b483]/10 mt-auto">
          <button 
            onClick={cerrarSesion}
            className="flex items-center gap-4 p-3 w-full rounded-xl hover:bg-red-500/10 text-[#f5f1e8]/50 hover:text-red-400 transition-all overflow-hidden group"
          >
            <svg className="w-6 h-6 flex-shrink-0 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {menuAbierto && <span className="text-sm font-medium tracking-wide whitespace-nowrap">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8 md:p-12">
        
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-serif tracking-wide text-[#f5f1e8] mb-2">
              {seccionActiva === "Leído" ? "Mi Biblioteca" : "Lecturas Pendientes"}
            </h2>
            <p className="text-xs tracking-[0.2em] text-[#d4b483]/70 uppercase">
              {seccionActiva === "Leído" ? "Colección de lecturas completadas" : "Libros que esperan ser descubiertos"}
            </p>
          </div>
          {/* Opcional: Mostrar nombre del usuario logueado arriba a la derecha */}
          {usuarioActual && (
            <div className="hidden md:flex items-center gap-3 bg-[#0a0806]/60 backdrop-blur-md border border-[#d4b483]/20 py-2 px-4 rounded-full">
              <div className="w-6 h-6 rounded-full bg-[#d4b483]/20 flex items-center justify-center text-[#d4b483] text-xs font-bold uppercase">
                {usuarioActual.nombre.charAt(0)}
              </div>
              <span className="text-sm font-medium text-[#f5f1e8]/80">{usuarioActual.nombre}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {librosMostrar.map((libro) => (
            <div key={libro.id_lectura} className="group relative bg-[#0f0c09]/60 backdrop-blur-md border border-[#d4b483]/15 rounded-2xl overflow-hidden hover:border-[#d4b483]/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(212,180,131,0.1)] flex flex-col h-full animate-in zoom-in-95 duration-300">
              
              <button
                onClick={() => eliminarLibroDeBiblioteca(libro.id_lectura)}
                className="absolute top-1 right-1 z-30 p-1.5 rounded-full bg-[#0a0806]/80 backdrop-blur-md text-[#f5f1e8]/30 hover:text-black border border-[#d4b483]/10 hover:border-red-500/40 scale-90 hover:scale-110 transition-all duration-300 md:opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                title="Quitar libro"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative h-64 w-full overflow-hidden">
                <img src={libro.portada} alt={`Portada de ${libro.titulo}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c09] via-transparent to-transparent" />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-serif text-lg text-[#f5f1e8] leading-tight mb-1 line-clamp-2">{libro.titulo}</h3>
                <p className="text-xs text-[#f5f1e8]/50 mb-4 line-clamp-1">{libro.autor}</p>

                {seccionActiva === "Leído" ? (
                  <>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <button key={valor} onClick={() => actualizarEstrellas(libro.id_lectura, valor)} className="focus:outline-none transform hover:scale-125 transition-transform duration-200">
                          <svg className={`w-5 h-5 transition-colors duration-300 ${valor <= libro.estrellas ? "text-[#d4b483]" : "text-[#d4b483]/20 hover:text-[#d4b483]/60"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        </button>
                      ))}
                    </div>

                    {libro.comentario && <p className="text-xs text-[#f5f1e8]/70 italic mb-4 line-clamp-2">"{libro.comentario}"</p>}

                    <button onClick={() => abrirModal(libro)} className="mt-auto w-full py-2.5 bg-[#d4b483]/10 border border-[#d4b483]/30 rounded-lg text-[#d4b483] text-xs font-medium uppercase tracking-wider hover:bg-[#d4b483] hover:text-[#0a0806] transition-all flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                      {libro.comentario ? "Editar Opinión" : "Escribir Opinión"}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => marcarComoLeido(libro.id_lectura)} 
                      className="mt-auto w-full py-2.5 bg-[#d4b483]/10 border border-[#d4b483]/30 rounded-lg text-[#d4b483] text-xs font-bold uppercase tracking-wider hover:bg-[#d4b483] hover:text-[#0a0806] transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      Añadir a Leídos
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          <button onClick={() => setModalBuscadorAbierto(true)} className="group flex flex-col items-center justify-center h-full min-h-[350px] bg-[#d4b483]/5 border-2 border-dashed border-[#d4b483]/20 rounded-2xl hover:bg-[#d4b483]/10 hover:border-[#d4b483]/50 transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-[#d4b483]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-[#d4b483]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </div>
            <span className="text-sm font-medium tracking-widest text-[#d4b483]/70 uppercase group-hover:text-[#d4b483]">
              Añadir {seccionActiva === "Leído" ? "Lectura" : "Pendiente"}
            </span>
          </button>
        </div>
      </main>

      {/* ==========================================
          MODALES
          ========================================== */}
      {modalAbierto && libroActivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-[#14110e] border border-[#d4b483]/30 rounded-2xl p-6 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-serif text-[#d4b483] mb-1">Opinión de lectura</h3>
            <p className="text-sm text-[#f5f1e8]/60 mb-5">{libroActivo.titulo}</p>
            <textarea value={textoComentario} onChange={(e) => setTextoComentario(e.target.value)} placeholder="Escribe tus reflexiones..." className="w-full h-40 p-4 bg-[#0a0806] border border-[#d4b483]/20 rounded-xl text-[#f5f1e8] text-sm resize-none focus:outline-none focus:border-[#d4b483]/60 transition-colors" />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModalAbierto(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#f5f1e8]/60 hover:bg-white/5 transition-colors">Cancelar</button>
              <button onClick={guardarComentario} className="px-6 py-2.5 bg-[#d4b483] text-[#0a0806] rounded-lg text-sm font-bold tracking-wide hover:bg-[#dfc299] transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {modalBuscadorAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity">
          <div className="bg-[#14110e] border border-[#d4b483]/30 rounded-3xl p-8 w-full max-w-2xl shadow-[0_30px_100px_rgba(0,0,0,0.9)] flex flex-col h-[80vh] max-h-[800px] animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-serif text-[#d4b483] mb-1">Buscar Nuevo Libro</h3>
                <p className="text-xs tracking-widest text-[#f5f1e8]/50 uppercase">Añadiendo a: {seccionActiva === "Leído" ? "Mi Biblioteca" : "Lecturas Pendientes"}</p>
              </div>
              <button onClick={() => { setModalBuscadorAbierto(false); setErrorBusqueda(""); }} className="text-[#f5f1e8]/40 hover:text-[#f5f1e8] transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={buscarEnBackend} className="relative mb-6">
              <input type="text" value={queryBusqueda} onChange={(e) => setQueryBusqueda(e.target.value)} placeholder="Título, autor..." className="w-full bg-[#0a0806] border border-[#d4b483]/30 rounded-xl py-4 pl-5 pr-14 text-[#f5f1e8] focus:outline-none focus:border-[#d4b483] transition-colors" autoFocus />
              <button type="submit" disabled={buscando} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#d4b483]/10 text-[#d4b483] rounded-lg hover:bg-[#d4b483] transition-colors disabled:opacity-50">
                {buscando ? <span className="animate-spin text-[#d4b483]">Cargando...</span> : "Buscar"}
              </button>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {errorBusqueda && <p className="text-center text-red-400 mt-10 bg-red-900/10 py-3 rounded-xl border border-red-900/30">{errorBusqueda}</p>}
              {resultadosBusqueda.length === 0 && !buscando && queryBusqueda && !errorBusqueda && <p className="text-center text-[#f5f1e8]/40 mt-10">No se encontraron resultados.</p>}
              
              {resultadosBusqueda.map((item) => (
                <div key={item.google_books_id} className="flex gap-4 p-4 bg-[#0a0806]/50 border border-[#d4b483]/10 rounded-xl hover:border-[#d4b483]/40 transition-colors group">
                  <div className="w-16 h-24 bg-[#14110e] rounded overflow-hidden flex-shrink-0">
                    {item.imagen_portada && <img src={item.imagen_portada} alt={item.titulo} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-[#f5f1e8]">{item.titulo}</h4>
                    <p className="text-xs text-[#d4b483]/70">{item.autor}</p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => guardarLibroEnBackend(item)} className="px-4 py-2 bg-[#d4b483]/10 text-[#d4b483] border border-[#d4b483]/30 rounded-lg text-xs font-bold uppercase hover:bg-[#d4b483] hover:text-[#0a0806] transition-colors">
                      Añadir a {seccionActiva}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}