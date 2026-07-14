import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
   <main className="relative min-h-screen flex flex-col items-center p-4 bg-[#0a0806] overflow-x-hidden font-sans">
      
      {/* Fondo de la Biblioteca */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/fondo_principal.jpg')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0806]/40 via-[#0a0806]/80 to-[#0a0806]" />
        
        {/* CABECERA: Botonera liberada para llegar al extremo derecho */}
        <header style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px',
          padding: '20px 20px 0 0' 
        }}>
          <Link 
            href="/login" 
            style={{ 
              backgroundColor: '#d4b483', 
              color: '#14110f', 
              padding: '12px 28px', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(212, 180, 131, 0.2)',
              transition: 'opacity 0.2s'
            }}
          >
            Iniciar Sesión
          </Link>
          
          <Link 
            href="/registro" 
            style={{ 
              backgroundColor: 'transparent', 
              color: '#d4b483', 
              border: '2px solid #d4b483',
              padding: '10px 26px', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
          >
            Crear una cuenta
          </Link>
        </header>

        {/* CONTENEDOR CENTRAL: Título, Explicación e Imágenes */}
        <div style={{ 
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px', 
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '50px',
          marginTop: '20px' 
        }}>
          
          {/* SECCIÓN 1: Título y Explicación */}
          <div>
            <h1 style={{ 
              color: '#d4b483', 
              fontSize: '3.5rem', 
              margin: '0 0 20px 0', 
              fontFamily: 'serif',
              letterSpacing: '2px'
            }}>
              MyEbooks
            </h1>
            
            <div style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8', 
              color: '#f5f1e8',
              maxWidth: '750px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <p>
                MyEbooks es un proyecto personal cuyo objetivo es ofrecer una biblioteca digital para los amantes de la lectura.
              </p>
              <p>
                Con esta aplicación web, podrás organizar tus libros pendientes y llevar un registro de todas tus lecturas completadas. Además, tendrás la posibilidad de puntuarlas y añadir comentarios personales, como frases que te hayan impactado o reflexiones que quieras recordar.
              </p>
              <p>
                Todo ello en un entorno seguro y privado, donde tus datos y preferencias estarán protegidos. No esperes más y comienza a disfrutar de tu biblioteca digital hoy mismo.
              </p>
            </div>
          </div>

          {/* SECCIÓN 2: Las 3 Imágenes en Pirámide (TAMAÑO IDÉNTICO) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            marginBottom: '40px' 
          }}>
            
            {/* IMAGEN 1: Buscador */}
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <h3 style={{ color: 'rgba(212, 180, 131, 0.9)', fontSize: '1.1rem', marginBottom: '12px' }}>
                Encuentra cualquier obra
              </h3>
              <div style={{ 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(212, 180, 131, 0.15)'
              }}>
                <Image 
                  src="/buscador.jpg" 
                  alt="Buscador de libros" 
                  width={1000} 
                  height={650} 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>

            {/* IMÁGENES 2 y 3 (Base): Pendientes y Leídos */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '30px',
              justifyContent: 'center',
              width: '100%'
            }}>
              
              {/* Imagen Izquierda */}
              <div style={{ flex: '1 1 300px', maxWidth: '500px' }}>
                <h3 style={{ color: 'rgba(212, 180, 131, 0.9)', fontSize: '1.1rem', marginBottom: '12px' }}>
                  Tus lecturas pendientes
                </h3>
                <div style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <Image 
                    src="/pendientes.jpg" 
                    alt="Vista de libros pendientes" 
                    width={1000} 
                    height={650} 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>

              {/* Imagen Derecha */}
              <div style={{ flex: '1 1 300px', maxWidth: '500px' }}>
                <h3 style={{ color: 'rgba(212, 180, 131, 0.9)', fontSize: '1.1rem', marginBottom: '12px' }}>
                  Tu historial de leídos
                </h3>
                <div style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <Image 
                    src="/leidos.jpg" 
                    alt="Vista de libros leídos" 
                    width={1000} 
                    height={650} 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>

            </div>
          </div>
          
        </div>
    </main>
  );
}