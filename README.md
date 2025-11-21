🐾 Huellitas Felices – Sistema Integral de Gestión para el Pet Shop Huellitas Felices

Proyecto académico desarrollado con Javascript, Node.js, Express y Plantillas Pug.
Instituto Superior de Formación Técnica N° 225 – Tecnicatura Superior en Desarrollo de Software

📘 Introducción

Huellitas Felices es una aplicación web desarrollada como proyecto integrador entre las materias Desarrollo Web y Prácticas Profesionalizantes III en el marco de la Tecnicatura Superior en Desarrollo de Software (ISFT N° 225).
El propósito del sistema es ofrecer una solución informática moderna, modular y escalable que permita centralizar las distintas operaciones administrativas del negocio pet shop Huellitas Felices.

Este proyecto representa una instancia fundamental y definitoria dentro del proceso de formación de los estudiantes, ya que combina:

- Diseño y arquitectura de software
- Desarrollo backend con Node.js
- Construcción de interfaces con Pug y Bootstrap 5
- Organización modular del código
- Uso de buenas prácticas de programación
- Control de versiones colaborativo con Git y GitHub

El sistema se encuentra dividido en módulos, cada uno enfocado en un proceso propio del negocio, permitiendo trabajar de manera ordenada y clara. 
Esta versión constituye una entrega funcional inicial, con posibilidad de expansión futura.

🎯 Objetivo del Proyecto

El objetivo principal fue crear un sistema de gestión realista, usable y organizado, capaz de demostrar los conocimientos adquiridos durante el cursado. La aplicación debía cumplir los siguientes requisitos:

Contar con un dashboard principal desde el cual se pueda acceder a todos los módulos.

Incluir diseño responsivo y moderno mediante Bootstrap 5.

Utilizar Pug como motor de plantillas para mantener vistas ordenadas y dinámicas.

Implementar rutas y controladores bajo Node.js y Express.

Documentar el funcionamiento, instalación y estructura.

🧰 Tecnologías Implementadas

La aplicación combina tecnologías modernas del ecosistema JavaScript:

🔹 Backend

Node.js – Entorno de ejecución principal.

Express.js – Framework para manejar rutas, controladores y respuestas.

MVC simplificado – Separación clara entre vistas, rutas y archivos públicos.

🔹 Frontend

Motor de plantillas Pug – Permite generar vistas dinámicas con sintaxis limpia.

Bootstrap 5 – Framework CSS para diseño responsivo.

Bootstrap Icons – Iconografía integrada.

Estilos personalizados – Adaptación visual a la identidad del proyecto.

🔹 Control de versiones

Git – Versionado local.

GitHub – Repositorio remoto y trabajo colaborativo.

Commits organizados por módulos y mejoras.

Uso de MongoDB Atlas

Para la gestión de datos del sistema utilizamos MongoDB Atlas, un servicio de base de datos NoSQL completamente administrado en la nube. Atlas nos permite trabajar con una infraestructura escalable, segura y de alta disponibilidad sin necesidad de administrar servidores físicos. La base de datos se organiza en colecciones flexibles que facilitan el almacenamiento de información de usuarios, productos, ventas y demás módulos del sistema. Además, aprovechamos las herramientas integradas de Atlas como el monitoreo en tiempo real, backups automáticos y reglas de acceso basadas en roles, garantizando así integridad, rendimiento y seguridad en todo el ciclo de vida de la aplicación.

🖥️ Funcionalidades Generales

La aplicación permite acceder a diferentes áreas administrativas del negocio desde un dashboard principal, diseñado para ser intuitivo y accesible.

Cada módulo corresponde a un proceso real dentro del funcionamiento diario de un pet shop:

✔️ Módulos completamente implementados
🐶 Clientes

Permite administrar los datos personales de los clientes, información de contacto y cualquier dato relevante para los servicios o compras.

🐾 Mascotas

Registro y gestión de las mascotas pertenecientes a cada cliente, con sus características particulares.

📦 Productos

Administración del catálogo de productos ofrecidos por la tienda, permitiendo mantener un orden y control de inventario básico.

🛒 Compras

Carga y seguimiento de compras realizadas al proveedor, facilitando control de inventario y abastecimiento.

💰 Caja

Gestión de movimientos de caja, ingresos y egresos, con enfoque en la administración financiera diaria.

👥 Empleados

Registro y administración del personal, sus roles y datos esenciales.

💇‍♂️ Servicios

Control de los distintos servicios ofrecidos (baño, peluquería, etc.) y su relación con clientes/mascotas.

📆 Agenda

Manejo de turnos, citas y servicios programados, permitiendo coordinar actividades con clientes.

⏳ Módulo en desarrollo
🛍️ Ventas

Actualmente no está desarrollado en esta versión.
En el dashboard aparece en gris, deshabilitado, y con el mensaje “Módulo Ventas Próximamente”.

🧑‍💻 Autores del Proyecto

Trabajo realizado por estudiantes de 3er año de la 📚 Tecnicatura Superior en Desarrollo de Software del 🏫 Instituto Superior de Formación Técnica N° 225

👩‍💻 Ferrazin Nervegna Mayra

Desarrollo de interfaces y lógica de múltiples módulos.
Organización del dashboard y diseño visual.

Módulos desarrollados:

Clientes

Mascotas

Productos

Caja

Compras

👨‍💻 Alcaraz Brian

Integración de backend con vistas.

Armado de rutas y funcionalidades internas.

Módulos desarrollados:

Empleados

Servicios

Agenda

📂 Estructura del Proyecto

La estructura está organizada para mantener legibilidad, escalabilidad y facilidad de mantenimiento.

/huellitas2final
├── backend/              
│   ├── controllers/       → Controladores de cada módulo
│   ├── routes/            → Rutas organizadas por sección
│   └── ...
│
├── public/               
│   ├── images/            → Logos, íconos, recursos gráficos
│   ├── styles/            → Archivos CSS y estilos propios
│   └── ...
│
├── views/                → Vistas Pug de cada módulo y del dashboard
│   ├── layout/
│   ├── clientes/
│   ├── mascotas/
│   ├── productos/
│   ├── ...
│   └── dashboard.pug
│
├── index.js              → Punto de inicio del servidor Express
├── package.json
└── README.md

🚀 Instalación y Ejecución del Proyecto

Seguir estos pasos para ejecutar la aplicación en entorno local:

1️⃣ Clonar el repositorio
git clone https://github.com/cucadev/huellitas2final.git

2️⃣ Ingresar al proyecto
cd huellitas2final

3️⃣ Instalar dependencias
npm install

4️⃣ Ejecutar el servidor
npm start

5️⃣ Acceder desde el navegador
http://localhost:3000

🏗️ Posibles Mejoras Futuras

Implementación completa del módulo de Ventas.

Dashboard con estadísticas dinámicas y gráficos.

Autenticación y roles de usuario (admin / empleado).

Validaciones avanzadas y control de sesiones.

Mejoras en la experiencia de usuario.

📄 Licencia y Uso

Este proyecto es de carácter académico y puede ser utilizado con fines educativos, de estudio o como base para trabajos futuros.
