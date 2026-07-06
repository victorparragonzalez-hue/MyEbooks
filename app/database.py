import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# 1. Cargar las variables de entorno desde el archivo .env
load_dotenv()

# 2. Obtener las credenciales de forma segura
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# 3. Construir la URL de conexión para PostgreSQL (Driver psycopg2)
SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 4. Crear el "motor" que se comunicará con la base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 5. Configurar la fábrica de sesiones (cada petición a la API usará una sesión)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 6. Crear la clase Base de la que heredarán los futuros modelos de datos
Base = declarative_base()

# 7. Crear una dependencia para inyectar la base de datos en las rutas de FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() # Cierra la conexión cuando la petición HTTP termina