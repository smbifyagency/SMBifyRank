'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IntakeFormData, INDUSTRIES, WEBSITE_GOALS, DEFAULT_COLORS, ServiceInput, LocationInput, BrandColors } from '@/lib/types';
import { generateWebsiteWithAI } from '@/lib/generator';
import { saveWebsite } from '@/lib/storage';
import { getApiConfig, saveApiConfig } from '@/lib/ai';
import styles from './create.module.css';

const STEPS = ['Business Info', 'Services', 'Locations', 'Brand Colors', 'AI Settings', 'Final Details'];

export default function CreateWebsitePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generateProgress, setGenerateProgress] = useState({ message: '', progress: 0 });

    // AI Settings state
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [useAiContent, setUseAiContent] = useState(true);

    // Load saved API key on mount
    useEffect(() => {
        const config = getApiConfig();
        if (config.openaiApiKey) {
            setOpenaiApiKey(config.openaiApiKey);
        }
    }, []);

    const [formData, setFormData] = useState<IntakeFormData>({
        businessName: '',
        industry: '',
        customIndustry: '',
        services: [{ name: '', description: '' }],
        locations: [{ city: '', state: '' }],
        colors: { ...DEFAULT_COLORS },
        goal: 'leads',
        keywords: '',
        contactEmail: '',
        contactPhone: '',
        additionalPages: [],
        logoUrl: '',
    });

    const updateFormData = (updates: Partial<IntakeFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const addService = () => {
        setFormData(prev => ({
            ...prev,
            services: [...prev.services, { name: '', description: '' }],
        }));
    };

    const updateService = (index: number, updates: Partial<ServiceInput>) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.map((s, i) => i === index ? { ...s, ...updates } : s),
        }));
    };

    const removeService = (index: number) => {
        if (formData.services.length > 1) {
            setFormData(prev => ({
                ...prev,
                services: prev.services.filter((_, i) => i !== index),
            }));
        }
    };

    const addLocation = () => {
        setFormData(prev => ({
            ...prev,
            locations: [...prev.locations, { city: '', state: '' }],
        }));
    };

    const updateLocation = (index: number, updates: Partial<LocationInput>) => {
        setFormData(prev => ({
            ...prev,
            locations: prev.locations.map((l, i) => i === index ? { ...l, ...updates } : l),
        }));
    };

    const removeLocation = (index: number) => {
        if (formData.locations.length > 1) {
            setFormData(prev => ({
                ...prev,
                locations: prev.locations.filter((_, i) => i !== index),
            }));
        }
    };

    const updateColor = (key: keyof BrandColors, value: string) => {
        setFormData(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value },
        }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0:
                return formData.businessName.trim() && formData.industry;
            case 1:
                return formData.services.some(s => s.name.trim());
            case 2:
                return formData.locations.some(l => l.city.trim());
            case 3:
                return true; // Brand colors always valid
            case 4:
                return true; // AI settings always valid (API key optional)
            case 5:
                return formData.contactEmail.trim() || formData.contactPhone.trim();
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        // Save API key before generating
        if (openaiApiKey.trim()) {
            saveApiConfig({ openaiApiKey: openaiApiKey.trim() });
        }

        setIsGenerating(true);
        setGenerateProgress({ message: 'Starting website generation...', progress: 0 });

        try {
            // Filter out empty services and locations
            const cleanedData: IntakeFormData = {
                ...formData,
                services: formData.services.filter(s => s.name.trim()),
                locations: formData.locations.filter(l => l.city.trim()),
            };

            // Generate the website with AI content
            const website = await generateWebsiteWithAI(cleanedData, (message, progress) => {
                setGenerateProgress({ message, progress });
            });

            // Save to storage
            saveWebsite(website);

            // Redirect to dashboard
            router.push(`/dashboard/${website.id}`);
        } catch (error) {
            console.error('Error generating website:', error);
            alert('Failed to generate website. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <a href="/" className={styles.logo}>AI Website Builder</a>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.wizard}>
                        {/* Progress Steps */}
                        <div className={styles.progress}>
                            {STEPS.map((step, index) => (
                                <div
                                    key={step}
                                    className={`${styles.step} ${index === currentStep ? styles.active : ''} ${index < currentStep ? styles.completed : ''}`}
                                >
                                    <div className={styles.stepNumber}>{index + 1}</div>
                                    <span className={styles.stepLabel}>{step}</span>
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className={styles.stepContent}>
                            {currentStep === 0 && (
                                <div className={styles.stepPanel}>
                                    <h2>Tell us about your business</h2>
                                    <p className={styles.stepDescription}>
                                        Let&apos;s start with the basics. This information will be used throughout your website.
                                    </p>

                                    <div className={styles.formGroup}>
                                        <label>Business Name *</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="e.g., Water Damage Miami"
                                            value={formData.businessName}
                                            onChange={(e) => updateFormData({ businessName: e.target.value })}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Industry / Niche *</label>
                                        <select
                                            className={styles.select}
                                            value={formData.industry}
                                            onChange={(e) => updateFormData({ industry: e.target.value })}
                                        >
                                            <option value="">Select an industry</option>
                                            {INDUSTRIES.map(ind => (
                                                <option key={ind.value} value={ind.value}>{ind.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.industry === 'other' && (
                                        <div className={styles.formGroup}>
                                            <label>Custom Industry</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Describe your industry"
                                                value={formData.customIndustry}
                                                onChange={(e) => updateFormData({ customIndustry: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label>Website Goal</label>
                                        <div className={styles.goalCards}>
                                            {WEBSITE_GOALS.map(goal => (
                                                <div
                                                    key={goal.value}
                                                    className={`${styles.goalCard} ${formData.goal === goal.value ? styles.selected : ''}`}
                                                    onClick={() => updateFormData({ goal: goal.value })}
                                                >
                                                    <strong>{goal.label}</strong>
                                                    <span>{goal.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className={styles.stepPanel}>
                                    <h2>What services do you offer?</h2>
                                    <p className={styles.stepDescription}>
                                        Add the services your business provides. Each service will get its own dedicated page.
                                    </p>

                                    {formData.services.map((service, index) => (
                                        <div key={index} className={styles.dynamicItem}>
                                            <div className={styles.dynamicItemHeader}>
                                                <span>Service {index + 1}</span>
                                                {formData.services.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className={styles.removeBtn}
                                                        onClick={() => removeService(index)}
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Service Name *</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    placeholder="e.g., Water Damage Restoration"
                                                    value={service.name}
                                                    onChange={(e) => updateService(index, { name: e.target.value })}
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Description</label>
                                                <textarea
                                                    className={styles.textarea}
                                                    placeholder="Describe this service..."
                                                    value={service.description}
                                                    onChange={(e) => updateService(index, { description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" className={styles.addBtn} onClick={addService}>
                                        + Add Another Service
                                    </button>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className={styles.stepPanel}>
                                    <h2>Where do you provide services?</h2>
                                    <p className={styles.stepDescription}>
                                        Add the locations you serve. Each location will get its own SEO-optimized page.
                                    </p>

                                    {formData.locations.map((location, index) => (
                                        <div key={index} className={styles.dynamicItem}>
                                            <div className={styles.dynamicItemHeader}>
                                                <span>Location {index + 1}</span>
                                                {formData.locations.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className={styles.removeBtn}
                                                        onClick={() => removeLocation(index)}
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label>City *</label>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        placeholder="e.g., Miami"
                                                        value={location.city}
                                                        onChange={(e) => updateLocation(index, { city: e.target.value })}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label>State</label>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        placeholder="e.g., FL"
                                                        value={location.state}
                                                        onChange={(e) => updateLocation(index, { state: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" className={styles.addBtn} onClick={addLocation}>
                                        + Add Another Location
                                    </button>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className={styles.stepPanel}>
                                    <h2>Branding: Logo & Colors</h2>
                                    <p className={styles.stepDescription}>
                                        Add your logo and select colors that represent your brand.
                                    </p>

                                    <div className={styles.formGroup}>
                                        <label>Logo URL (optional)</label>
                                        <input
                                            type="url"
                                            className={styles.input}
                                            placeholder="https://your-logo-url.com/logo.png"
                                            value={formData.logoUrl || ''}
                                            onChange={(e) => updateFormData({ logoUrl: e.target.value })}
                                        />
                                        <span className={styles.hint}>Enter a URL to your logo image (PNG or JPG recommended)</span>
                                        {formData.logoUrl && (
                                            <div className={styles.logoPreview}>
                                                <img
                                                    src={formData.logoUrl}
                                                    alt="Logo preview"
                                                    style={{ maxHeight: '60px', maxWidth: '200px', objectFit: 'contain' }}
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Preset Color Palettes */}
                                    <div className={styles.formGroup}>
                                        <label>Quick Palettes (Click to Apply)</label>
                                        <div className={styles.palettes}>
                                            {[
                                                { name: 'Ocean Blue', primary: '#0077B6', secondary: '#00B4D8', accent: '#90E0EF' },
                                                { name: 'Forest Green', primary: '#2D6A4F', secondary: '#40916C', accent: '#52B788' },
                                                { name: 'Royal Purple', primary: '#5A189A', secondary: '#7B2CBF', accent: '#9D4EDD' },
                                                { name: 'Sunset Orange', primary: '#F94144', secondary: '#F8961E', accent: '#F9C74F' },
                                                { name: 'Modern Dark', primary: '#1A1A2E', secondary: '#16213E', accent: '#E94560' },
                                                { name: 'Clean Blue', primary: '#003049', secondary: '#023E7D', accent: '#0077B6' },
                                                { name: 'Warm Brown', primary: '#6F4E37', secondary: '#A67B5B', accent: '#D4A574' },
                                                { name: 'Tech Cyan', primary: '#0D1B2A', secondary: '#1B263B', accent: '#00D4FF' },
                                            ].map((palette) => (
                                                <button
                                                    key={palette.name}
                                                    type="button"
                                                    className={styles.paletteBtn}
                                                    onClick={() => {
                                                        updateColor('primary', palette.primary);
                                                        updateColor('secondary', palette.secondary);
                                                        updateColor('accent', palette.accent);
                                                    }}
                                                    style={{
                                                        background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 50%, ${palette.accent} 100%)`,
                                                    }}
                                                    title={palette.name}
                                                >
                                                    {palette.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.colorGrid}>
                                        <div className={styles.colorPicker}>
                                            <label>Primary Color</label>
                                            <div className={styles.colorInputWrapper}>
                                                <input
                                                    type="color"
                                                    value={formData.colors.primary}
                                                    onChange={(e) => updateColor('primary', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    className={styles.colorText}
                                                    value={formData.colors.primary}
                                                    onChange={(e) => updateColor('primary', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.colorPicker}>
                                            <label>Secondary Color</label>
                                            <div className={styles.colorInputWrapper}>
                                                <input
                                                    type="color"
                                                    value={formData.colors.secondary}
                                                    onChange={(e) => updateColor('secondary', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    className={styles.colorText}
                                                    value={formData.colors.secondary}
                                                    onChange={(e) => updateColor('secondary', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.colorPicker}>
                                            <label>Accent Color</label>
                                            <div className={styles.colorInputWrapper}>
                                                <input
                                                    type="color"
                                                    value={formData.colors.accent}
                                                    onChange={(e) => updateColor('accent', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    className={styles.colorText}
                                                    value={formData.colors.accent}
                                                    onChange={(e) => updateColor('accent', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.colorPreview}>
                                        <h4>Preview</h4>
                                        <div
                                            className={styles.previewBox}
                                            style={{
                                                background: `linear-gradient(135deg, ${formData.colors.primary} 0%, ${formData.colors.secondary} 100%)`
                                            }}
                                        >
                                            <span style={{ color: '#fff' }}>Your Brand</span>
                                            <button style={{ background: formData.colors.accent, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px' }}>
                                                Call to Action
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className={styles.stepPanel}>
                                    <h2>AI Content Generation</h2>
                                    <p className={styles.stepDescription}>
                                        Enter your OpenAI API key to generate unique, SEO-optimized content for your website.
                                        Without an API key, we&apos;ll use professional template content instead.
                                    </p>

                                    <div className={styles.aiSettingsCard}>
                                        <div className={styles.formGroup}>
                                            <label>🔑 OpenAI API Key</label>
                                            <input
                                                type="password"
                                                className={styles.input}
                                                placeholder="sk-..."
                                                value={openaiApiKey}
                                                onChange={(e) => setOpenaiApiKey(e.target.value)}
                                            />
                                            <span className={styles.hint}>
                                                Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Dashboard</a>.
                                                Your key is stored locally and never sent to our servers.
                                            </span>
                                        </div>

                                        <div className={styles.toggleGroup}>
                                            <label className={styles.toggleLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={useAiContent}
                                                    onChange={(e) => setUseAiContent(e.target.checked)}
                                                />
                                                <span className={styles.toggleSlider}></span>
                                                <span>Generate unique AI content for all pages</span>
                                            </label>
                                        </div>

                                        <div className={styles.aiInfoBox}>
                                            <h4>✨ What AI generates:</h4>
                                            <ul>
                                                <li>SEO-optimized homepage content</li>
                                                <li>Unique descriptions for each service</li>
                                                <li>Location-specific content for local SEO</li>
                                                <li>Professional about and contact page copy</li>
                                            </ul>
                                        </div>

                                        {!openaiApiKey.trim() && (
                                            <div className={styles.noKeyNotice}>
                                                <strong>📝 No API key?</strong> No problem! We&apos;ll use professional
                                                template content that you can customize later.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className={styles.stepPanel}>
                                    <h2>Final details</h2>
                                    <p className={styles.stepDescription}>
                                        Add contact information and any additional keywords for SEO.
                                    </p>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Contact Email</label>
                                            <input
                                                type="email"
                                                className={styles.input}
                                                placeholder="contact@yourbusiness.com"
                                                value={formData.contactEmail}
                                                onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Contact Phone</label>
                                            <input
                                                type="tel"
                                                className={styles.input}
                                                placeholder="(555) 123-4567"
                                                value={formData.contactPhone}
                                                onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>SEO Keywords (comma-separated)</label>
                                        <textarea
                                            className={styles.textarea}
                                            placeholder="water damage, flood restoration, mold removal..."
                                            value={formData.keywords}
                                            onChange={(e) => updateFormData({ keywords: e.target.value })}
                                        />
                                    </div>

                                    {/* Parasite Site Option */}
                                    <div className={styles.aiSettingsCard} style={{ marginTop: '1.5rem' }}>
                                        <div className={styles.toggleGroup} style={{ margin: 0, padding: '1rem' }}>
                                            <label className={styles.toggleLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isParasiteSite || false}
                                                    onChange={(e) => updateFormData({ isParasiteSite: e.target.checked })}
                                                />
                                                <span className={styles.toggleSlider}></span>
                                                <span>🔗 Parasite Site (for Backlinks)</span>
                                            </label>
                                        </div>

                                        {formData.isParasiteSite && (
                                            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                                                <label>Main Website URL (to link back to)</label>
                                                <input
                                                    type="url"
                                                    className={styles.input}
                                                    placeholder="https://yourmainwebsite.com"
                                                    value={formData.mainWebsiteUrl || ''}
                                                    onChange={(e) => updateFormData({ mainWebsiteUrl: e.target.value })}
                                                />
                                                <span className={styles.hint}>
                                                    This site will include backlinks to your main website for SEO purposes.
                                                </span>
                                            </div>
                                        )}

                                        <div className={styles.aiInfoBox} style={{ marginTop: '1rem' }}>
                                            <h4>What is a Parasite Site?</h4>
                                            <ul style={{ display: 'block' }}>
                                                <li>A separate website that links back to your main site</li>
                                                <li>Helps build domain authority and backlinks</li>
                                                <li>Great for local SEO and niche targeting</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className={styles.summary}>
                                        <h4>Summary</h4>
                                        <ul>
                                            <li><strong>Business:</strong> {formData.businessName}</li>
                                            <li><strong>Industry:</strong> {INDUSTRIES.find(i => i.value === formData.industry)?.label || formData.customIndustry}</li>
                                            <li><strong>Services:</strong> {formData.services.filter(s => s.name).map(s => s.name).join(', ')}</li>
                                            <li><strong>Locations:</strong> {formData.locations.filter(l => l.city).map(l => l.city).join(', ')}</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className={styles.navigation}>
                            <button
                                type="button"
                                className={styles.backBtn}
                                onClick={handleBack}
                                disabled={currentStep === 0}
                            >
                                ← Back
                            </button>

                            {currentStep < STEPS.length - 1 ? (
                                <button
                                    type="button"
                                    className={styles.nextBtn}
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.generateBtn}
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || isGenerating}
                                >
                                    {isGenerating ? (
                                        <div className={styles.generatingStatus}>
                                            <span className={styles.spinner}></span>
                                            <span>{generateProgress.message || 'Generating...'}</span>
                                            {generateProgress.progress > 0 && (
                                                <span className={styles.progressPercent}>{generateProgress.progress}%</span>
                                            )}
                                        </div>
                                    ) : (
                                        '🚀 Generate Website with AI'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
