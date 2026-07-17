# MyEbooks 📚

Este proyecto surgió con la idea de juntar dos de mis grandes pasiones: la programación y la lectura.

Con esta aplicación web podréis registrar todos los libros que habéis leído, puntuarlos y escribir qué opináis de la obra, aquellas frases que os han impactado o las reflexiones que os ha dejado su lectura. Aparte de ello, cuenta con un panel dedicado a los libros que aún tenéis pendientes, siendo de gran utilidad para que no se os olviden las historias que os quedan por descubrir.

---

## 📑 Índice

* [Acceso a la Aplicación](#acceso-a-la-aplicación)
* [Características principales](#características-principales)
* [Tecnologías utilizadas](#tecnologías-utilizadas)
* [Contacto](#contacto)

---

## 🌐 Acceso a la Aplicación

La aplicación web está desplegada y accesible para todo el que lo desee. Basta con introducir el dominio oficial en la url de cualquier buscador para poder utilizarla:

👉 **[myebooks.es](https://myebooks.es/)**

---

## ✨ Características principales

* **Búsqueda automatizada:** MyEbooks utiliza la API de Google Books para encontrar los libros que el usuario desee almacenar. Gracias a ello, a través de un solo clic, se puede acceder a una infinidad de títulos y guardar automáticamente toda su información (portada, autor, título y sinopsis).
  
* **Encriptación de alta seguridad (Argon2):** A través del avanzado algoritmo Argon2, el sistema de MyEbooks encripta las contraseñas de los usuarios en la base de datos, convirtiéndola en una aplicación web robusta y segura frente a vulnerabilidades.
  
* **Sistema de reseñas y calificaciones:** MyEbooks permite calificar los libros leídos mediante un sistema de estrellas, al unísono de ofrecer un espacio personal para escribir reflexiones, opiniones o frases que impactaron al lector, logrando que ninguna obra caiga jamás en el olvido.
  
* **Arquitectura Full-Stack escalable:** El diseño del sistema establece una separación limpia entre el cliente web (frontend) y la API RESTful (backend). Esto garantiza un flujo de datos rápido, facilita el mantenimiento del código y permite que la aplicación pueda escalar y añadir nuevas funcionalidades en el futuro sin comprometer su rendimiento.
  
* **Recuperación de cuentas por correo:** El sistema cuenta con un servicio de correos transaccionales integrado, permitiendo a los usuarios restablecer el acceso a sus cuentas de forma segura y autónoma mediante enlaces de un solo uso.

---

## 💻 Tecnologías utilizadas

### Frontend (Cliente Web)
* **Next.js & React:** Framework principal para la construcción de la interfaz de usuario.
  
* **Tailwind CSS:** Framework de diseño basado en utilidades, utilizado para maquetar una interfaz completamente responsiva, inmersiva y personalizada, garantizando una excelente experiencia visual en dispositivos móviles y de escritorio.

### Backend (Servidor & API)
* **Python:** Lenguaje principal utilizado para desarrollar la lógica de negocio y gestionar los datos.
  
* **FastAPI:** Framework moderno y de altísimo rendimiento utilizado para construir la API RESTful. Facilita la validación automática de datos, el manejo de rutas asíncronas y la seguridad de los endpoints.

* **SQLAlchemy:** ORM (Object-Relational Mapping) integrado para interactuar con la base de datos relacional de manera segura, evitando inyecciones SQL y gestionando los modelos de datos de forma estructurada.
  
* **Argon2:** Algoritmo criptográfico avanzado para el hashing de contraseñas.

### Servicios Externos e Integraciones

* **Google Books API:** Integración fundamental para el motor de búsqueda.
  
* **Brevo (SMTP):** Proveedor de servicios de correo electrónico utilizado para gestionar el envío automatizado de correos transaccionales.

### Base de Datos, Despliegue y Alojamiento

* **Neon:** Plataforma en la nube donde está alojada la base de datos PostgreSQL.
  
* **Render:** Plataforma en la nube donde se aloja el backend de producción, asegurando que la API esté siempre disponible.
  
* **Hostinger:** Proveedor utilizado para el registro y la gestión del dominio personalizado del proyecto.

---

## 📩 Contacto

Desarrollado por Victor Parra.

Si te ha gustado el proyecto o tienes alguna sugerencia, por favor, no dudes en contactarme.

👉 **[LinkedIn](https://www.linkedin.com/in/victorrparra)**
