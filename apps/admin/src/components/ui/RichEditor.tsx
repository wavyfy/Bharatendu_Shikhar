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
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4 bg-surface",
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
    return <div className="h-[300px] bg-surface-container-low animate-pulse rounded-md border border-outline-variant" />;
  }

  return (
    <div className="border border-outline-variant rounded-md overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 transition-shadow duration-150">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-outline-variant bg-surface-container-low">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant"}
        >
          Bold
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant"}
        >
          Italic
        </Button>
        <span className="w-px h-4 bg-outline-variant mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant"}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant"}
        >
          H3
        </Button>
        <span className="w-px h-4 bg-outline-variant mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant"}
        >
          Bullets
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant"}
        >
          Numbers
        </Button>
        <span className="w-px h-4 bg-outline-variant mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant"}
        >
          Quote
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto bg-surface-container-lowest text-on-surface min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
