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
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const editorRef = useRef<HTMLDivElement>(null);
    const savedSelectionRef = useRef<Range | null>(null);

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

    // Insert link with modal
    const openLinkModal = () => {
        // Save current selection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
            // Get selected text for link text
            const selectedText = selection.toString();
            setLinkText(selectedText);
        }
        setLinkUrl('');
        setShowLinkModal(true);
    };

    const insertLinkFromModal = () => {
        if (!linkUrl.trim()) return;

        const text = linkText.trim() || linkUrl;
        const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;

        // Focus the editor first
        if (editorRef.current) {
            editorRef.current.focus();
        }

        // Use direct DOM manipulation instead of deprecated execCommand
        const selection = window.getSelection();

        // Restore the saved selection if available
        if (savedSelectionRef.current) {
            selection?.removeAllRanges();
            selection?.addRange(savedSelectionRef.current);
        }

        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // Create the link element
            const linkElement = document.createElement('a');
            linkElement.href = url;
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';

            if (range.toString().length > 0) {
                // There's selected text - wrap it with the link
                try {
                    range.surroundContents(linkElement);
                } catch {
                    // If surroundContents fails (e.g., selection crosses element boundaries),
                    // fall back to extracting and inserting
                    const contents = range.extractContents();
                    linkElement.appendChild(contents);
                    range.insertNode(linkElement);
                }
            } else {
                // No selection - insert new link with text
                linkElement.textContent = text;
                range.deleteContents();
                range.insertNode(linkElement);

                // Move cursor after the link
                range.setStartAfter(linkElement);
                range.setEndAfter(linkElement);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        // Trigger onChange to persist the change
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }

        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
        savedSelectionRef.current = null;
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
                    <button type="button" onClick={openLinkModal} title="Insert Link" className={styles.toolBtn}>
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

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <button type="button" onClick={() => execCommand('undo')} title="Undo" className={styles.toolBtn}>
                        ↩
                    </button>
                    <button type="button" onClick={() => execCommand('redo')} title="Redo" className={styles.toolBtn}>
                        ↪
                    </button>
                    <button type="button" onClick={() => execCommand('removeFormat')} title="Clear Formatting" className={styles.toolBtn}>
                        ✗
                    </button>
                </div>

                <div className={styles.spacer} />

                <div className={styles.toolGroup}>
                    <span className={styles.wordCount}>
                        {value ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w).length : 0} words
                    </span>
                </div>

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

            {/* Link Modal */}
            {showLinkModal && (
                <div className={styles.linkModalOverlay} onClick={() => setShowLinkModal(false)}>
                    <div className={styles.linkModal} onClick={e => e.stopPropagation()}>
                        <h3>Insert Link</h3>
                        <div className={styles.linkField}>
                            <label>URL</label>
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={e => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                autoFocus
                            />
                        </div>
                        <div className={styles.linkField}>
                            <label>Link Text (optional)</label>
                            <input
                                type="text"
                                value={linkText}
                                onChange={e => setLinkText(e.target.value)}
                                placeholder="Click here"
                            />
                        </div>
                        <div className={styles.linkActions}>
                            <button type="button" onClick={() => setShowLinkModal(false)} className={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button type="button" onClick={insertLinkFromModal} className={styles.insertBtn}>
                                Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
