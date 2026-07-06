from sqlalchemy import Column, String, Text, SmallInteger, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

# 3. Modelo Intermedio: Mis Lecturas
class MisLecturas(Base):
    __tablename__ = "mis_lecturas"

    id_lectura = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_usuario = Column(UUID(as_uuid=True), ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), nullable=False)
    id_libro = Column(UUID(as_uuid=True), ForeignKey("libros.id_libro", ondelete="CASCADE"), nullable=False)
    estado = Column(String(20), nullable=False) # Valores esperados: 'Pendiente' o 'Leído'
    puntuacion = Column(SmallInteger, nullable=True)
    resena = Column(Text, nullable=True)
    fecha_agregado = Column(DateTime(timezone=True), server_default=func.now())

    # Restricción a nivel de tabla: Un usuario no puede registrar el mismo libro dos veces
    __table_args__ = (UniqueConstraint('id_usuario', 'id_libro', name='_usuario_libro_uc'),)

    # Relaciones para navegar desde el código
    usuario = relationship("Usuario", back_populates="lecturas")
    libro = relationship("Libro", back_populates="lecturas")