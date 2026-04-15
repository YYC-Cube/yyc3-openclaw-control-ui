# AI-Assisted Translation Workflow
## YYC³ Internationalization Framework - Phase 5

---

## 🎯 Overview

This document outlines the AI-assisted translation workflow designed to accelerate and improve the quality of OpenClaw's internationalization efforts while maintaining human oversight for cultural accuracy.

---

## 📋 Workflow Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Source Text    │────▶│  AI Translation │────▶│  Human Review   │
│  (en/zh-CN)     │     │  (LLM + Rules)  │     │  (Quality Gate) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  Community       │
                                               │  Feedback Loop   │
                                               └─────────────────┘
```

---

## 🔧 Phase 1: AI Pre-Translation

### 1.1 Context-Aware Translation Prompts

**System Prompt Template:**
```
You are a professional translator specializing in software localization.
Translate the following text from {source_lang} to {target_lang}.

Context:
- Product: OpenClaw (Personal AI Assistant Gateway)
- Component: {component_name} (e.g., CLI, Control UI, Error Messages)
- Audience: {audience_description}
- Character Limit: {max_chars if applicable}

Guidelines:
1. Maintain technical accuracy while ensuring natural phrasing
2. Preserve UI element constraints (button labels, tooltips)
3. Use culturally appropriate expressions
4. Keep placeholders like {{variable}} unchanged
5. For CJK languages: use appropriate character forms (Simplified/Traditional)
6. For RTL languages: consider reading direction in layout hints

Terminology:
{terminology_list}

Source Text:
"{source_text}"

Translation:
```

**Example Usage:**
```typescript
interface TranslationRequest {
  sourceText: string;
  sourceLocale: string;
  targetLocale: string;
  context: {
    component: 'cli' | 'ui' | 'error' | 'docs';
    maxLength?: number;
    isUIElement?: boolean;
    terminology?: Record<string, string>;
  };
}

async function translateWithAI(request: TranslationRequest): Promise<string> {
  const prompt = buildTranslationPrompt(request);
  
  // Call LLM API with retry logic
  const translation = await callLLMWithRetry(prompt, {
    maxRetries: 3,
    temperature: 0.3, // Lower temperature for consistency
    maxTokens: request.context.maxLength ? 
      Math.min(request.context.maxLength * 2, 500) : 200
  });
  
  return sanitizeTranslation(translation, request);
}
```

### 1.2 Terminology Management

**Automated Terminology Extraction:**
```typescript
// Extract key terms from existing translations
function extractTerminology(
  translations: Record<string, TranslationMap>
): Map<string, Set<string>> {
  const terms = new Map<string, Set<string>>();
  
  // Identify recurring technical terms
  const patterns = [
    /\b(gateway|channel|agent|model|config)\b/gi,
    /\b(start|stop|restart|status)\b/gi,
    /\b(error|warning|success|info)\b/gi
  ];
  
  for (const [locale, trans] of Object.entries(translations)) {
    const localeTerms = new Set<string>();
    
    patterns.forEach(pattern => {
      const matches = JSON.stringify(trans).match(pattern) || [];
      matches.forEach(match => localeTerms.add(match.toLowerCase()));
    });
    
    terms.set(locale, localeTerms);
  }
  
  return terms;
}

// Build context-aware glossary
function buildGlossary(): GlossaryEntry[] {
  return [
    {
      term: "Gateway",
      translations: {
        "zh-CN": "网关",
        "ja": "ゲートウェイ",
        "ko": "게이트웨이",
        "fr": "Passerelle",
        "ar": "بوابة"
      },
      context: "Core infrastructure component",
      partOfSpeech: "noun",
      approved: true
    },
    {
      term: "Channel",
      translations: {
        "zh-CN": "频道",
        "ja": "チャンネル",
        "ko": "채널",
        "fr": "Canal",
        "ar": "قناة"
      },
      context: "Message integration platform",
      partOfSpeech: "noun",
      approved: true
    }
  ];
}
```

---

## ✅ Phase 2: Quality Assurance Pipeline

### 2.1 Automated Quality Checks

```typescript
interface QualityCheckResult {
  score: number; // 0-100
  issues: QualityIssue[];
  passed: boolean;
}

interface QualityIssue {
  severity: 'error' | 'warning' | 'info';
  type: 'length' | 'placeholder' | 'consistency' | 'grammar' | 'cultural';
  message: string;
  suggestion?: string;
}

async function runQualityChecks(
  original: string,
  translated: string,
  targetLocale: string
): Promise<QualityCheckResult> {
  const issues: QualityIssue[] = [];
  let score = 100;
  
  // Check 1: Placeholder preservation
  const originalPlaceholders = extractPlaceholders(original);
  const translatedPlaceholders = extractPlaceholders(translated);
  
  if (!arraysEqual(originalPlaceholders, translatedPlaceholders)) {
    issues.push({
      severity: 'error',
      type: 'placeholder',
      message: 'Placeholder mismatch detected',
      suggestion: `Ensure all ${originalPlaceholders.join(', ')} are present`
    });
    score -= 30;
  }
  
  // Check 2: Length constraints for UI elements
  if (isUIElement(original) && translated.length > MAX_UI_LENGTH) {
    issues.push({
      severity: 'warning',
      type: 'length',
      message: `Translation too long (${translated.length}/${MAX_UI_LENGTH} chars)`
    });
    score -= 10;
  }
  
  // Check 3: Consistency with existing translations
  const consistencyIssues = await checkConsistency(translated, targetLocale);
  issues.push(...consistencyIssues);
  score -= consistencyIssues.length * 5;
  
  // Check 4: Cultural appropriateness (AI-based)
  const culturalScore = await assessCulturalFit(original, translated, targetLocale);
  if (culturalScore < 70) {
    issues.push({
      severity: 'warning',
      type: 'cultural',
      message: 'Potential cultural adaptation issue detected'
    });
    score -= 15;
  }
  
  return {
    score: Math.max(0, score),
    issues,
    passed: score >= 80 // YYC³ Standard threshold
  };
}
```

### 2.2 Human Review Integration

**Review Interface Requirements:**

```typescript
interface ReviewTask {
  id: string;
  sourceText: string;
  aiTranslation: string;
  targetLocale: string;
  context: TranslationContext;
  aiConfidence: number; // 0-1
  qualityCheckResult: QualityCheckResult;
  reviewerNotes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'revised';
  revisionHistory?: Revision[];
}

// Review workflow states
type ReviewStatus = 
  | { status: 'pending'; assignedTo?: string }
  | { status: 'in_review'; reviewer: string; startedAt: Date }
  | { status: 'approved'; reviewer: string; approvedAt: Date }
  | { status: 'rejected'; reason: string; rejectedAt: Date }
  | { status: 'revised'; revisedBy: string; newTranslation: string };
```

---

## 🔄 Phase 3: Continuous Improvement Loop

### 3.1 Feedback Collection System

```typescript
interface UserFeedback {
  id: string;
  translationKey: string;
  locale: string;
  originalText: string;
  currentTranslation: string;
  suggestedImprovement?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  context: {
    page: string;
    component: string;
    userAgent: string;
    timestamp: Date;
  };
}

// Collect feedback via UI widget
class TranslationFeedbackCollector {
  private feedbackQueue: UserFeedback[] = [];
  
  async collectFeedback(feedback: UserFeedback): Promise<void> {
    this.feedbackQueue.push(feedback);
    
    // Batch submit every 10 items or 5 minutes
    if (this.feedbackQueue.length >= 10) {
      await this.submitBatch();
    }
  }
  
  private async submitBatch(): Promise<void> {
    const batch = [...this.feedbackQueue];
    this.feedbackQueue = [];
    
    await sendToAnalytics(batch);
    await updateTranslationMetrics(batch);
  }
  
  generateFeedbackWidget(translationKey: string): HTMLElement {
    // Create inline feedback UI
    return createHTMLElement(`
      <div class="translation-feedback" data-key="${translationKey}">
        <span class="feedback-trigger">📝</span>
        <div class="feedback-panel">
          <p>Is this translation accurate?</p>
          <div class="rating-stars">
            ${[1,2,3,4,5].map(n => 
              `<button data-rating="${n}">★</button>`
            ).join('')}
          </div>
          <textarea placeholder="Suggest improvement..."></textarea>
          <button onclick="submitFeedback()">Submit</button>
        </div>
      </div>
    `);
  }
}
```

### 3.2 Machine Learning from Corrections

```typescript
// When a human revises an AI translation, learn from it
async function learnFromRevision(
  original: string,
  aiTranslation: string,
  humanRevision: string,
  targetLocale: string
): Promise<void> {
  
  // Extract the difference pattern
  const diff = calculateDiff(aiTranslation, humanRevision);
  
  // Update translation memory for future reference
  await updateTranslationMemory({
    pattern: diff.pattern,
    correction: diff.correction,
    locale: targetLocale,
    confidence: 0.9, // High confidence from human input
    source: 'human_revision'
  });
  
  // If systematic error detected, update prompts
  if (diff.isSystematic) {
    await updateTranslationPromptRules(diff.rule);
  }
  
  // Log for analytics
  logRevisionAnalytics({
    originalLength: original.length,
    aiLength: aiTranslation.length,
    humanLength: humanRevision.length,
    changeType: diff.type,
    timeSaved: estimateTimeSaved()
  });
}
```

---

## 📊 Phase 4: Metrics & Analytics

### 4.1 Key Performance Indicators

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Translation Coverage** | >95% keys per locale | Automated scanning |
| **Human Review Rate** | >80% of AI translations | Review workflow tracking |
| **User Satisfaction** | >4.2/5 rating | Feedback system |
| **Revision Rate** | <15% of AI output | Comparison with final |
| **Time to Publish** | <48h for updates | CI/CD pipeline metrics |
| **Consistency Score** | >90% across modules | Terminology checker |

### 4.2 Dashboard Integration

```typescript
interface I18nDashboardData {
  overview: {
    totalLocales: number;
    totalKeys: number;
    averageCoverage: number;
    lastUpdated: Date;
  };
  byLocale: LocaleStats[];
  recentActivity: ActivityItem[];
  qualityTrend: TrendData[];
}

// Generate weekly i18n report
async function generateWeeklyReport(): Promise<I18nDashboardData> {
  const locales = getSupportedLocales();
  
  const stats = await Promise.all(locales.map(async (locale) => ({
    locale,
    coverage: calculateCoverage(locale),
    reviewRate: await getReviewRate(locale),
    userRating: await getUserSatisfaction(locale),
    pendingRevisions: countPendingRevisions(locale)
  })));
  
  return {
    overview: {
      totalLocales: locales.length,
      totalKeys: getTotalKeyCount(),
      averageCoverage: stats.reduce((a, b) => a + b.coverage, 0) / locales.length,
      lastUpdated: new Date()
    },
    byLocale: stats,
    recentActivity: await getRecentTranslationActivity(),
    qualityTrend: await getQualityTrend(30) // Last 30 days
  };
}
```

---

## 🚀 Implementation Roadmap

### Week 1-2: Foundation
- [ ] Set up Crowdin integration with automated sync
- [ ] Implement AI translation API integration
- [ ] Create terminology database
- [ ] Develop initial prompt templates

### Week 3-4: Quality Gates
- [ ] Build automated quality check pipeline
- [ ] Create human review interface
- [ ] Integrate feedback collection widget
- [ ] Establish review workflow in project management tool

### Month 2: Optimization
- [ ] Train custom translation model on domain data
- [ ] Implement continuous learning loop
- [ ] Deploy i18n dashboard
- [ ] Optimize based on initial metrics

### Ongoing: Maintenance
- [ ] Weekly terminology reviews
- [ ] Monthly quality audits
- [ ] Quarterly community translation sprints
- [ ] Bi-annual comprehensive reviews

---

## 📚 Resources & References

### Tools & Services
- **Crowdin**: https://crowdin.com (Primary translation platform)
- **DeepL API**: https://www.deepl.com/pro-api (Machine translation)
- **Google Cloud Translation**: https://cloud.google.com/translate (Alternative MT)
- **Lokalise**: https://lokalise.com (Alternative TMS)

### Best Practices
- [W3C i18n Best Practices](https://www.w3.org/International/)
- [Mozilla Localization Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Localization)
- [Unicode CLDR](http://cldr.unicode.org/) (Locale data)

### YYC³ Compliance Checklist
- ✅ All translations follow naming conventions
- ✅ RTL support implemented for Arabic locales
- ✅ Performance impact <20ms on startup
- ✅ Test coverage >80% for critical paths
- ✅ Documentation updated for all changes
- ✅ Community contribution process documented

---

*Last Updated: 2026-04-10*
*Version: 1.0.0*
*Framework: YYC³ Standardization Audit Expert*
