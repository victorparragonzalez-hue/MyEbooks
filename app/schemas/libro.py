from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


TituloLibro = Annotated[
    str,
    Field(
        min_length=1,
        max_length=255,
        description="Título del libro"
    )
]

AutorLibro = Annotated[
    str,
    Field(
        min_length=1,
        max_length=150,
        description="Autor del libro"
    )
]

SinopsisLibro = Annotated[
    str,
    Field(
        max_length=5000,
        description="Descripción o sinopsis del libro"
    )
]


class LibroBase(BaseModel):
    titulo: TituloLibro
    autor: AutorLibro
    sinopsis: SinopsisLibro | None = None
    imagen_portada: HttpUrl | None = None
    google_books_id: str | None = None


class LibroCreate(LibroBase):
    pass


class LibroOut(LibroBase):
    id_libro: UUID

    model_config = ConfigDict(from_attributes=True)