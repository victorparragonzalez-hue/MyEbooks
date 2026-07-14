from sqlalchemy import Column, String, Text, SmallInteger, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

# 1. Modelo de Usuario
class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    lecturas = relationship("MisLecturas", back_populates="usuario")