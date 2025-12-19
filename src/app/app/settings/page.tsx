'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './settings.module.css';

interface ApiConfig {
    netlifyToken: string;
    openaiApiKey: string;
    openrouterApiKey: string;
    agentrouterApiKey: string;
}

interface TestResults {
    netlify: 'idle' | 'testing' | 'success' | 'error';
    openai: 'idle' | 'testing' | 'success' | 'error';
    openrouter: 'idle' | 'testing' | 'success' | 'error';
    agentrouter: 'idle' | 'testing' | 'success' | 'error';
}

export default function SettingsPage() {
    const [config, setConfig] = useState<ApiConfig>({
        netlifyToken: '',
        openaiApiKey: '',
        openrouterApiKey: '',
        agentrouterApiKey: '',
    });

    const [testResults, setTestResults] = useState<TestResults>({
        netlify: 'idle',
        openai: 'idle',
        openrouter: 'idle',
        agentrouter: 'idle',
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load saved config from localStorage
        const savedConfig = localStorage.getItem('api-config');
        if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('api-config', JSON.stringify(config));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const testNetlify = async () => {
        if (!config.netlifyToken) return;
        setTestResults(prev => ({ ...prev, netlify: 'testing' }));
        try {
            const res = await fetch('https://api.netlify.com/api/v1/user', {
                headers: { Authorization: `Bearer ${config.netlifyToken}` },
            });
            setTestResults(prev => ({ ...prev, netlify: res.ok ? 'success' : 'error' }));
        } catch {
            setTestResults(prev => ({ ...prev, netlify: 'error' }));
        }
    };

    const testOpenAI = async () => {
        if (!config.openaiApiKey) return;
        setTestResults(prev => ({ ...prev, openai: 'testing' }));
        try {
            const res = await fetch('https://api.openai.com/v1/models', {
                headers: { Authorization: `Bearer ${config.openaiApiKey}` },
            });
            setTestResults(prev => ({ ...prev, openai: res.ok ? 'success' : 'error' }));
        } catch {
            setTestResults(prev => ({ ...prev, openai: 'error' }));
        }
    };

    const testOpenRouter = async () => {
        if (!config.openrouterApiKey) return;
        setTestResults(prev => ({ ...prev, openrouter: 'testing' }));
        try {
            const res = await fetch('https://openrouter.ai/api/v1/models', {
                headers: { Authorization: `Bearer ${config.openrouterApiKey}` },
            });
            setTestResults(prev => ({ ...prev, openrouter: res.ok ? 'success' : 'error' }));
        } catch {
            setTestResults(prev => ({ ...prev, openrouter: 'error' }));
        }
    };

    const testAgentRouter = async () => {
        if (!config.agentrouterApiKey) return;
        setTestResults(prev => ({ ...prev, agentrouter: 'testing' }));
        // AgentRouter test - since we don't have a specific endpoint, we'll simulate
        try {
            // Placeholder test - adjust when actual AgentRouter API is known
            setTimeout(() => {
                setTestResults(prev => ({ ...prev, agentrouter: config.agentrouterApiKey.length > 10 ? 'success' : 'error' }));
            }, 500);
        } catch {
            setTestResults(prev => ({ ...prev, agentrouter: 'error' }));
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'testing': return '⏳';
            case 'success': return '✅';
            case 'error': return '❌';
            default: return '🔌';
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'success': return styles.success;
            case 'error': return styles.error;
            case 'testing': return styles.testing;
            default: return '';
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/app" className={styles.backLink}>← Back to Dashboard</Link>
                    <h1>API Settings</h1>
                    <p>Configure your API keys for deployment and AI features</p>
                </div>

                <div className={styles.cards}>
                    {/* Netlify */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>🚀</div>
                            <div>
                                <h3>Netlify</h3>
                                <p>Deploy websites to Netlify</p>
                            </div>
                            <span className={`${styles.status} ${getStatusClass(testResults.netlify)}`}>
                                {getStatusIcon(testResults.netlify)}
                            </span>
                        </div>
                        <div className={styles.cardBody}>
                            <label>Personal Access Token</label>
                            <div className={styles.inputRow}>
                                <input
                                    type="password"
                                    placeholder="nfp_xxxxxxxxxxxxxxxx"
                                    value={config.netlifyToken}
                                    onChange={(e) => setConfig(prev => ({ ...prev, netlifyToken: e.target.value }))}
                                />
                                <button onClick={testNetlify} disabled={!config.netlifyToken}>
                                    Test
                                </button>
                            </div>
                            <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>
                                Get your token →
                            </a>
                        </div>
                    </div>

                    {/* OpenAI */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>🤖</div>
                            <div>
                                <h3>OpenAI</h3>
                                <p>Generate AI content with GPT</p>
                            </div>
                            <span className={`${styles.status} ${getStatusClass(testResults.openai)}`}>
                                {getStatusIcon(testResults.openai)}
                            </span>
                        </div>
                        <div className={styles.cardBody}>
                            <label>API Key</label>
                            <div className={styles.inputRow}>
                                <input
                                    type="password"
                                    placeholder="sk-xxxxxxxxxxxxxxxx"
                                    value={config.openaiApiKey}
                                    onChange={(e) => setConfig(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                                />
                                <button onClick={testOpenAI} disabled={!config.openaiApiKey}>
                                    Test
                                </button>
                            </div>
                            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>
                                Get your API key →
                            </a>
                        </div>
                    </div>

                    {/* OpenRouter */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>🔄</div>
                            <div>
                                <h3>OpenRouter</h3>
                                <p>Access multiple AI models</p>
                            </div>
                            <span className={`${styles.status} ${getStatusClass(testResults.openrouter)}`}>
                                {getStatusIcon(testResults.openrouter)}
                            </span>
                        </div>
                        <div className={styles.cardBody}>
                            <label>API Key</label>
                            <div className={styles.inputRow}>
                                <input
                                    type="password"
                                    placeholder="sk-or-xxxxxxxxxxxxxxxx"
                                    value={config.openrouterApiKey}
                                    onChange={(e) => setConfig(prev => ({ ...prev, openrouterApiKey: e.target.value }))}
                                />
                                <button onClick={testOpenRouter} disabled={!config.openrouterApiKey}>
                                    Test
                                </button>
                            </div>
                            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className={styles.helpLink}>
                                Get your API key →
                            </a>
                        </div>
                    </div>

                    {/* AgentRouter */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>🤝</div>
                            <div>
                                <h3>AgentRouter</h3>
                                <p>AI agent orchestration</p>
                            </div>
                            <span className={`${styles.status} ${getStatusClass(testResults.agentrouter)}`}>
                                {getStatusIcon(testResults.agentrouter)}
                            </span>
                        </div>
                        <div className={styles.cardBody}>
                            <label>API Key</label>
                            <div className={styles.inputRow}>
                                <input
                                    type="password"
                                    placeholder="ar-xxxxxxxxxxxxxxxx"
                                    value={config.agentrouterApiKey}
                                    onChange={(e) => setConfig(prev => ({ ...prev, agentrouterApiKey: e.target.value }))}
                                />
                                <button onClick={testAgentRouter} disabled={!config.agentrouterApiKey}>
                                    Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleSave} className={styles.saveBtn}>
                        {saved ? '✅ Saved!' : '💾 Save All Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
