import { NextResponse } from 'next/server';

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Virgin Fund API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui.css" />
  </head>
  <body>
    <div style="display:flex;gap:8px;align-items:center;padding:8px;">
      <label for="bearer">Bearer token:</label>
      <input id="bearer" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px" placeholder="paste token here" />
      <button id="setToken" style="padding:6px 10px">Set Token</button>
      <button id="clearToken" style="padding:6px 10px">Clear</button>
    </div>
    <div id="swagger"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4.18.3/swagger-ui-bundle.js"></script>
    <script>
      function applyBearer(token) {
        if (!window.ui) return;
        const auth = {
          name: 'ServiceBearer',
          schema: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          },
          value: 'Bearer ' + token
        };
        // swagger-ui exposes an `authActions` helper to set auth
        if (window.ui.authActions && typeof window.ui.authActions.authorize === 'function') {
          const credentials = {};
          credentials['ServiceBearer'] = { name: 'ServiceBearer', value: 'Bearer ' + token };
          window.ui.authActions.authorize(credentials);
        }
      }

      window.onload = function() {
        const ui = SwaggerUIBundle({
          url: '/api/openapi',
          dom_id: '#swagger',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis],
        });
        window.ui = ui;

        const input = document.getElementById('bearer');
        const setBtn = document.getElementById('setToken');
        const clearBtn = document.getElementById('clearToken');
        setBtn.addEventListener('click', function() {
          const val = input.value.trim();
          if (!val) return alert('Enter token');
          applyBearer(val);
        });
        clearBtn.addEventListener('click', function() {
          if (window.ui && window.ui.authActions && window.ui.authActions.logout) window.ui.authActions.logout();
          input.value = '';
        });
      };
    </script>
  </body>
</html>`;

export async function GET() {
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
