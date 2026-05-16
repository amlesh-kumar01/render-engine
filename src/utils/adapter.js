// Convert the custom backend JSON format to TipTap's JSON format
export function convertBackendToTipTap(backendData) {
  if (!backendData || !backendData.blocks) return { type: 'doc', content: [] };

  const content = backendData.blocks.map(block => {
    const attrs = {
      id: block.id,
      textAlign: block.alignment || 'left',
      blockRefs: block.refs || [],
      marginBottom: block.marginBottom || '16px',
    };

    switch (block.type) {
      case 'HEADING':
        return {
          type: 'heading',
          attrs: { ...attrs, level: block.level || 1 },
          content: convertSpansToTipTapNodes(block.spans),
        };

      case 'PARAGRAPH':
        return {
          type: 'paragraph',
          attrs,
          content: convertSpansToTipTapNodes(block.spans),
        };

      case 'LIST': {
        const isBullet = block.list_type === 'bullet';
        
        // This is a simplified list conversion. Real-world would need 
        // recursive processing for nested levels. For now we output flat items 
        // into the main list, and rely on indent classes, or structure them nested.
        return {
          type: isBullet ? 'bulletList' : 'orderedList',
          attrs,
          content: block.items.map(item => ({
            type: 'listItem',
            attrs: { level: item.level || 0, blockRefs: item.refs || [] },
            content: [
              {
                type: 'paragraph',
                content: convertSpansToTipTapNodes(item.spans),
              }
            ]
          }))
        };
      }

      case 'DIVIDER':
        return {
          type: 'horizontalRule',
          attrs: { ...attrs, thickness: block.thickness, color: block.color },
        };

      case 'TOC':
        // TipTap doesn't have a native TOC block that handles complex logic out of the box,
        // we map it to a custom node type.
        return {
          type: 'toc',
          attrs: { ...attrs, entries: block.entries },
        };

      default:
        return { type: 'paragraph', attrs, content: [] };
    }
  });

  return { type: 'doc', content };
}

// Convert spans (inline text with styling/refs) to TipTap text/citation nodes
function convertSpansToTipTapNodes(spans) {
  if (!spans) return [];
  
  const nodes = [];
  
  spans.forEach(span => {
    const marks = [];
    if (span.bold) marks.push({ type: 'bold' });
    if (span.italic) marks.push({ type: 'italic' });
    if (span.underline) marks.push({ type: 'underline' });
    
    // Add the text node
    if (span.text) {
      nodes.push({
        type: 'text',
        text: span.text,
        ...(marks.length > 0 && { marks })
      });
    }

    // Add inline citation nodes after the text if refs are present
    if (span.refs && span.refs.length > 0) {
      span.refs.forEach(refId => {
        nodes.push({
          type: 'citation',
          attrs: { refId }
        });
      });
    }
  });
  
  return nodes;
}

// Convert TipTap JSON back to Backend format (Stub for the return path)
export function convertTipTapToBackend(tiptapJson, originalData) {
  // Real implementation would map `tiptapJson.content` back to `blocks`
  // keeping original IDs where possible.
  console.log('Converting TipTap back to Backend schema...', tiptapJson);
  
  // Returning original for now, just to satisfy the mock API requirement
  return { ...originalData, blocks: originalData.blocks /* TODO: reverse map */ };
}
