'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { processPastedContent, generateExcerpt } from '@/lib/htmlSanitizer';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    onExcerptGenerate?: (excerpt: string) => void;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Write your content here...',
    onExcerptGenerate
}: RichTextEditorProps) {
    const [mode, setMode] = useState<'visual' | 'html'>('visual');
    const [htmlSource, setHtmlSource] = useState(value);
    const editorRef = useRef<HTMLDivElement>(null);

    // Sync editor content with value prop
    useEffect(() => {
        if (editorRef.current && mode === 'visual') {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value;
            }
        }
        if (mode === 'html') {
            setHtmlSource(value);
        }
    }, [value, mode]);

    // Handle paste
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();

        // Get HTML from clipboard, fallback to text
        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');

        let contentToInsert: string;

        if (html) {
            // Sanitize and process HTML content
            contentToInsert = processPastedContent(html);
        } else {
            // Convert plain text to paragraphs
            contentToInsert = text.split('\n\n').map(p => `<p>${p}</p>`).join('');
        }

        // Insert at cursor position
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();

            const fragment = document.createRange().createContextualFragment(contentToInsert);
            range.insertNode(fragment);

            // Move cursor to end
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Trigger change
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            if (onExcerptGenerate) {
                onExcerptGenerate(generateExcerpt(editorRef.current.innerHTML));
            }
        }
    }, [onChange, onExcerptGenerate]);

    // Handle input
    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    // Format commands
    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    // Insert link
    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    // Insert image
    const insertImage = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            const alt = prompt('Enter alt text:') || '';
            const img = `<img src="${url}" alt="${alt}" loading="lazy" style="max-width: 100%; height: auto;" />`;
            execCommand('insertHTML', img);
        }
    };

    // Switch modes
    const switchToHtml = () => {
        if (editorRef.current) {
            setHtmlSource(editorRef.current.innerHTML);
        }
        setMode('html');
    };

    const switchToVisual = () => {
        onChange(htmlSource);
        setMode('visual');
    };

    // HTML source change
    const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setHtmlSource(e.target.value);
        onChange(e.target.value);
    };

    return (
        <div className={styles.editor}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.toolGroup}>
                    <button type="button" onClick={() => execCommand('bold')} title="Bold" className={styles.toolBtn}>
                        <strong>B</strong>
                    </button>
                    <button type="button" onClick={() => execCommand('italic')} title="Italic" className={styles.toolBtn}>
                        <em>I</em>
                    </button>
                    <button type="button" onClick={() => execCommand('underline')} title="Underline" className={styles.toolBtn}>
                        <u>U</u>
                    </button>
                    <button type="button" onClick={() => execCommand('strikeThrough')} title="Strikethrough" className={styles.toolBtn}>
                        <s>S</s>
                    </button>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <select
                        onChange={(e) => execCommand('formatBlock', e.target.value)}
                        className={styles.toolSelect}
                        defaultValue=""
                    >
                        <option value="" disabled>Heading</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="h4">Heading 4</option>
                        <option value="p">Paragraph</option>
                        <option value="blockquote">Quote</option>
                        <option value="pre">Code</option>
                    </select>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <button type="button" onClick={() => execCommand('insertUnorderedList')} title="Bullet List" className={styles.toolBtn}>
                        •
                    </button>
                    <button type="button" onClick={() => execCommand('insertOrderedList')} title="Numbered List" className={styles.toolBtn}>
                        1.
                    </button>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <button type="button" onClick={insertLink} title="Insert Link" className={styles.toolBtn}>
                        🔗
                    </button>
                    <button type="button" onClick={insertImage} title="Insert Image" className={styles.toolBtn}>
                        🖼️
                    </button>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <button type="button" onClick={() => execCommand('justifyLeft')} title="Align Left" className={styles.toolBtn}>
                        ⬅
                    </button>
                    <button type="button" onClick={() => execCommand('justifyCenter')} title="Align Center" className={styles.toolBtn}>
                        ⬛
                    </button>
                    <button type="button" onClick={() => execCommand('justifyRight')} title="Align Right" className={styles.toolBtn}>
                        ➡
                    </button>
                </div>

                <div className={styles.spacer} />

                <div className={styles.toolGroup}>
                    <button
                        type="button"
                        onClick={mode === 'visual' ? switchToHtml : switchToVisual}
                        className={`${styles.toolBtn} ${styles.modeBtn}`}
                    >
                        {mode === 'visual' ? '</>' : 'Visual'}
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            {mode === 'visual' ? (
                <div
                    ref={editorRef}
                    className={styles.content}
                    contentEditable
                    onInput={handleInput}
                    onPaste={handlePaste}
                    data-placeholder={placeholder}
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            ) : (
                <textarea
                    className={styles.htmlSource}
                    value={htmlSource}
                    onChange={handleHtmlChange}
                    placeholder="Enter HTML code..."
                />
            )}
        </div>
    );
}
