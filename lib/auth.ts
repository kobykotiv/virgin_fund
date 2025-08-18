const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

export async function getUserFromAuthHeader(req: any) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth) return null;
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (e) {
    console.error('getUserFromAuthHeader error', e);
    return null;
  }
}
