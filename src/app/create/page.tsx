'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IntakeFormData, INDUSTRIES, WEBSITE_GOALS, DEFAULT_COLORS, ServiceInput, LocationInput, BrandColors } from '@/lib/types';
import { generateWebsiteWithAI } from '@/lib/generator';
import { saveWebsite } from '@/lib/storage';
import styles from './create.module.css';

const STEPS = ['Business Info', 'Services', 'Locations', 'Brand Colors', 'Final Details'];

export default function CreateWebsitePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generateProgress, setGenerateProgress] = useState({ message: '', progress: 0 });

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
                return true;
            case 4:
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
