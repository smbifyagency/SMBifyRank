// Text Block Section Editor
'use client';

import React from 'react';
import { TextBlockSectionContent } from '@/lib/types';
import RichTextEditor from '@/components/RichTextEditor';
import styles from './SectionEditor.module.css';

interface TextBlockEditorProps {
    content: TextBlockSectionContent;
    onChange: (updates: Partial<TextBlockSectionContent>) => void;
}

export function TextBlockEditor({ content, onChange }: TextBlockEditorProps) {
    return (
        <div className={styles.editorFields}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Text Alignment</label>
                <div className={styles.selectButtons}>
                    <button
                        type="button"
                        className={`${styles.selectBtn} ${content.alignment === 'left' || !content.alignment ? styles.active : ''}`}
                        onClick={() => onChange({ alignment: 'left' })}
                    >
                        Left
                    </button>
                    <button
                        type="button"
                        className={`${styles.selectBtn} ${content.alignment === 'center' ? styles.active : ''}`}
                        onClick={() => onChange({ alignment: 'center' })}
                    >
                        Center
                    </button>
                    <button
                        type="button"
                        className={`${styles.selectBtn} ${content.alignment === 'right' ? styles.active : ''}`}
                        onClick={() => onChange({ alignment: 'right' })}
                    >
                        Right
                    </button>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Content
                    <span className={styles.labelHint}>Rich text - use toolbar for formatting</span>
                </label>
                <div className={styles.richTextContainer}>
                    <RichTextEditor
                        value={content.content || ''}
                        onChange={(html) => onChange({ content: html })}
                        placeholder="Enter your content..."
                    />
                </div>
            </div>
        </div>
    );
}

export default TextBlockEditor;
