

async function updateCORS() {
  const token = 'token 25472a0b63167c1:0b5cf06b3f8a8e5';
  const url = 'https://al-bushira.frappe.cloud/api/resource/System%20Settings/System%20Settings';
  
  try {
    const r1 = await fetch(url, { headers: { 'Authorization': token } });
    const j1 = await r1.json();
    let cors = j1.data?.allow_cors || '';
    
    console.log('Current CORS:', cors);
    
    if (!cors.includes('wonderful-gelato-0a4281.netlify.app')) {
      if (cors && !cors.endsWith('\n')) cors += '\n';
      cors += 'https://wonderful-gelato-0a4281.netlify.app';
    }
    
    const r2 = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ allow_cors: cors })
    });
    
    const j2 = await r2.json();
    console.log('Updated CORS:', j2.data?.allow_cors);
  } catch(e) {
    console.error(e);
  }
}

updateCORS();
