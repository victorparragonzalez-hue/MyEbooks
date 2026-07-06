from datetime import datetime
from enum import Enum
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, HttpUrl, Field


class EstadoLectura(str, Enum):
    PENDIENTE = "Pendiente"
    LEIDO = "Leído"


PuntuacionLibro = Annotated[
    int,
    Field(
        ge=0,
        le=5,
        description="Puntuación del libro entre 0 y 5"
    )
]

ResenaLibro = Annotated[
    str,
    Field(
        max_length=2000,
        description="Reseña del libro"
    )
]


class MisLecturasBase(BaseModel):
    estado: EstadoLectura
    puntuacion: PuntuacionLibro | None = None
    resena: ResenaLibro | None = None


class MisLecturasCreate(MisLecturasBase):
    id_libro: UUID


class MisLecturasOut(MisLecturasBase):
    id_lectura: UUID
    id_usuario: UUID
    id_libro: UUID
    fecha_agregado: datetime

    model_config = ConfigDict(from_attributes=True)

class AgregarLecturaRequest(BaseModel):
    # Identificación básica
    id_usuario: UUID # El frontend enviará el ID obtenido en el Login
    google_books_id: str
    
    # Datos obligatorios del libro para el guardado automático
    titulo: str = Field(min_length=1, max_length=255)
    autor: str = Field(min_length=1, max_length=150)
    
    # Datos opcionales del libro
    sinopsis: str | None = None
    imagen_portada: HttpUrl | None = None
    
    # Datos de la experiencia de lectura
    estado: EstadoLectura 
    puntuacion: PuntuacionLibro | None = None
    resena: str | None = None

class LecturaUpdate(BaseModel):
    estado: EstadoLectura | None = None
    puntuacion: PuntuacionLibro | None = None
    resena: ResenaLibro | None = None