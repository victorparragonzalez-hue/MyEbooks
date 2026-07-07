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