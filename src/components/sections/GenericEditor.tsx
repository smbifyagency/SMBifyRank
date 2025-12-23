// Generic Section Editor - Fallback for unknown section types
'use client';

import React from 'react';
import { SectionType, SectionContent } from '@/lib/types';
import styles from './SectionEditor.module.css';

interface GenericEditorProps {
    content: SectionContent | Record<string, unknown>;
    onChange: (updates: Partial<SectionContent>) => void;
    sectionType: SectionType;
}

export function GenericEditor({ content, onChange, sectionType }: GenericEditorProps) {
    const [jsonText, setJsonText] = React.useState(() =>
        JSON.stringify(content, null, 2)
    );
    const [error, setError] = React.useState<string | null>(null);

    const handleChange = (text: string) => {
        setJsonText(text);
        try {
            const parsed = JSON.parse(text);
            setError(null);
            onChange(parsed);
        } catch (e) {
            setError('Invalid JSON');
        }
    };

    return (
        <div className={styles.editorFields}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)', fontSize: '0.85rem' }}>
                Section type <strong>{sectionType}</strong> doesn't have a custom editor yet.
                You can edit the raw JSON content below.
            </p>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    JSON Content
                    {error && <span style={{ color: '#ef4444', marginLeft: 'var(--space-sm)' }}>{error}</span>}
                </label>
                <textarea
                    className={styles.textarea}
                    value={jsonText}
                    onChange={(e) => handleChange(e.target.value)}
                    style={{
                        fontFamily: 'monospace',
                        minHeight: '200px',
                        borderColor: error ? '#ef4444' : undefined
                    }}
                />
            </div>
        </div>
    );
}

export default GenericEditor;
