from fastapi import FastAPI
from app.api import rutas_usuario, rutas_libros, rutas_lecturas
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MyEbooks API", version="1.0.0")



# ==========================================
# CONFIGURACIÓN DE CORS
# ==========================================
# Aquí se define qué direcciones web tienen permiso para hablar con esta API.
origenes_permitidos = [
"http://localhost:3000",  # Permite pruebas desde el ordenador
"https://my-ebooks-zeta.vercel.app",
"https://myebooks.es",
"https://www.myebooks.es" 
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
