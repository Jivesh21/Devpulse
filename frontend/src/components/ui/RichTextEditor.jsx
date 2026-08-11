import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";

import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  RemoveFormatting,
} from "lucide-react";

function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  className = "",
}) {
  const quillRef = useRef(null);

  const [formats, setFormats] =
    useState({});

  // ====================================
  // Get Editor
  // ====================================

  function getEditor() {
    return quillRef.current?.getEditor?.();
  }

  // ====================================
  // Update Toolbar State
  // ====================================

  function updateToolbarState() {
    const editor = getEditor();

    if (!editor) return;

    const range =
      editor.getSelection();

    if (!range) return;

    const currentFormats =
      editor.getFormat(range);

    setFormats(currentFormats);
  }

  // ====================================
  // Format Text
  // ====================================

  function formatText(
    format,
    formatValue = true
  ) {
    const editor = getEditor();

    if (!editor) return;

    const range =
      editor.getSelection();

    if (!range) return;

    const currentFormats =
      editor.getFormat(range);

    const currentValue =
      currentFormats[format];

    let newValue;

    if (
      format === "header" ||
      format === "list"
    ) {
      newValue =
        currentValue ===
        formatValue
          ? false
          : formatValue;
    } else {
      newValue =
        currentValue
          ? false
          : true;
    }

    editor.format(
      format,
      newValue
    );

    updateToolbarState();

    editor.focus();
  }

  // ====================================
  // Add Link
  // ====================================

  function addLink() {
    const editor = getEditor();

    if (!editor) return;

    const range =
      editor.getSelection();

    if (
      !range ||
      range.length === 0
    ) {
      return;
    }

    const url =
      window.prompt(
        "Enter URL"
      );

    if (!url) return;

    editor.format(
      "link",
      url
    );

    updateToolbarState();

    editor.focus();
  }

  // ====================================
  // Clear Formatting
  // ====================================

  function clearFormatting() {
    const editor = getEditor();

    if (!editor) return;

    const range =
      editor.getSelection();

    if (!range) return;

    editor.removeFormat(
      range.index,
      range.length
    );

    updateToolbarState();

    editor.focus();
  }

  // ====================================
  // Selection / Cursor Changes
  // ====================================

  useEffect(() => {
    const editor = getEditor();

    if (!editor) return;

    editor.root.setAttribute(
      "spellcheck",
      "true"
    );

    editor.on(
      "selection-change",
      updateToolbarState
    );

    editor.on(
      "text-change",
      updateToolbarState
    );

    return () => {
      editor.off(
        "selection-change",
        updateToolbarState
      );

      editor.off(
        "text-change",
        updateToolbarState
      );
    };
  }, []);

  // ====================================
  // Button Helper
  // ====================================

  function toolbarButtonClass(
    active = false
  ) {
    return `
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-lg
      transition-all
      duration-150
      ${
        active
          ? `
            bg-primary/15
            text-primary
            shadow-sm
          `
          : `
            text-muted-foreground
            hover:bg-primary/10
            hover:text-primary
          `
      }
    `;
  }

  return (
    <div
      className={`
        rich-text-editor
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-background
        transition-all
        duration-200
        focus-within:border-primary/60
        focus-within:ring-2
        focus-within:ring-primary/10
        ${className}
      `}
    >
      {/* ================================= */}
      {/* Custom Toolbar */}
      {/* ================================= */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-1
          border-b
          border-border
          bg-muted/20
          px-2
          py-2
        "
      >
        {/* Bold */}

        <button
          type="button"
          title="Bold"
          className={toolbarButtonClass(
            formats.bold
          )}
          onMouseDown={(e) => {
            e.preventDefault();

            formatText(
              "bold"
            );
          }}
        >
          <Bold className="h-4 w-4" />
        </button>

        {/* Italic */}

        <button
          type="button"
          title="Italic"
          className={toolbarButtonClass(
            formats.italic
          )}
          onMouseDown={(e) => {
            e.preventDefault();

            formatText(
              "italic"
            );
          }}
        >
          <Italic className="h-4 w-4" />
        </button>

        {/* Underline */}

        <button
          type="button"
          title="Underline"
          className={toolbarButtonClass(
            formats.underline
          )}
          onMouseDown={(e) => {
            e.preventDefault();

            formatText(
              "underline"
            );
          }}
        >
          <Underline className="h-4 w-4" />
        </button>

        {/* Divider */}

        <div className="mx-1 h-6 w-px bg-border" />

        {/* H1 */}

        <button
          type="button"
          title="Heading 1"
          className={`
            flex
            h-8
            items-center
            justify-center
            rounded-lg
            px-2
            text-xs
            font-semibold
            transition-all
            ${
              formats.header ===
              1
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }
          `}
          onMouseDown={(e) => {
            e.preventDefault();

            formatText(
              "header",
              1
            );
          }}
        >
          H1
        </button>

        {/* H2 */}

        <button
          type="button"
          title="Heading 2"
          className={`
            flex
            h-8
            items-center
            justify-center
            rounded-lg
            px-2
            text-xs
            font-semibold
            transition-all
            ${
              formats.header ===
              2
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }
          `}
          onMouseDown={(e) => {
            e.preventDefault();

            formatText(
              "header",
              2
            );
          }}
        >
          H2
        </button>

        {/* Divider */}

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Bullet List */}

        <button
          type="button"
          title="Bullet List"
          className={toolbarButtonClass(
            formats.list ===
              "bullet"
          )}
          onMouseDown={(e) => {
            e.preventDefault();

            formatText(
              "list",
              "bullet"
            );
          }}
        >
          <List className="h-4 w-4" />
        </button>

        {/* Numbered List */}

        <button
          type="button"
          title="Numbered List"
          className={toolbarButtonClass(
            formats.list ===
              "ordered"
          )}
          onMouseDown={(e) => {
            e.preventDefault();

            formatText(
              "list",
              "ordered"
            );
          }}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        {/* Link */}

        <button
          type="button"
          title="Add Link"
          className={toolbarButtonClass(
            formats.link
          )}
          onMouseDown={(e) => {
            e.preventDefault();

            addLink();
          }}
        >
          <Link className="h-4 w-4" />
        </button>

        {/* Clear Formatting */}

        <button
          type="button"
          title="Clear Formatting"
          className="
            ml-auto
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition-colors
            hover:bg-destructive/10
            hover:text-destructive
          "
          onMouseDown={(e) => {
            e.preventDefault();

            clearFormatting();
          }}
        >
          <RemoveFormatting className="h-4 w-4" />
        </button>
      </div>

      {/* ================================= */}
      {/* Editor */}
      {/* ================================= */}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: false,
        }}
        formats={[
          "bold",
          "italic",
          "underline",
          "header",
          "list",
          "link",
        ]}
        placeholder={placeholder}
      />
    </div>
  );
}

export default RichTextEditor;