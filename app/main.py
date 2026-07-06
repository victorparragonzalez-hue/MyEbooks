from fastapi import FastAPI
from app.api import rutas_usuario, rutas_libros, rutas_lecturas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MyEbooks API", version="1.0.0")

# ==========================================
# CONFIGURACIÓN DE CORS
# ==========================================
# Aquí se define qué direcciones web tienen permiso para hablar con esta API.
# Se añaden los puertos más comunes de desarrollo Frontend (React, Vue, Angular, etc.)
origenes_permitidos = [
    "http://localhost:3000",      # Puerto típico de React (Create React App)
    "http://localhost:5173",      # Puerto típico de Vite (Vue / React moderno)
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://172.31.128.1:3000"
]

# Se inyecta el "portero" en la aplicación
app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos, # Lista de invitados
    allow_credentials=True,            # Permite el envío de cookies/tokens de sesión
    allow_methods=["*"],               # Permite todos los métodos (GET, POST, PATCH, DELETE)
    allow_headers=["*"],               # Permite todos los encabezados
)


app.include_router(rutas_usuario.router)
app.include_router(rutas_libros.router)
app.include_router(rutas_lecturas.router)

@app.get("/")
def read_root():
    return {"mensaje": "El servidor de MyEbooks está funcionando correctamente"}