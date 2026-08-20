# Mers — Glimmers y Dimmers

Cada dia, cada persona del grupo comparte un **glimmer** (lo mejor de su dia) y un
**dimmer** (lo no tan bueno). Al publicar el propio, se desbloquea el dashboard
para ver — y reaccionar a — los del resto, y un calendario para revisar dias
anteriores.

## Stack

- **Next.js 16** (App Router, Server Actions) + TypeScript
- **Tailwind CSS v4**
- **Supabase** (Postgres) como base de datos — accedida solo desde el
  servidor con el `service_role key`; el navegador nunca recibe una clave de
  Supabase. La identidad de cada persona vive en una cookie firmada (HMAC),
  no en Supabase Auth.

## Puesta en marcha local

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Crear el proyecto de Supabase**
   - Entra a [supabase.com](https://supabase.com) y crea un proyecto nuevo.
   - En el **SQL Editor**, pega y ejecuta el contenido de
     [`supabase/schema.sql`](supabase/schema.sql).
   - En **Project Settings > API** copia la `Project URL` y la
     `service_role` key (no la `anon` key).

3. **Variables de entorno**

   Copia `.env.example` a `.env.local` y completa los valores:

   ```bash
   cp .env.example .env.local
   ```

   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: del paso anterior.
   - `SESSION_SECRET`: una cadena aleatoria larga, por ejemplo
     `openssl rand -base64 32`.
   - `ADMIN_PASSWORD`: la clave para entrar a `/admin` y crear las personas
     del grupo.
   - `APP_TIMEZONE`: zona horaria usada para decidir "el dia de hoy" y las
     rachas (por defecto `America/Costa_Rica`).

4. **Correr en desarrollo**

   ```bash
   npm run dev
   ```

5. **Crear las personas del grupo**

   Entra a `http://localhost:3000/admin`, ingresa la `ADMIN_PASSWORD` y
   agrega a cada persona con su nombre, icono, color y un PIN de 4 digitos.
   Ese PIN es lo que cada quien usa en `/` para identificarse — no hay
   contraseñas ni cuentas de verdad, es un grupo de confianza.

## Despliegue en produccion (Vercel)

1. Sube el repo a GitHub/GitLab y conectalo en [vercel.com](https://vercel.com).
2. En **Settings > Environment Variables** del proyecto en Vercel, agrega las
   mismas variables de `.env.local` (con un `SESSION_SECRET` distinto al de
   desarrollo).
3. Despliega. Al terminar, entra a `/admin` en la URL de produccion para
   crear las personas del grupo (los datos de Supabase son independientes
   por ambiente si usas proyectos distintos para dev/prod).

## Estructura

```
src/
  app/
    page.tsx            selector de perfil (elige nombre + PIN)
    today/page.tsx       publicar/editar el glimmer y dimmer de hoy
    family/page.tsx      dashboard del dia con reacciones
    calendar/page.tsx    calendario mensual + dias anteriores
    admin/page.tsx        alta y edicion de personas
    actions/              Server Actions (auth, entries, reactions, admin)
  components/              piezas de UI reutilizables
  lib/
    data/                  acceso a Supabase (solo servidor)
    session.ts             cookies firmadas (persona / admin)
    crypto.ts               hash de PIN y firma de sesion
    dates.ts                 zona horaria, formato y racha
supabase/schema.sql       esquema de la base de datos
```

## Notas de diseño

- **Sin cuentas reales**: cualquiera con el link elige su nombre e ingresa su
  PIN. Pensado para un grupo pequeno y de confianza, no para acceso publico.
- **Un registro por persona por dia**: la tabla `entries` tiene una
  restriccion `unique (person_id, entry_date)`; volver a publicar el mismo
  dia actualiza el registro existente.
- **"Familia" y "Calendario" se desbloquean** al publicar el propio glimmer y
  dimmer del dia — asi todos comparten antes de ver a los demas.
- **Reacciones**: cuatro emojis fijos (❤️ 🌱 😲 👏), un toggle por persona y
  emoji sobre cada entrada.
