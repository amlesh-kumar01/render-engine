import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import ListItem from '@tiptap/extension-list-item';
import debounce from 'lodash.debounce';

import { CitationNode } from './extensions/CitationNode';
import { BlockReference } from './extensions/BlockReference';
import { TocNode } from './extensions/TocNode';
import EditorA4Container from './EditorA4Container';
import { convertBackendToTipTap, convertTipTapToBackend } from '../../utils/adapter';

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
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ListItem,
      CitationNode,
      BlockReference,
      TocNode,
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
    <EditorA4Container editor={editor}>
      <EditorContent editor={editor} />
    </EditorA4Container>
  );
};

export default TipTapEditor;
