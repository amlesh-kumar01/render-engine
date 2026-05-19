import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

const TocComponent = ({ node }) => {
  const entries = node.attrs.entries || [];

  return (
    <NodeViewWrapper className="toc-container mb-8">
      <h2 className="text-[14pt] font-bold m-0 leading-[22px] text-center" style={{ fontFamily: '"Times New Roman", Times, serif' }}>INDEX</h2>
      <div className="h-[22px]"></div>
      <div className="flex flex-col gap-0">
        {entries.map((entry, idx) => (
          <div 
            key={entry.id || idx} 
            className="flex items-end m-0 leading-[22px] h-[22px]"
            style={{ paddingLeft: `${(entry.level || 0) * 1.5}rem` }}
          >
            <span className={`pr-2 ${entry.level === 0 ? 'font-bold' : ''}`}>
              {entry.title}
            </span>
            <div className="flex-1 border-b border-dotted border-black mb-[6px]"></div>
            <span className="pl-2">{entry.page_number}</span>
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
