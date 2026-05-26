"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "./Button";
import { useEffect } from "react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichEditor({ value, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4 bg-white",
      },
    },
  });

  // Keep content in sync if value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="h-[300px] bg-gray-50 animate-pulse rounded border border-gray-300" />;
  }

  return (
    <div className="border border-neutral-300 rounded overflow-hidden flex flex-col focus-within:ring-1 focus-within:ring-red-500 focus-within:border-red-500">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 bg-neutral-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-neutral-200 text-black" : "text-neutral-600"}
        >
          Bold
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-neutral-200 text-black" : "text-neutral-600"}
        >
          Italic
        </Button>
        <span className="w-px h-4 bg-neutral-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-neutral-200 text-black" : "text-neutral-600"}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-neutral-200 text-black" : "text-neutral-600"}
        >
          H3
        </Button>
        <span className="w-px h-4 bg-neutral-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-neutral-200 text-black" : "text-neutral-600"}
        >
          Bullets
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-neutral-200 text-black" : "text-neutral-600"}
        >
          Numbers
        </Button>
        <span className="w-px h-4 bg-neutral-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-neutral-200 text-black" : "text-neutral-600"}
        >
          Quote
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
