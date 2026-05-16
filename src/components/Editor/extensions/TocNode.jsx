import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

const TocComponent = ({ node }) => {
  const entries = node.attrs.entries || [];

  return (
    <NodeViewWrapper className="toc-container mb-8">
      <h2 className="text-xl font-bold mb-4">TABLE OF CONTENTS</h2>
      <div className="flex flex-col gap-2">
        {entries.map((entry, idx) => (
          <div 
            key={entry.id || idx} 
            className="flex justify-between items-end relative"
            style={{ paddingLeft: `${(entry.level || 0) * 1.5}rem` }}
          >
            <span className="bg-white pr-2 z-10 font-medium">{entry.title}</span>
            <div className="absolute left-0 right-0 bottom-[6px] border-b border-dotted border-gray-400 z-0"></div>
            <span className="bg-white pl-2 z-10">{entry.page_number}</span>
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
};

export const TocNode = Node.create({
  name: 'toc',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      entries: { default: [] },
      id: { default: null },
      marginBottom: { default: '32px' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toc"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'toc' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TocComponent);
  },
});
