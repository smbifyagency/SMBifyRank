'use client';

import { useState, useEffect } from 'react';
import styles from './DeployModal.module.css';
import { LoadingButton, SuccessCheck } from './Animations';

interface DeployModalProps {
    isOpen: boolean;
    onClose: () => void;
    siteName: string;
    siteId: string;
    existingUrl?: string;
    onDeploySuccess: (url: string) => void;
}

type DeployStatus = 'idle' | 'checking' | 'deploying' | 'success' | 'error';

export function DeployModal({
    isOpen,
    onClose,
    siteName,
    siteId,
    existingUrl,
    onDeploySuccess
}: DeployModalProps) {
    const [subdomain, setSubdomain] = useState('');
    const [status, setStatus] = useState<DeployStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [deployedUrl, setDeployedUrl] = useState('');
    const [error, setError] = useState('');

    // Generate default subdomain from site name
    useEffect(() => {
        if (siteName && !existingUrl) {
            const slug = siteName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
                .substring(0, 30);
            setSubdomain(slug);
        }
    }, [siteName, existingUrl]);

    const handleDeploy = async () => {
        if (!subdomain.trim()) {
            setError('Please enter a subdomain');
            return;
        }

        setStatus('deploying');
        setProgress(10);
        setMessage('Preparing site files...');
        setError('');

        try {
            // Simulate progress updates
            const progressSteps = [
                { progress: 20, message: 'Generating pages...' },
                { progress: 40, message: 'Uploading to Netlify...' },
                { progress: 60, message: 'Configuring domain...' },
                { progress: 80, message: 'Finalizing deployment...' },
            ];

            for (const step of progressSteps) {
                await new Promise(resolve => setTimeout(resolve, 800));
                setProgress(step.progress);
                setMessage(step.message);
            }

            // Call actual deploy API
            const response = await fetch('/api/netlify/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteId,
                    subdomain: subdomain.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Deployment failed');
            }

            setProgress(100);
            setMessage('Deployment complete!');
            setDeployedUrl(data.url || `https://${subdomain}.netlify.app`);
            setStatus('success');

            onDeploySuccess(data.url || `https://${subdomain}.netlify.app`);
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Deployment failed');
        }
    };

    const handleClose = () => {
        setStatus('idle');
        setProgress(0);
        setMessage('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <h2>🚀 Deploy to Netlify</h2>
                    <button className={styles.closeBtn} onClick={handleClose}>×</button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {status === 'idle' && (
                        <>
                            <div className={styles.siteInfo}>
                                <span className={styles.label}>Website</span>
                                <span className={styles.value}>{siteName}</span>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Choose your Netlify URL</label>
                                <div className={styles.urlInput}>
                                    <input
                                        type="text"
                                        value={subdomain}
                                        onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        placeholder="your-site-name"
                                        className={styles.input}
                                    />
                                    <span className={styles.domain}>.netlify.app</span>
                                </div>
                                {subdomain && (
                                    <p className={styles.preview}>
                                        Your site will be live at: <strong>https://{subdomain}.netlify.app</strong>
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className={styles.error}>{error}</div>
                            )}

                            <div className={styles.actions}>
                                <button className={styles.cancelBtn} onClick={handleClose}>
                                    Cancel
                                </button>
                                <LoadingButton
                                    onClick={handleDeploy}
                                    className={styles.deployBtn}
                                    loading={false}
                                >
                                    Deploy Now
                                </LoadingButton>
                            </div>
                        </>
                    )}

                    {status === 'deploying' && (
                        <div className={styles.deploying}>
                            <div className={styles.progressContainer}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className={styles.progressText}>{progress}%</span>
                            </div>
                            <p className={styles.statusMessage}>{message}</p>
                            <div className={styles.spinner} />
                        </div>
                    )}

                    {status === 'success' && (
                        <div className={styles.success}>
                            <SuccessCheck size={64} />
                            <h3>Deployment Successful! 🎉</h3>
                            <p>Your website is now live at:</p>
                            <a
                                href={deployedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.liveUrl}
                            >
                                {deployedUrl}
                            </a>
                            <button className={styles.closeSuccessBtn} onClick={handleClose}>
                                Done
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className={styles.errorState}>
                            <span className={styles.errorIcon}>❌</span>
                            <h3>Deployment Failed</h3>
                            <p className={styles.errorMessage}>{error}</p>
                            <div className={styles.actions}>
                                <button className={styles.cancelBtn} onClick={handleClose}>
                                    Close
                                </button>
                                <button className={styles.retryBtn} onClick={() => setStatus('idle')}>
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
