from fastapi import APIRouter, Depends, HTTPException, Query, status # <-- Añadido 'status'
from sqlalchemy.orm import Session # <-- ESTA ES LA LÍNEA QUE FALTABA
import httpx
import os
from dotenv import load_dotenv
from app import models, schemas
from app.database import get_db
# Cargar las variables del archivo .env
load_dotenv()

router = APIRouter(
    prefix="/libros",
    tags=["Catálogo de Libros"]
)

@router.get("/buscar")
async def buscar_libros_en_google(q: str = Query(min_length=2, description="Título o autor a buscar")):
    """
    Se conecta a la API de Google Books utilizando una clave de seguridad, 
    busca coincidencias y devuelve una lista limpia.
    """
    google_url = "https://www.googleapis.com/books/v1/volumes"
    api_key = os.getenv("API_KEY")

    if not api_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="La API Key de Google no está configurada en el servidor.")

    async with httpx.AsyncClient(timeout=20.0, verify=False) as client:
        try:
            response = await client.get(
                google_url,
                params={
                    "q": f"intitle:{q}",
                    "maxResults": 10,
                    "key": api_key 
                },
                headers={"User-Agent": "MyEbooksPortfolioApp/1.0"}
            )
            response.raise_for_status() 
            
        except httpx.TimeoutException:
            raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Google Books tardó demasiado en responder.")
        except httpx.HTTPError as e:
            print("ERROR INTERNO HTTPX: Falló la conexión con Google Books. (URL y credenciales ocultas por seguridad).")
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Error al comunicarse con Google Books.")

    data = response.json()
    
    if "items" not in data:
        return []

    libros_procesados = []
    
    for item in data["items"]:
        info = item.get("volumeInfo", {})
        
        libro_limpio = {
            "google_books_id": item.get("id"),
            "titulo": info.get("title", "Título desconocido"),
            "autor": ", ".join(info.get("authors", ["Autor desconocido"])),
            "sinopsis": info.get("description", "Sin sinopsis disponible."),
            "imagen_portada": info.get("imageLinks", {}).get("thumbnail", None)
        }
        
        libros_procesados.append(libro_limpio)

    return libros_procesados

@router.post("/guardar", response_model=schemas.LibroOut, status_code=status.HTTP_201_CREATED)
def guardar_libro(libro: schemas.LibroCreate, db: Session = Depends(get_db)):
    """
    Recibe los datos de un libro (obtenidos de Google Books) y los guarda 
    en la base de datos local. Si ya existe, simplemente lo devuelve.
    """
    libro_existente = db.query(models.Libro).filter(models.Libro.google_books_id == libro.google_books_id).first()
    
    if libro_existente:
        # En lugar de lanzar un error 400, devolvemos el libro existente
        # para que pueda ser enlazado al usuario en el siguiente paso.
        return libro_existente

    nuevo_libro = models.Libro(
        google_books_id=libro.google_books_id,
        titulo=libro.titulo,
        autor=libro.autor,
        sinopsis=libro.sinopsis,
        imagen_portada=str(libro.imagen_portada) if libro.imagen_portada else None
    )

    db.add(nuevo_libro)
    db.commit()
    db.refresh(nuevo_libro)

    return nuevo_libro
