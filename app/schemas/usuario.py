from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


NombreUsuario = Annotated[
    str,
    Field(
        min_length=2,
        max_length=100,
        description="Nombre completo del usuario"
    )
]

PasswordUsuario = Annotated[
    str,
    Field(
        min_length=8,
        max_length=72,
        description="La contraseña debe tener entre 8 y 72 caracteres"
    )
]


class UsuarioBase(BaseModel):
    nombre: NombreUsuario
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    password: PasswordUsuario


class usuarioDelete(UsuarioBase):
    id_usuario: UUID
    fecha_registro: datetime
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class cambioContraseñaRequest(BaseModel):
    email: EmailStr
    nueva_contraseña: PasswordUsuario

class RestablecerPasswordRequest(BaseModel):
    token: str
    nueva_password: str

class OlvidePasswordRequest(BaseModel):
    email: EmailStr