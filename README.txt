rSISTEMA DE PRECIOS WEB - Marcas destacadas

Esta versión agrega:
- Carrusel automático de Marcas destacadas para trabajadores, sin flechas.
- Movimiento continuo hacia la izquierda con repetición.
- Solo se muestran hasta 8 marcas destacadas, no todas las marcas del catálogo.
- Los trabajadores pueden hacer clic en una marca para filtrar sus productos.
- Panel exclusivo de administrador para agregar, editar, ordenar y eliminar marcas destacadas.
- Editor de logo con cambio de imagen, rotación y Quitar fondo.
- Quitar fondo usa detección conectada desde los bordes para evitar borrar automáticamente las zonas blancas internas del logo.
- Vista previa dentro del panel para ver cómo lo recibirán los trabajadores.

IMPORTANTE - PRIMERA CONFIGURACIÓN
1. En Supabase abre SQL Editor.
2. Abre el archivo marcas_destacadas.sql incluido en este ZIP.
3. Ejecuta todo el SQL una sola vez.
4. Luego publica esta versión en Vercel mediante el repositorio de GitHub.

La tabla marcas_destacadas guarda nombre, categoría, imagen, orden y estado de cada marca.
Las imágenes cargadas desde el equipo se reducen para el uso web y se guardan como PNG dentro de imagen_url. Para quitar fondo de una imagen URL externa, el servidor externo debe permitir CORS; si no lo permite, descarga la imagen y súbela desde el equipo.

Supabase se mantiene en el mismo proyecto configurado en config.js.
Actualización del sistema.
