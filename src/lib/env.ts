import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const env = {
  supabaseUrl: () => required("SUPABASE_URL"),
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  sessionSecret: () => required("SESSION_SECRET"),
  adminPassword: () => required("ADMIN_PASSWORD"),
  timezone: () => process.env.APP_TIMEZONE || "America/Costa_Rica",
};
