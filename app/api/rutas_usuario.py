import os
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
from jose import jwt

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.core import encryptation  # Asegúrate de que este módulo esté bien configurado en tu proyecto

# 1. Creamos UN SOLO enrutador para todo el archivo
router = APIRouter(
    prefix="/usuarios",
    tags=["Gestión de Usuarios y Autenticación"] # Etiqueta combinada
)

# ==========================================
# RUTA 1: REGISTRO DE USUARIO
# ==========================================
@router.post("/registro", response_model=schemas.usuarioDelete, status_code=status.HTTP_201_CREATED)
def registrar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    
    usuario_existente = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El email ya está registrado."
        )

    # Nota: Print eliminado para evitar filtraciones en la consola del servidor
    hashed_password = encryptation.get_password_hash(usuario.password)

    nuevo_usuario = models.Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password_hash=hashed_password
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario

# ==========================================
# RUTA 2: INICIO DE SESIÓN (LOGIN)
# ==========================================
@router.post("/login")
def login(credenciales: schemas.LoginRequest, db: Session = Depends(get_db)):
    """
    Verifica el correo electrónico y la contraseña contra la base de datos
    sin generar tokens intermedios.
    """
    
    # Buscar al usuario
    usuario = db.query(models.Usuario).filter(models.Usuario.email == credenciales.email).first()
    
    # Verificar existencia y contraseña
    if not usuario or not encryptation.verify_password(credenciales.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo electrónico o contraseña incorrectos."
        )
    
    # Retornar éxito
    return {
        "mensaje": "Inicio de sesión exitoso",
        "usuario": {
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "email": usuario.email
        }
    }

# ==========================================
# RUTA 3: CAMBIO DE CONTRASEÑA
# ==========================================
# (Aquí estará la declaración del router: router = APIRouter(...))

# ==========================================
# FUNCIONES AUXILIARES PARA EL CORREO Y TOKEN
# ==========================================
SECRET_KEY = os.getenv("SECRET_KEY", "clave_por_defecto_para_desarrollo")
ALGORITHM = "HS256"

def crear_token_recuperacion(email: str) -> str:
    """Crea un token cifrado que caduca en 1 hora."""
    expiracion = datetime.utcnow() + timedelta(hours=1)
    datos = {"sub": email, "exp": expiracion, "tipo": "recuperacion"}
    return jwt.encode(datos, SECRET_KEY, algorithm=ALGORITHM)

def enviar_correo_recuperacion(email_destino: str, token: str):
    """Se conecta al servidor SMTP y envía el correo real."""
    remitente = os.getenv("EMAIL_REMITENTE")
    password = os.getenv("EMAIL_PASSWORD")
    
    if not remitente or not password:
        print("CUIDADO: Credenciales de correo no configuradas en el .env")
        return

    # Se construye el mensaje base
    msg = EmailMessage()
    msg['Subject'] = "Recuperación de contraseña - MyEbooks"
    msg['From'] = remitente
    msg['To'] = email_destino

    link_recuperacion = f"https://my-ebooks-zeta.vercel.app/restablecer?token={token}"
    
    # 1. CAPA DE RESPALDO (Texto Plano)
    # Se añade por si el lector usa un cliente de correo muy antiguo que bloquea el HTML
    contenido_texto = f"""Hola,

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en MyEbooks.

Por favor, copia y pega el siguiente enlace en tu navegador para crear una nueva contraseña:
{link_recuperacion}

Este enlace es seguro y expirará en 1 hora. Si no has solicitado este cambio, puedes ignorar este correo.

Atentamente,
El equipo de MyEbooks.
"""
    msg.set_content(contenido_texto)

    # 2. CAPA PRINCIPAL (HTML)
    # Este es el diseño visual que verá el 99% de los usuarios, con el enlace oculto en un botón dorado
    contenido_html = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #0a0806; color: #f5f1e8; padding: 40px 20px; margin: 0;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #0f0c09; padding: 40px; border: 1px solid rgba(212, 180, 131, 0.2); border-radius: 16px;">
          
          <h2 style="color: #d4b483; text-align: center; font-size: 24px; margin-bottom: 24px; font-family: serif;">
            MyEbooks
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #f5f1e8;">Hola,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #f5f1e8;">
            Hemos recibido una solicitud para restablecer la contraseña de tu biblioteca digital. Haz clic en el botón de abajo para crear una nueva clave de acceso:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="{link_recuperacion}" style="background-color: #d4b483; color: #0a0806; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; display: inline-block;">
              Restablecer mi contraseña
            </a>
          </div>
          
          <p style="font-size: 13px; color: rgba(245, 241, 232, 0.6); line-height: 1.5; text-align: center;">
            Este enlace es seguro y expirará en 1 hora.<br>
            Si no has solicitado este cambio, puedes ignorar este correo sin problema.
          </p>
          
          <hr style="border: 0; border-top: 1px solid rgba(212, 180, 131, 0.1); margin: 30px 0;">
          
          <p style="font-size: 12px; color: rgba(212, 180, 131, 0.5); text-align: center; letter-spacing: 1px; text-transform: uppercase;">
            El equipo de MyEbooks
          </p>

        </div>
      </body>
    </html>
    """
    
    # La instrucción clave que le dice al correo que use el diseño HTML
    msg.add_alternative(contenido_html, subtype='html')

    # ... a partir de aquí continúa el try/except del servidor SMTP ...

    # Se envía usando Gmail como servidor SMTP

    print(f"Intentando enviar correo de recuperación a {email_destino}...")
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(remitente, password)
            server.send_message(msg)
            print(f"Correo de recuperación enviado con éxito a {email_destino}")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")

# ==========================================
# RUTA: SOLICITAR RECUPERACIÓN DE CONTRASEÑA
# ==========================================
# ==========================================
# RUTA 1: SOLICITAR EL ENLACE AL CORREO
# ==========================================
@router.post("/olvide-password", status_code=status.HTTP_200_OK)
def solicitar_recuperacion(
    payload: schemas.OlvidePasswordRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    
    print(f"¡Conexión recibida desde React! Buscando el correo: {payload.email}")
    """
    Paso 1: Recibe el email desde React y envía el token al correo del lector.
    """
    # 1. Buscar al usuario
    usuario = db.query(models.Usuario).filter(models.Usuario.email == payload.email).first()
    
    # 2. Si NO existe, lanzar error 404
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No existe ninguna cuenta asociada a este correo."
        )

    # 3. Generar token y encolar el correo
    token = crear_token_recuperacion(usuario.email)
    background_tasks.add_task(enviar_correo_recuperacion, usuario.email, token)
        
    return {"mensaje": "Enlace de recuperación enviado con éxito."}


# ==========================================
# RUTA 2: GUARDAR LA NUEVA CONTRASEÑA
# ==========================================
@router.post("/restablecer-password", status_code=status.HTTP_200_OK)
def guardar_nueva_contrasena(
    payload: schemas.RestablecerPasswordRequest, 
    db: Session = Depends(get_db)
):
    """
    Paso 2: Recibe el token oculto y la nueva contraseña para cifrarla y guardarla.
    """
    # 1. Verificar que el token sea auténtico y no haya caducado
    try:
        datos_token = jwt.decode(payload.token, SECRET_KEY, algorithms=[ALGORITHM])
        email_usuario = datos_token.get("sub")
        tipo_token = datos_token.get("tipo")

        if tipo_token != "recuperacion" or not email_usuario:
            raise ValueError("Token inválido")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="El enlace ha caducado. Solicita uno nuevo.")
    except Exception:
        raise HTTPException(status_code=400, detail="El enlace de seguridad es inválido o está corrupto.")

    # 2. Localizar al usuario dueño de ese correo
    usuario = db.query(models.Usuario).filter(models.Usuario.email == email_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado en el sistema.")

    # 3. Encriptar y guardar la nueva contraseña
    password_cifrada = encryptation.get_password_hash(payload.nueva_password)
    
    # IMPORTANTE: Cambiar "hashed_password" por el nombre exacto de la columna en models.py
    usuario.password_hash = password_cifrada  
    print(f"Contraseña actualizada para el usuario {usuario.email} (ID: {usuario.id_usuario})")
    db.commit()
    db.refresh(usuario)

    return {"mensaje": "Contraseña actualizada con éxito."}