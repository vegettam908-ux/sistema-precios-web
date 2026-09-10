# Sistema de Precios — Web

Versión web estática (HTML + CSS + JavaScript) preparada para trabajar con el mismo Supabase del sistema.

## Archivos
- `index.html` — pantalla, catálogo, formularios y paneles.
- `style.css` — diseño responsive y formal.
- `app.js` — login, catálogo, búsqueda, categorías, precios y administración.
- `config.js` — aquí se coloca la URL y la clave pública `anon` de Supabase.
- `assets/logo.svg` — logo provisional.

## Probar ahora
El proyecto viene con `demoMode: true`.
1. Abre `index.html` con Live Server.
2. Usuario demo: `admin`
3. Contraseña demo: `admin`

También puedes probar:
- trabajador / 1234

## Conectar con tu Supabase real
Abre `config.js` y coloca:
- `supabaseUrl`: URL de tu proyecto real `sistema-precios`.
- `supabaseAnonKey`: clave pública `anon`.

Luego cambia:
`demoMode: false`

NO uses la `service_role` key en este archivo.

## Estructura que utiliza
`productos`:
- id
- categoria_id
- nombre
- precio_unidad
- fecha_creacion
- fecha_actualizacion
- categoria
- precios_mayor
- imagen_url
- precio_mercado
- precio_publico

`usuarios`:
- id
- usuario
- nombre
- rol
- password
- activo
- fecha_registro
- foto_path

Las categorías del catálogo se calculan desde `productos.categoria`, por lo que no depende de que `categorias` tenga registros.

## Nota importante
Esta versión replica el esquema de acceso actual del proyecto. Para producción conviene migrar las contraseñas a Supabase Auth y aplicar políticas RLS correctamente.
