from passlib.context import CryptContext

# 1. Configurar el contexto de encriptación indicando que se usará Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """
    Toma una contraseña en texto plano (ej. 'hola1234') y devuelve 
    un hash seguro con 'Salt' incluido (ej. '$2b$12$KIXeW...').
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compara la contraseña que el usuario escribe al intentar hacer login
    con el hash guardado en la base de datos.
    Devuelve True si coinciden, False en caso contrario.
    """
    return pwd_context.verify(plain_password, hashed_password)