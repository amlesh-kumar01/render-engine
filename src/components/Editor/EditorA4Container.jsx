import React from 'react';
import useReferenceStore from '../../store/useReferenceStore';
import LineNumbersGutter from './LineNumbersGutter';

const EditorA4Container = ({ children, editor, metadata = {} }) => {
  const setActiveReference = useReferenceStore((state) => state.setActiveReference);
  
  const pageNum = metadata.page_number || 1;
  const totalPages = metadata.total_pages || 1;
  const startLine = metadata.start_line_number || 1;

  return (
    <div className="w-[8.5in] min-h-[11in] my-8 mx-auto bg-white shadow-lg relative print:m-0 print:shadow-none flex flex-col font-serif text-[11pt] leading-[1.5]">
      
      {/* Top Header */}
      <div className="text-center pt-8 text-[10pt] text-gray-700">
        Examinee: Atarah Phillips | DOL: 4/13/2023 | Evaluator: David Burns, ND, FACFN, FABBIR
      </div>

      {/* Main Content Area with Border */}
      <div className="flex flex-1 mt-6 mx-12 relative">

        <LineNumbersGutter editor={editor} startNumber={startLine} />

        {/* The Bordered Box containing the Editor */}
        <div className="flex-1 border border-black relative z-10 outline-none pb-4 ml-12">
          
          {/* The actual TipTap Editor Content */}
          <div className="p-4 pr-4 relative z-10 outline-none h-full">
            {children}
          </div>
          
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-right pb-8 pr-12 pt-2 text-[10pt] font-bold">
        Page {pageNum} of {totalPages}
      </div>
    </div>
  );
};

export default EditorA4Container;
