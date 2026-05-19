import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import ListItem from '@tiptap/extension-list-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import debounce from 'lodash.debounce';

import { CitationNode } from './extensions/CitationNode';
import { BlockReference } from './extensions/BlockReference';
import { TocNode } from './extensions/TocNode';
import { PageExtension } from './extensions/PageExtension';
import { FontSize } from './extensions/FontSize';
import Document from '@tiptap/extension-document';
import { convertBackendToTipTap, convertTipTapToBackend } from '../../utils/adapter';

// Custom Document that requires at least one Page node, which contains the actual blocks
const CustomDocument = Document.extend({
  content: 'page+',
});

const TipTapEditor = ({ initialBackendData }) => {
  // 1. Adapter: Convert Backend JSON to TipTap JSON on load
  const initialContent = convertBackendToTipTap(initialBackendData);

  // 2. The Auto-Save Function
  const saveToBackend = useCallback(
    debounce(async (tiptapJson) => {
      // Adapter: Convert TipTap JSON back to Backend format
      const backendPayload = convertTipTapToBackend(tiptapJson, initialBackendData);
      
      // Mock API call
      console.log('Autosaved to backend payload:', backendPayload);
      
      // Example fetch call (commented out for mock)
      /*
      await fetch(`/api/reports/${initialBackendData.document_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendPayload),
      });
      */
    }, 1500),
    [initialBackendData]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false, // We provide our own CustomDocument
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      CustomDocument,
      PageExtension,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ListItem,
      CitationNode,
      BlockReference,
      TocNode,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // Trigger debounced save on every edit
      saveToBackend(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none',
      },
    },
  });

  return (
    <div className="bg-transparent w-full h-full pb-16 relative">
      <div className="sticky top-4 z-50 flex justify-end pr-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Print to PDF
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
