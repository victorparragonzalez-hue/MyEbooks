from fastapi import APIRouter, Depends, HTTPException, status, Query
from uuid  import  UUID
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/lecturas",
    tags=["Biblioteca de Lecturas"]
)

@router.post("/agregar", status_code=status.HTTP_201_CREATED)
def agregar_libro_a_usuario(payload: schemas.AgregarLecturaRequest, db: Session = Depends(get_db)):
    """
    Punto de entrada automatizado:
    1. Revisa si el libro existe localmente; si no, lo registra al vuelo.
    2. Vincula el libro con el usuario en la tabla 'mis_lecturas'.
    """
    
    # -------------------------------------------------------------
    # PASO 1: GESTIÓN AUTOMÁTICA DEL CATALOGO DE LIBROS
    # -------------------------------------------------------------
    # Se busca si el libro ya fue guardado por cualquier otro usuario en el pasado

    libro = db.query(models.Libro).filter(models.Libro.google_books_id == payload.google_books_id).first()
    
    # Si es un libro completamente nuevo para la plataforma, se inserta automáticamente
    if not libro:
        libro = models.Libro(
            google_books_id=payload.google_books_id,
            titulo=payload.titulo,
            autor=payload.autor,
            sinopsis=payload.sinopsis,
            # Se aplica la conversión a string para evitar el conflicto con HttpUrl de Pydantic
            imagen_portada=str(payload.imagen_portada) if payload.imagen_portada else None
        )
        db.add(libro)
        db.commit()
        db.refresh(libro) # Obtenemos el id_libro generado automáticamente (UUID)

    # -------------------------------------------------------------
    # PASO 2: EVITAR DUPLICADOS PARA EL MISMO USUARIO
    # -------------------------------------------------------------
    # Se verifica si el usuario en cuestión ya tiene guardado este libro específico
    lectura_existente = db.query(models.MisLecturas).filter(
        models.MisLecturas.id_usuario == payload.id_usuario,
        models.MisLecturas.id_libro == libro.id_libro
    ).first()

    if lectura_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este libro ya forma parte de las lecturas de este usuario."
        )

    # -------------------------------------------------------------
    # PASO 3: CREACIÓN DE LA RELACIÓN INTERMEDIA
    # -------------------------------------------------------------
    nueva_lectura = models.MisLecturas(
        id_usuario=payload.id_usuario,
        id_libro=libro.id_libro,
        estado=payload.estado,
        puntuacion=payload.puntuacion,
        resena=payload.resena
    )
    
    db.add(nueva_lectura)
    db.commit()
    db.refresh(nueva_lectura)

    return {
        "mensaje": "Operación completada con éxito. Vínculo establecido.",
        "id_lectura": nueva_lectura.id_lectura,
        "libro_local_id": libro.id_libro,
        "titulo": libro.titulo,
        "estado_asignado": nueva_lectura.estado
    }


# ==========================================
# RUTA: OBTENER LA BIBLIOTECA DE UN USUARIO
# ==========================================


@router.get("/mis-libros/{id_usuario}")
def obtener_biblioteca_usuario(
    id_usuario: UUID,
    estado: schemas.EstadoLectura | None = Query(None),
    db: Session = Depends(get_db)
):

    consulta = (
        db.query(models.MisLecturas, models.Libro)
        .join(
            models.Libro,
            models.MisLecturas.id_libro == models.Libro.id_libro
        )
        .filter(models.MisLecturas.id_usuario == id_usuario)
    )

    if estado:
        consulta = consulta.filter(
            models.MisLecturas.estado == estado
        )

    resultados = consulta.order_by(
        models.MisLecturas.fecha_agregado.desc()
    ).all()

    return [
        {
            "id_lectura": lectura.id_lectura,
            "estado": lectura.estado,
            "puntuacion": lectura.puntuacion,
            "resena": lectura.resena,
            "detalles_libro": {
                "id_libro": libro.id_libro,
                "titulo": libro.titulo,
                "autor": libro.autor,
                "sinopsis": libro.sinopsis,
                "imagen_portada": libro.imagen_portada
            }
        }
        for lectura, libro in resultados
    ]


@router.patch("/{id_lectura}")
def actualizar_lectura(
    id_lectura: UUID,
    payload: schemas.LecturaUpdate,
    db: Session = Depends(get_db)
):
    # 1. Buscar la lectura
    lectura = (
        db.query(models.MisLecturas)
        .filter(models.MisLecturas.id_lectura == id_lectura)
        .first()
    )

    if not lectura:
        raise HTTPException(
            status_code=404,
            detail="El registro de lectura solicitado no existe."
        )

    # 2. Extraer SOLO los datos que el usuario ha enviado en el JSON
    datos_actualizados = payload.model_dump(exclude_unset=True)
    
    # 3. Bucle dinámico de actualización
    for campo, valor in datos_actualizados.items():
        if hasattr(valor, "value"):
            setattr(lectura, campo, valor.value)
        else:
            setattr(lectura, campo, valor)

    # 4. Guardar cambios
    db.commit()
    db.refresh(lectura)

    return {
        "mensaje": "Lectura actualizada con éxito.",
        "id_lectura": lectura.id_lectura,
        "estado": lectura.estado,
        "puntuacion": lectura.puntuacion
    }

# ==========================================
# RUTA 4: ELIMINAR UNA LECTURA 
# ==========================================
@router.delete("/{id_lectura}", status_code=status.HTTP_200_OK)
def eliminar_lectura(id_lectura: UUID, db: Session = Depends(get_db)):
    """
    Remueve un libro de la biblioteca personal del usuario.
    El libro permanece registrado en el catálogo global de la aplicación.
    """
    # 1. Buscar el registro de la lectura
    lectura = db.query(models.MisLecturas).filter(models.MisLecturas.id_lectura == id_lectura).first()
    
    if not lectura:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El registro de lectura solicitado no existe."
        )

    # 2. Proceder con el borrado físico de la fila en mis_lecturas
    db.delete(lectura)
    db.commit()

    return {
        "mensaje": "El libro ha sido removido de las lecturas del usuario correctamente."
    }