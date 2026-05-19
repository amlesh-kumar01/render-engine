// Convert the custom backend JSON format to TipTap's JSON format
export function convertBackendToTipTap(backendData) {
  if (!backendData || !backendData.blocks) return { type: 'doc', content: [] };

  const pages = [];
  let currentPageBlocks = [];
  let pageNumber = 1;

  const convertBlock = (block) => {
    const attrs = {
      id: block.id,
      textAlign: block.alignment || 'left',
      blockRefs: block.refs || [],
      marginBottom: block.marginBottom || '16px',
      lineNumber: block.line_number || null,
    };

    switch (block.type) {
      case 'HEADING':
        return {
          type: 'heading',
          attrs: { ...attrs, level: parseInt(block.level) || 1 },
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
        const listType = isBullet ? 'bulletList' : 'orderedList';
        
        const buildNestedList = (items, startIdx = 0, currentLevel = 0) => {
          const content = [];
          let i = startIdx;

          while (i < items.length) {
            const item = items[i];
            
            if (item.level < currentLevel) {
              break;
            } else if (item.level === currentLevel) {
              const listItem = {
                type: 'listItem',
                attrs: { blockRefs: item.refs || [] },
                content: [
                  {
                    type: 'paragraph',
                    content: convertSpansToTipTapNodes(item.spans),
                  }
                ]
              };
              
              if (i + 1 < items.length && items[i + 1].level > currentLevel) {
                const childResult = buildNestedList(items, i + 1, currentLevel + 1);
                listItem.content.push({
                  type: listType,
                  content: childResult.content
                });
                i = childResult.nextIdx;
              } else {
                i++;
              }
              content.push(listItem);
            } else {
              const childResult = buildNestedList(items, i, currentLevel + 1);
              if (content.length > 0) {
                 content[content.length - 1].content.push({
                   type: listType,
                   content: childResult.content
                 });
              } else {
                 content.push({
                   type: 'listItem',
                   content: [ { type: listType, content: childResult.content } ]
                 });
              }
              i = childResult.nextIdx;
            }
          }
          return { content, nextIdx: i };
        };

        const { content } = buildNestedList(block.items, 0, 0);

        return {
          type: listType,
          attrs,
          content
        };
      }

      case 'DIVIDER':
        return {
          type: 'horizontalRule',
          attrs: { ...attrs, thickness: block.thickness, color: block.color },
        };

      case 'TOC':
        return {
          type: 'toc',
          attrs: { ...attrs, entries: block.entries },
        };

      case 'TABLE':
        return {
          type: 'table',
          attrs,
          content: (block.rows || []).map(row => ({
            type: 'tableRow',
            content: (row.cells || []).map(cell => ({
              type: cell.isHeader ? 'tableHeader' : 'tableCell',
              attrs: {
                colspan: cell.colspan || 1,
                rowspan: cell.rowspan || 1,
                colwidth: cell.colwidth || null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: convertSpansToTipTapNodes(cell.spans),
                }
              ]
            }))
          }))
        };

      default:
        return { type: 'paragraph', attrs, content: [] };
    }
  };

  backendData.blocks.forEach(block => {
    if (block.type === 'PAGE_BREAK') {
      if (currentPageBlocks.length > 0) {
        pages.push({
          type: 'page',
          attrs: { pageNumber },
          content: currentPageBlocks
        });
        pageNumber++;
        currentPageBlocks = [];
      }
    } else {
      currentPageBlocks.push(convertBlock(block));
    }
  });

  if (currentPageBlocks.length > 0) {
    pages.push({
      type: 'page',
      attrs: { pageNumber },
      content: currentPageBlocks
    });
  }

  // Update total pages for all page nodes
  pages.forEach(page => {
    page.attrs.totalPages = pages.length;
  });

  return { type: 'doc', content: pages };
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
    if (span.fontSize) marks.push({ type: 'fontSize', attrs: { size: span.fontSize } });
    
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
