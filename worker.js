/**
 * Cloudflare Worker for Notion API Proxy
 * Supports both AI Tools and Fieldnotes Blog publication.
 * 
 * To deploy:
 * 1. Cloudflare Dashboard -> Workers & Pages -> Select your Worker (or create one)
 * 2. Paste this entire code into the worker editor.
 * 3. Worker Settings -> Variables -> Environment Variables:
 *    - NOTION_API_KEY (your notion integration secret)
 *    - NOTION_DATABASE_ID (Tools database: 1b787638f0c580dcb7d8eb3d35e9218a)
 *    - NOTION_FIELDNOTES_DATABASE_ID (Your new Fieldnotes Notion database ID)
 * 
 * Endpoints:
 * - GET / or /api/tools               -> Returns AI tools list
 * - GET /api/fieldnotes              -> Returns published Fieldnotes articles list
 * - GET /api/fieldnotes?id=<page_id> -> Returns full article with rendered blocks & images
 */

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function safeHttpUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch (_) {
    return '';
  }
}
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const { NOTION_API_KEY, NOTION_DATABASE_ID, NOTION_FIELDNOTES_DATABASE_ID } = env;

    if (!NOTION_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing NOTION_API_KEY environment variable' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const typeParam = url.searchParams.get('type');
    const isFieldnotes = pathname.includes('/fieldnotes') || typeParam === 'fieldnotes';
    const pageId = url.searchParams.get('id') || url.searchParams.get('pageId');

    try {
      // -------------------------------------------------------------
      // 1. Single Fieldnote Page Blocks (Full Article content)
      // -------------------------------------------------------------
      if (isFieldnotes && pageId) {
        const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${encodeURIComponent(pageId)}/children?page_size=100`, {
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
          }
        });

        if (!blocksResponse.ok) {
          const errorData = await blocksResponse.text();
          return new Response(JSON.stringify({ error: 'Notion API error fetching blocks', details: errorData }), {
            status: blocksResponse.status,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const blocksData = await blocksResponse.json();

        // Convert Notion blocks to clean HTML
        let htmlContent = '';
        for (const block of blocksData.results) {
          const type = block.type;
          const text = block[type]?.rich_text ? block[type].rich_text.map(t => {
            let s = escapeHtml(t.plain_text);
            if (t.annotations.bold) s = `<strong>${s}</strong>`;
            if (t.annotations.italic) s = `<em>${s}</em>`;
            if (t.annotations.code) s = `<code>${s}</code>`;
            if (safeHttpUrl(t.href)) s = `<a href="${escapeHtml(safeHttpUrl(t.href))}" target="_blank" rel="noopener noreferrer">${s}</a>`;
            return s;
          }).join('') : '';

          switch (type) {
            case 'heading_1':
            case 'heading_2':
              htmlContent += `<h2>${text}</h2>`;
              break;
            case 'heading_3':
              htmlContent += `<h3>${text}</h3>`;
              break;
            case 'paragraph':
              if (text.trim()) htmlContent += `<p>${text}</p>`;
              break;
            case 'bulleted_list_item':
              htmlContent += `<li>${text}</li>`;
              break;
            case 'numbered_list_item':
              htmlContent += `<li>${text}</li>`;
              break;
            case 'quote':
              htmlContent += `<blockquote class="article-quote">${text}</blockquote>`;
              break;
            case 'callout':
              htmlContent += `<div class="article-callout"><div class="callout-icon">${block.callout.icon?.emoji || '✦'}</div><div class="callout-body">${text}</div></div>`;
              break;
            case 'image':
              const imgUrl = safeHttpUrl(block.image.file?.url || block.image.external?.url || '');
              const caption = escapeHtml(block.image.caption?.map(c => c.plain_text).join('') || '');
              htmlContent += `<figure class="article-figure"><img src="${imgUrl}" alt="${caption || 'Fieldnote visual'}" class="article-image">${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
              break;
            case 'code':
              htmlContent += `<pre><code>${text}</code></pre>`;
              break;
          }
        }

        return new Response(JSON.stringify({ html: htmlContent, blocks: blocksData.results }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...corsHeaders }
        });
      }

      // -------------------------------------------------------------
      // 2. Fieldnotes Database Query (Archive / Latest Articles)
      // -------------------------------------------------------------
      if (isFieldnotes) {
        if (!NOTION_FIELDNOTES_DATABASE_ID) {
          return new Response(JSON.stringify({ error: 'Missing NOTION_FIELDNOTES_DATABASE_ID environment variable in Cloudflare Worker' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_FIELDNOTES_DATABASE_ID}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_size: 50
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          return new Response(JSON.stringify({ error: 'Notion API error fetching fieldnotes', details: errorData }), {
            status: response.status,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const data = await response.json();
        const articles = data.results.map(page => {
          const props = page.properties;
          const getProp = (p) => {
            if (!p) return '';
            if (p.type === 'title') return p.title[0]?.plain_text || '';
            if (p.type === 'rich_text') return p.rich_text.map(t => t.plain_text).join('') || '';
            if (p.type === 'date') return p.date?.start || '';
            if (p.type === 'select') return p.select?.name || '';
            if (p.type === 'multi_select') return p.multi_select.map(s => s.name) || [];
            if (p.type === 'files') return p.files[0]?.file?.url || p.files[0]?.external?.url || '';
            return '';
          };

          const cover = page.cover?.file?.url || page.cover?.external?.url || getProp(props.Cover) || getProp(props['Cover Image']) || '';

          return {
            id: page.id,
            title: getProp(props.Name) || getProp(props.Title) || 'Untitled Note',
            slug: getProp(props.Slug) || page.id,
            excerpt: getProp(props.Excerpt) || getProp(props.Description) || '',
            date: getProp(props.Date) || '',
            readTime: getProp(props['Read Time']) || getProp(props.ReadTime) || '5 min read',
            category: getProp(props.Category) || 'Notes',
            tags: Array.isArray(getProp(props.Tags)) ? getProp(props.Tags) : (getProp(props.Tags) ? [getProp(props.Tags)] : ['AI']),
            coverImage: cover,
            url: page.url
          };
        });

        return new Response(JSON.stringify({ articles }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...corsHeaders }
        });
      }

      // -------------------------------------------------------------
      // 3. Tools Database Query (Preserved)
      // -------------------------------------------------------------
      if (!NOTION_DATABASE_ID) {
        return new Response(JSON.stringify({ error: 'Missing NOTION_DATABASE_ID environment variable' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const notionResponse = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 100,
          filter: {
            property: 'AI/ML',
            checkbox: { equals: true }
          }
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

      const tools = data.results.map(page => {
        const props = page.properties;
        const extractVal = (prop) => {
          if (!prop) return null;
          switch (prop.type) {
            case 'title': return prop.title[0]?.plain_text || '';
            case 'rich_text': return prop.rich_text.map(t => t.plain_text).join('') || '';
            case 'url': return prop.url || '';
            case 'select': return prop.select?.name || '';
            case 'multi_select': return prop.multi_select.map(s => s.name) || [];
            case 'checkbox': return prop.checkbox;
            default: return null;
          }
        };

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
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...corsHeaders }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Worker error', details: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
};
