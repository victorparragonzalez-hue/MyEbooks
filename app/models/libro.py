from sqlalchemy import Column, String, Text, SmallInteger, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class Libro(Base):
    __tablename__ = "libros"

    id_libro = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    google_books_id = Column(String(50), unique=True, nullable=True, index=True)
    titulo = Column(String(255), nullable=False)
    autor = Column(String(150), nullable=False)
    sinopsis = Column(Text, nullable=True)
    imagen_portada = Column(String(500), nullable=True)
    lecturas = relationship("MisLecturas", back_populates="libro")
