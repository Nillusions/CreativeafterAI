/**
 * Cloudflare Worker for Notion API Proxy
 * 
 * To deploy this:
 * 1. Go to your Cloudflare Dashboard -> Workers & Pages -> Create Worker
 * 2. Paste this entire code into the worker editor.
 * 3. Go to Worker Settings -> Variables -> Environment Variables
 * 4. Add NOTION_API_KEY (value: your notion integration secret)
 * 5. Add NOTION_DATABASE_ID (value: 1b787638f0c580dcb7d8eb3d35e9218a)
 */

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const { NOTION_API_KEY, NOTION_DATABASE_ID } = env;

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }

    try {
      // Query the Notion database
      const notionResponse = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 100 // Adjust if you need pagination (100 is max per request)
        })
      });

      if (!notionResponse.ok) {
        const errorData = await notionResponse.text();
        return new Response(JSON.stringify({ error: 'Notion API error', details: errorData }), {
          status: notionResponse.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const data = await notionResponse.json();

      // Transform the Notion API response into a simplified format
      const tools = data.results.map(page => {
        const props = page.properties;
        
        // Helper function to extract Notion property values safely
        const extractVal = (prop) => {
          if (!prop) return null;
          switch (prop.type) {
            case 'title': return prop.title[0]?.plain_text || '';
            case 'rich_text': return prop.rich_text.map(t => t.plain_text).join('') || '';
            case 'url': return prop.url || '';
            case 'select': return prop.select?.name || '';
            case 'multi_select': return prop.multi_select.map(s => s.name) || [];
            default: return null; // We can expand this if needed
          }
        };

        // We don't know your exact property names, so we try to guess standard ones or just map everything
        const formattedProps = {};
        for (const [key, value] of Object.entries(props)) {
          formattedProps[key] = extractVal(value);
        }

        return {
          id: page.id,
          icon: page.icon?.emoji || page.icon?.external?.url || page.icon?.file?.url || null,
          properties: formattedProps,
          url: page.url
        };
      });

      return new Response(JSON.stringify({ tools }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Worker error', details: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
};
