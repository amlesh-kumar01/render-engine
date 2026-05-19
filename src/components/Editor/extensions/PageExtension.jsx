import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import PageNodeView from './PageNodeView';

export const PageExtension = Node.create({
  name: 'page',
  group: 'pageGroup', // Needs a unique group
  content: 'block+', // A page contains standard blocks

  addAttributes() {
    return {
      pageNumber: {
        default: 1,
      },
      totalPages: {
        default: 1,
      },
      startLineNumber: {
        default: 1,
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="page"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'page' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageNodeView);
  },
});
