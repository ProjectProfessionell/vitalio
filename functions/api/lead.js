export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Ungültiges JSON.' }, { status: 400 });
  }

  const { name, email } = data;

  if (!name || !email) {
    return Response.json({ error: 'Name und E-Mail sind erforderlich.' }, { status: 400 });
  }

  if (env.LEAD_WEBHOOK_URL) {
    try {
      await fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source: 'vitalio-landingpage' }),
      });
    } catch {
      return Response.json({ error: 'Weiterleitung fehlgeschlagen.' }, { status: 502 });
    }
  }

  return Response.json({ success: true });
}
