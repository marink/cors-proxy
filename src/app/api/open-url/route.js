
function setCorsHeaders(headers = {}) {
    return {
        ...headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

/**
 * Provide content from a target URL, bypassing CORS restrictions.
 * 
 * Usage: /api/open-url?url={TARGET_URL}
 * 
 * @param {*} request 
 * @returns 
 */
async function handle(request) {
    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: setCorsHeaders(),
        });
    }

    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    if (!targetUrl) {
        return new Response('Missing url parameter', {
            status: 400,
            headers: setCorsHeaders(),
        });
    }

    try {
        const res = await fetch(targetUrl);
        const contentType = res.headers.get('content-type') || 'text/plain';
        const body = await res.text();
        return new Response(body, {
            status: res.status,
            headers: setCorsHeaders({ 'content-type': contentType }),
        });
    } catch (err) {
        return new Response('Failed to fetch target URL', {
            status: 500,
            headers: setCorsHeaders(),
        });
    }
}

export { handle as GET, handle as POST };
