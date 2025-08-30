// MongoDB support removed. Provide no-op connectors so callers remain compatible.
export async function connectToDatabase() {
  // In production, replace this with a Supabase/Postgres connector if needed.
  console.debug('connectToDatabase: no-op (mongodb removed)');
  return { connection: null };
}

export async function disconnectFromDatabase() {
  console.debug('disconnectFromDatabase: no-op (mongodb removed)');
  return;
}
