import React from 'react';

const SplitPane = ({ leftPane, rightPane }) => {
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Left Pane: Editor */}
      <div className="w-1/2 h-full overflow-y-auto border-r border-gray-300 bg-gray-50 flex justify-center">
        {leftPane}
      </div>

      {/* Right Pane: PDF Viewer */}
      <div className="w-1/2 h-full overflow-y-auto bg-gray-200 flex justify-center items-center">
        {rightPane}
      </div>
    </div>
  );
};

export default SplitPane;
