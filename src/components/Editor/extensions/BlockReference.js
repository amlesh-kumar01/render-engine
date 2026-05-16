import { Extension } from '@tiptap/core';

export const BlockReference = Extension.create({
  name: 'blockReference',

  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph', 'listItem', 'toc', 'horizontalRule'],
        attributes: {
          blockRefs: {
            default: [],
            parseHTML: element => {
              const refs = element.getAttribute('data-block-refs');
              return refs ? JSON.parse(refs) : [];
            },
            renderHTML: attributes => {
              if (!attributes.blockRefs || attributes.blockRefs.length === 0) {
                return {};
              }
              return {
                'data-block-refs': JSON.stringify(attributes.blockRefs),
              };
            },
          },
          marginBottom: {
            default: '16px',
            parseHTML: element => element.style.marginBottom || '16px',
            renderHTML: attributes => {
              if (!attributes.marginBottom) return {};
              return {
                style: `margin-bottom: ${attributes.marginBottom}`,
              };
            },
          },
          id: {
            default: null,
            parseHTML: element => element.getAttribute('id'),
            renderHTML: attributes => {
              if (!attributes.id) return {};
              return { id: attributes.id };
            }
          }
        },
      },
    ];
  },
});
