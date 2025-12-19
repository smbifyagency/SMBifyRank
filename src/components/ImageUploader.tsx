'use client';

import { useState, useRef, useCallback } from 'react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
    onImageSelect: (imageUrl: string, altText: string) => void;
    onClose: () => void;
    currentImage?: string;
}

export default function ImageUploader({ onImageSelect, onClose, currentImage }: ImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [altText, setAltText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const processFile = useCallback((file: File) => {
        setError(null);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB for base64)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setPreview(result);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [processFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleUrlSubmit = () => {
        if (imageUrl.trim()) {
            setPreview(imageUrl.trim());
        }
    };

    const handleInsert = () => {
        if (preview) {
            onImageSelect(preview, altText || 'Image');
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>📷 Add Image</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'upload' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        📤 Upload
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'url' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('url')}
                    >
                        🔗 From URL
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'upload' && (
                        <div
                            className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                            />
                            <div className={styles.dropzoneContent}>
                                <span className={styles.uploadIcon}>📁</span>
                                <p>Drag & drop an image here</p>
                                <p className={styles.hint}>or click to browse</p>
                                <span className={styles.maxSize}>Max size: 5MB</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'url' && (
                        <div className={styles.urlInput}>
                            <label>Image URL</label>
                            <div className={styles.urlRow}>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className={styles.input}
                                />
                                <button onClick={handleUrlSubmit} className={styles.loadBtn}>
                                    Load
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}

                    {preview && (
                        <div className={styles.preview}>
                            <img src={preview} alt="Preview" />
                            <div className={styles.altTextInput}>
                                <label>Alt Text (for SEO)</label>
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="Describe this image for search engines"
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className={styles.insertBtn}
                        disabled={!preview}
                    >
                        ✓ Insert Image
                    </button>
                </div>
            </div>
        </div>
    );
}
