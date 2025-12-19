'use client';

import { useState } from 'react';
import { getApiConfig, isAiAvailable } from '@/lib/ai';
import styles from './blog-writer.module.css';

interface GeneratedPost {
    title: string;
    content: string;
    excerpt: string;
    status: 'pending' | 'generating' | 'done' | 'error';
    error?: string;
}

export default function BlogWriterPage() {
    const [titlesInput, setTitlesInput] = useState('');
    const [posts, setPosts] = useState<GeneratedPost[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [businessContext, setBusinessContext] = useState('');

    const hasTitles = titlesInput.trim().split('\n').filter(t => t.trim()).length > 0;

    const handleParseAndGenerate = async () => {
        if (!isAiAvailable()) {
            alert('Please set up your OpenAI API key in Settings first.');
            return;
        }

        const titles = titlesInput.trim().split('\n').filter(t => t.trim());
        if (titles.length === 0) return;

        // Initialize posts
        const initialPosts: GeneratedPost[] = titles.map(title => ({
            title: title.trim(),
            content: '',
            excerpt: '',
            status: 'pending'
        }));
        setPosts(initialPosts);
        setIsGenerating(true);

        // Generate one by one
        for (let i = 0; i < initialPosts.length; i++) {
            setCurrentIndex(i);
            setPosts(prev => prev.map((p, idx) =>
                idx === i ? { ...p, status: 'generating' } : p
            ));

            try {
                const result = await generateBlogPost(initialPosts[i].title, businessContext);
                setPosts(prev => prev.map((p, idx) =>
                    idx === i ? { ...p, ...result, status: 'done' } : p
                ));
            } catch (error) {
                setPosts(prev => prev.map((p, idx) =>
                    idx === i ? { ...p, status: 'error', error: String(error) } : p
                ));
            }
        }

        setIsGenerating(false);
    };

    const handleCopyPost = (post: GeneratedPost) => {
        const markdown = `# ${post.title}\n\n${post.content}`;
        navigator.clipboard.writeText(markdown);
        alert('Copied to clipboard!');
    };

    const handleCopyAllPosts = () => {
        const allMarkdown = posts
            .filter(p => p.status === 'done')
            .map(p => `# ${p.title}\n\n${p.content}`)
            .join('\n\n---\n\n');
        navigator.clipboard.writeText(allMarkdown);
        alert('All posts copied to clipboard!');
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>✍️ AI Blog Writer</h1>
                    <p>Generate SEO-optimized blog posts from titles. Add one title per line.</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.inputSection}>
                        <div className={styles.formGroup}>
                            <label>Business Context (Optional)</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g., Water damage restoration company in Miami"
                                value={businessContext}
                                onChange={(e) => setBusinessContext(e.target.value)}
                            />
                            <span className={styles.hint}>
                                Provide context to make articles more relevant to your business
                            </span>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Blog Titles (one per line)</label>
                            <textarea
                                className={styles.textarea}
                                placeholder={`How to Prevent Water Damage in Your Home
Signs You Need Professional Mold Remediation
10 Tips for Faster Water Damage Recovery
Why 24/7 Emergency Response Matters`}
                                value={titlesInput}
                                onChange={(e) => setTitlesInput(e.target.value)}
                                rows={8}
                            />
                            <span className={styles.hint}>
                                {titlesInput.trim().split('\n').filter(t => t.trim()).length} titles entered
                            </span>
                        </div>

                        <button
                            className={styles.generateBtn}
                            onClick={handleParseAndGenerate}
                            disabled={!hasTitles || isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Generating ({currentIndex + 1}/{posts.length})...
                                </>
                            ) : (
                                '🤖 Generate All Articles'
                            )}
                        </button>
                    </div>

                    {posts.length > 0 && (
                        <div className={styles.resultsSection}>
                            <div className={styles.resultsHeader}>
                                <h2>Generated Articles</h2>
                                {posts.some(p => p.status === 'done') && (
                                    <button
                                        className={styles.copyAllBtn}
                                        onClick={handleCopyAllPosts}
                                    >
                                        📋 Copy All
                                    </button>
                                )}
                            </div>

                            <div className={styles.postsList}>
                                {posts.map((post, index) => (
                                    <div key={index} className={styles.postCard}>
                                        <div className={styles.postHeader}>
                                            <h3>{post.title}</h3>
                                            <span className={`${styles.status} ${styles[post.status]}`}>
                                                {post.status === 'pending' && '⏳ Pending'}
                                                {post.status === 'generating' && '⚡ Generating...'}
                                                {post.status === 'done' && '✅ Done'}
                                                {post.status === 'error' && '❌ Error'}
                                            </span>
                                        </div>

                                        {post.status === 'done' && (
                                            <>
                                                <div className={styles.postExcerpt}>
                                                    {post.excerpt}
                                                </div>
                                                <div className={styles.postContent}>
                                                    <pre>{post.content.substring(0, 500)}...</pre>
                                                </div>
                                                <button
                                                    className={styles.copyBtn}
                                                    onClick={() => handleCopyPost(post)}
                                                >
                                                    📋 Copy Article
                                                </button>
                                            </>
                                        )}

                                        {post.status === 'error' && (
                                            <div className={styles.errorMessage}>
                                                {post.error}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// AI Blog Post Generation Function
async function generateBlogPost(title: string, context: string): Promise<{ content: string; excerpt: string }> {
    const config = getApiConfig();

    if (!config.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert SEO content writer. Write engaging, informative blog posts that:
- Are optimized for search engines with natural keyword usage
- Include semantic entities related to the topic
- Use proper H2 and H3 headings for structure
- Include internal linking suggestions [LINK: page-name]
- Are 800-1200 words
- Have a compelling introduction and conclusion
- Include practical tips and actionable advice

${context ? `Business Context: ${context}` : ''}`;

    const userPrompt = `Write a complete blog post with the title: "${title}"

Format the article in markdown with:
- An engaging introduction
- 3-5 main sections with H2 headings
- Practical tips or examples
- A conclusion with a call to action

Include semantic entities and related concepts naturally throughout the article.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.openaiApiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Extract first paragraph as excerpt
    const paragraphs = content.split('\n\n').filter((p: string) => p.trim() && !p.startsWith('#'));
    const excerpt = paragraphs[0]?.substring(0, 200) + '...' || '';

    return { content, excerpt };
}
