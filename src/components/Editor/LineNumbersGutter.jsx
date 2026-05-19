import React, { useEffect, useState, useRef } from 'react';

const LineNumbersGutter = ({ editor, startNumber = 1}) => {
  const [lineData, setLineData] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!editor || !editor.view || !editor.view.dom) return;

    const editorDom = editor.view.dom;

    const updateLineNumbers = () => {
      const newLines = [];
      let currentNumber = startNumber;
      
      // Get all text-containing block elements and the TOC container itself
      const blocks = editorDom.querySelectorAll('p, h1, h2, h3, h4, h5, h6, .toc-container');
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      blocks.forEach(block => {
        // Skip blocks inside tables as per PDF behavior
        if (block.closest('table')) return;
        // Number the toc-container as a single block based on height, skip its children
        if (block.closest('.toc-container') && block !== block.closest('.toc-container')) return;

        // Skip empty paragraphs if they don't contain visual text, unless they take up space
        // We will just number any block that has height
        const blockRect = block.getBoundingClientRect();
        if (blockRect.height === 0 || block.innerText.trim() === '') return;

        const computedStyle = window.getComputedStyle(block);
        const lineHeightStr = computedStyle.lineHeight;
        
        // If line-height is 'normal', approximate it. Otherwise parse it.
        // 11pt * 1.5 = 22px
        let lineHeight = 22; 
        if (lineHeightStr !== 'normal') {
          lineHeight = parseFloat(lineHeightStr);
        }

        const topRelativeToContainer = blockRect.top - containerRect.top;
        const numLines = Math.max(1, Math.round(blockRect.height / lineHeight));

        // Add a line number for each visual line wrapped inside this block
        for (let i = 0; i < numLines; i++) {
          newLines.push({
            number: currentNumber++,
            top: topRelativeToContainer + (i * lineHeight),
            height: lineHeight
          });
        }
      });

      setLineData(newLines);
    };

    // Initial update
    updateLineNumbers();

    // Listen to editor changes
    editor.on('transaction', updateLineNumbers);

    // Listen to window resizes (which changes text wrapping)
    window.addEventListener('resize', updateLineNumbers);

    // Setup a ResizeObserver on the editor DOM just in case fonts load or layout shifts
    const resizeObserver = new ResizeObserver(() => {
      updateLineNumbers();
    });
    resizeObserver.observe(editorDom);

    return () => {
      editor.off('transaction', updateLineNumbers);
      window.removeEventListener('resize', updateLineNumbers);
      resizeObserver.disconnect();
    };
  }, [editor, startNumber]);

  return (
    <div 
      ref={containerRef}
      className="absolute left-0 top-0 bottom-0 w-12 border-r border-transparent pointer-events-none z-0"
    >
      <div className="relative w-full h-full text-[11pt] font-serif text-gray-700 text-right pr-2">
        {lineData.map((line, idx) => (
          <div 
            key={idx} 
            className="absolute right-4 w-full flex items-center justify-end"
            style={{ 
              top: `${line.top}px`, 
              height: `${line.height}px`,
              lineHeight: `${line.height}px` 
            }}
          >
            {line.number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineNumbersGutter;
