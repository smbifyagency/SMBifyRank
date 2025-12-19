'use client';

import { useState } from 'react';
import styles from './FloatingToolbar.module.css';

export interface SelectedElement {
    type: 'text' | 'image' | 'link' | 'heading' | 'button';
    content: string;
    tagName: string;
    path: string; // CSS selector path for the element
    rect: { top: number; left: number; width: number; height: number };
}

interface FloatingToolbarProps {
    element: SelectedElement;
    onTextChange: (newText: string) => void;
    onImageUpload: () => void;
    onLinkEdit: (url: string) => void;
    onDelete: () => void;
    onClose: () => void;
    containerRect: DOMRect | null;
}

export default function FloatingToolbar({
    element,
    onTextChange,
    onImageUpload,
    onLinkEdit,
    onDelete,
    onClose,
    containerRect,
}: FloatingToolbarProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(element.content);
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);

    // Calculate position relative to the viewport
    const getPosition = () => {
        if (!containerRect) return { top: 100, left: 100 };

        const top = containerRect.top + element.rect.top - 50;
        const left = containerRect.left + element.rect.left + (element.rect.width / 2);

        return {
            top: Math.max(60, top),
            left: Math.max(100, Math.min(left, window.innerWidth - 200)),
        };
    };

    const position = getPosition();

    const handleSaveText = () => {
        onTextChange(editValue);
        setIsEditing(false);
    };

    const handleSaveLink = () => {
        onLinkEdit(linkUrl);
        setShowLinkInput(false);
    };

    return (
        <div
            className={styles.toolbar}
            style={{ top: position.top, left: position.left }}
        >
            {/* Text editing mode */}
            {isEditing ? (
                <div className={styles.editMode}>
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={styles.editInput}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveText()}
                    />
                    <button onClick={handleSaveText} className={styles.saveBtn}>✓</button>
                    <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>×</button>
                </div>
            ) : showLinkInput ? (
                <div className={styles.editMode}>
                    <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className={styles.editInput}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveLink()}
                    />
                    <button onClick={handleSaveLink} className={styles.saveBtn}>✓</button>
                    <button onClick={() => setShowLinkInput(false)} className={styles.cancelBtn}>×</button>
                </div>
            ) : (
                /* Normal toolbar buttons */
                <div className={styles.buttons}>
                    {/* Text elements */}
                    {(element.type === 'text' || element.type === 'heading') && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className={styles.toolBtn}
                            title="Edit Text"
                        >
                            ✏️
                        </button>
                    )}

                    {/* Image elements */}
                    {element.type === 'image' && (
                        <button
                            onClick={onImageUpload}
                            className={styles.toolBtn}
                            title="Replace Image"
                        >
                            🖼️
                        </button>
                    )}

                    {/* Link button */}
                    {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
                        <button
                            onClick={() => setShowLinkInput(true)}
                            className={styles.toolBtn}
                            title="Add Link"
                        >
                            🔗
                        </button>
                    )}

                    {/* Delete button */}
                    <button
                        onClick={onDelete}
                        className={`${styles.toolBtn} ${styles.deleteBtn}`}
                        title="Delete Element"
                    >
                        🗑️
                    </button>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className={styles.toolBtn}
                        title="Close"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Element info */}
            <div className={styles.elementType}>
                {element.type === 'heading' ? `H${element.tagName.slice(1)}` : element.type}
            </div>
        </div>
    );
}
