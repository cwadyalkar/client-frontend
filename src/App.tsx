import { useEffect, useMemo, useState } from 'react'

type ConceptTopic = {
    id: string
    name: string
    weightage: number
    allocated_time: number
    knowledge_depth: number
    subtopics: Array<{
        id: string
        name: string
        concepts: string[]
    }>
}

type InterviewPayload = {
    userId: string
    clientId: string
    category: string
    subCategory: string
    fullName: string
    taskId: string
    sessionId: string
    interviewCategory: string
    interviewDomain: string
    duration: number
    interviewMode: string
    jobRole: string
    experience: string
    interviewDifficulty: string
    sessionStatus: string
    sessionDate: string
    createdBy: string
    isActive: boolean
    codingQuestion: object
    systemDesignQuestion: object
    topics: ConceptTopic[]
}

type SessionCreateResponse = {
    sessionId?: string
    token?: string
    livekit_url?: string
    status?: string
    message?: string
}

type EmbeddedInterviewSession = {
    sessionId: string
    token: string
    livekitUrl: string
    taskId?: string
    interviewCategory: string
    interviewMode: string
    duration: number
    jobRole: string
    interviewDifficulty: string
    sessionStatus: string
}

const defaultTopics: ConceptTopic[] = [
    {
        id: '2b68a2e7-c46c-4fdf-886c-68fe9ec9e08d',
        name: 'JavaScript Fundamentals',
        weightage: 25,
        allocated_time: 3,
        knowledge_depth: 3,
        subtopics: [
            { id: '86d5f05a-cc47-4d86-9a9a-50a5a4406ae8', name: 'Variable Scoping and Hoisting', concepts: ['Function Scope', 'Block Scope', 'Hoisting Behavior', 'Temporal Dead Zone', 'Global vs Local Scope'] },
            { id: 'a2f41755-b1a9-4a85-8ccd-0f0b9db98e06', name: 'Primitive vs Reference Types', concepts: ['Value Copying', 'Object References', 'Mutability', 'Equality Checking', 'Garbage Collection Impact'] },
            { id: '458fc767-54d1-44bd-820d-c07e7c8b96a5', name: 'Functions and Execution Context', concepts: ['Call Stack Usage', 'Lexical Environment', 'Closures', 'This Binding', 'Arrow Function Behavior'] },
            { id: '7c001990-d72e-44c7-a730-85e9ca656549', name: 'Event Loop and Asynchronous JS', concepts: ['Call Stack vs Callback Queue', 'Microtask and Macrotask', 'Promises Basics', 'setTimeout Behavior', 'Event Loop Delays'] },
            { id: 'badf1c28-95f8-4bcd-b26c-2b37032041a3', name: 'Error Handling and Debugging', concepts: ['Try-Catch Mechanism', 'Error Propagation', 'Common Runtime Errors', 'Debugging with Breakpoints', 'Stack Traces'] },
        ],
    },
    {
        id: '644308cd-f9ed-4d84-b7ea-072829b6fb1f',
        name: 'HTML and DOM Fundamentals',
        weightage: 20,
        allocated_time: 2,
        knowledge_depth: 3,
        subtopics: [
            { id: 'f772e197-8e75-4db6-80db-927c2484f6f3', name: 'HTML Structure and Semantics', concepts: ['Semantic Tags', 'Block vs Inline Elements', 'Forms and Input Types', 'Accessibility Basics', 'Document Outline'] },
            { id: '660c3a6f-f765-4a06-9e28-3d5b4b9bd960', name: 'DOM Tree and Manipulation', concepts: ['Node Types', 'Element Selection Methods', 'DOM Traversal', 'Dynamic Element Creation', 'Live vs Static Collections'] },
            { id: '8dcde209-dd38-4736-b2ec-dd7d684fb3f8', name: 'Event Handling in DOM', concepts: ['Event Capturing vs Bubbling', 'Event Delegation', 'Event Object Properties', 'Default Actions and Preventing', 'Listener Removal'] },
            { id: '43844e1d-d755-46e6-ba9c-6d6260535c39', name: 'Forms and Validation', concepts: ['Native Validation Attributes', 'Custom Validation Logic', 'Form Submission Events', 'Input State Tracking', 'Accessibility Considerations'] },
            { id: '8a29965c-5df2-4824-8ee3-0f401466384d', name: 'DOM Performance Basics', concepts: ['Reflow vs Repaint', 'Minimizing DOM Access', 'Batching DOM Updates', 'Impact of Layout Thrashing', 'Memory Leaks in DOM'] },
        ],
    },
    {
        id: 'b3224980-7d1a-475f-8da9-019322a004b3',
        name: 'CSS Fundamentals',
        weightage: 20,
        allocated_time: 2,
        knowledge_depth: 3,
        subtopics: [
            { id: 'a76b35be-864c-49f3-beab-79ae2ba22c8a', name: 'Box Model and Layout', concepts: ['Content, Padding, Border, Margin', 'Box Sizing Property', 'Block vs Inline Layout', 'Static vs Relative Positioning', 'Common Layout Pitfalls'] },
            { id: 'e5d1f339-9e45-4f5b-b343-5225f3096b7a', name: 'Selectors and Specificity', concepts: ['Type, Class, ID Selectors', 'Combinators', 'Specificity Calculation', 'Inheritance Rules', 'Overriding Styles'] },
            { id: '0358a017-8e33-4ec2-9cbc-56648ab1d289', name: 'CSS Positioning and Stacking', concepts: ['Static, Relative, Absolute, Fixed', 'z-index and Stacking Context', 'Positioning Edge Cases', 'Containing Block', 'Overflow Handling'] },
            { id: '0f585cb2-83f8-47a5-92c5-0c5225ff6d1d', name: 'Flexbox and Box Alignment', concepts: ['Flex Container Properties', 'Flex Items Behavior', 'Main vs Cross Axis', 'Flex Grow/Shrink', 'Alignment and Justification'] },
            { id: '1759fd45-0833-48d6-a83b-e172c1e2a8a9', name: 'Performance and Optimization', concepts: ['Critical CSS Path', 'Render Blocking Styles', 'Unused CSS Impact', 'CSS Overqualification', 'Minification Effects'] },
        ],
    },
    {
        id: '145623d2-7e2b-46e3-971a-8c1a0e99becf',
        name: 'Browser and Rendering Basics',
        weightage: 20,
        allocated_time: 2,
        knowledge_depth: 3,
        subtopics: [
            { id: 'b0d4415f-3f6d-40d5-96f6-f319c1a202ba', name: 'Rendering Pipeline', concepts: ['HTML Parsing', 'CSS Parsing and Style Calculation', 'Layout and Reflow', 'Paint and Composite', 'Render Blocking Resources'] },
            { id: 'c1ef1d43-9ac1-43ef-ac8f-e6ca5a5818e9', name: 'Browser Event Handling', concepts: ['Event Propagation Model', 'Asynchronous UI Updates', 'Input Event Order', 'Focus and Blur Events', 'Touch vs Mouse Events'] },
            { id: 'bb3a3ad9-5a9a-4c35-a25d-493c351671f8', name: 'Memory and Performance', concepts: ['Memory Allocation Patterns', 'Garbage Collection Triggers', 'DOM Size Impact', 'JavaScript Execution Time', 'Performance Bottlenecks'] },
            { id: 'ef7d7d5a-ede7-4752-bf5c-267c6e647b17', name: 'Network Basics', concepts: ['HTTP Request Lifecycle', 'Caching Mechanisms', 'Latency Impact', 'Resource Prioritization', 'Impact of Large Bundles'] },
            { id: '534c71df-cbe5-4b3f-86ef-836da3eacc5d', name: 'Security Fundamentals', concepts: ['Same-Origin Policy', 'Cross-Site Scripting (XSS)', 'Content Security Policy (CSP)', 'Cookie Scope and HttpOnly', 'Mixed Content Issues'] },
        ],
    },
    {
        id: '7fae5ed3-745d-49a4-a8a0-7a51ff682a25',
        name: 'Version Control and Development Workflow',
        weightage: 15,
        allocated_time: 1,
        knowledge_depth: 2,
        subtopics: [
            { id: '460809d1-0a73-43b0-b6aa-c5dd7fd41a24', name: 'Git Basics', concepts: ['Commits and Snapshots', 'Branches and Merging', 'Remote Repositories', 'Resolving Merge Conflicts', 'Staging Area'] },
            { id: 'bca23a3a-0acb-4a1a-af4e-c04c2db94a8a', name: 'Commit Practice and Message Quality', concepts: ['Atomic Commits', 'Descriptive Messages', 'Revert and Reset', 'Amend Commits', 'Avoiding Oversized Commits'] },
            { id: '03104cab-6af0-4e2f-89ab-919c4520227b', name: 'Collaboration Workflow', concepts: ['Fork and Pull Requests', 'Code Reviews', 'Continuous Integration Triggers', 'Branch Naming Conventions', 'Issue Tracking Integration'] },
            { id: 'df329af3-f7be-427b-976c-2ba036e05a2e', name: 'Basic Debugging Tools', concepts: ['Browser DevTools Usage', 'Console Debugging', 'Breakpoints and Watch Expressions', 'Network Tab Monitoring', 'Source Maps'] },
            { id: 'd7e8fdf9-fea4-4b4a-bf94-8a3d3d376fea', name: 'Package Management Basics', concepts: ['npm/Yarn Fundamentals', 'Package.json Structure', 'Semantic Versioning', 'Lock Files', 'Basic Dependency Updates'] },
        ],
    },
]

const createInitialPayload = (): InterviewPayload => ({
    userId: '62704ecf-9ef2-4915-ae04-bb79ef2b25a5',
    clientId: '',
    category: '',
    subCategory: '',
    fullName: 'Chirag Wadyalkar',
    taskId: 'e8d9ba6c-6a9c-44e2-a3e9-257d7389a95f',
    sessionId: crypto.randomUUID(),
    interviewCategory: 'Technical',
    interviewDomain: 'Product-based',
    duration: 30,
    interviewMode: 'BY_CLIENT',
    jobRole: 'Java Developer',
    experience: '0-2',
    interviewDifficulty: 'Medium',
    sessionStatus: 'New',
    sessionDate: '2026-03-07T05:45:09.395Z',
    createdBy: 'Chirag Wadyalkar',
    isActive: false,
    codingQuestion: {},
    systemDesignQuestion: {},
    topics: defaultTopics,
})

export default function App() {
    const [apiBaseUrl, setApiBaseUrl] = useState(import.meta.env.VITE_API_BASE_URL ?? 'https://dev.aceint.ai/backend/api/v1')
    const [iframeBaseUrl, setIframeBaseUrl] = useState(import.meta.env.VITE_IFRAME_BASE_URL ?? 'https://dev.aceint.ai')
    const [apiToken, setApiToken] = useState(import.meta.env.VITE_SAAS_API_TOKEN ?? '')
    const [payloadText, setPayloadText] = useState(JSON.stringify(createInitialPayload(), null, 2))
    const [isStarting, setIsStarting] = useState(false)
    const [error, setError] = useState('')
    const [sessionResponse, setSessionResponse] = useState<SessionCreateResponse | null>(null)
    const [embeddedSession, setEmbeddedSession] = useState<EmbeddedInterviewSession | null>(null)
    const [activeTab, setActiveTab] = useState<'request' | 'response'>('request')
    const [showPayload, setShowPayload] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const [isEmbedBooting, setIsEmbedBooting] = useState(false)
    const [embedCountdown, setEmbedCountdown] = useState(30)

    const iframeUrl = useMemo(() => {
        if (!embeddedSession) return ''
        const base = iframeBaseUrl.replace(/\/$/, '')
        const query = new URLSearchParams({
            ...(apiToken ? { clientToken: apiToken } : {}),
        })
        return `${base}/client/interview/${embeddedSession.sessionId}/screen?${query.toString()}`
    }, [embeddedSession, iframeBaseUrl, apiToken])
    console.log(iframeUrl)

    useEffect(() => {
        if (!embeddedSession) {
            setIsEmbedBooting(false)
            setEmbedCountdown(30)
            return
        }

        setIsEmbedBooting(true)
        setEmbedCountdown(30)

        const countdownTimer = window.setInterval(() => {
            setEmbedCountdown(prev => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        const timer = window.setTimeout(() => {
            setIsEmbedBooting(false)
        }, 30000)

        return () => {
            window.clearTimeout(timer)
            window.clearInterval(countdownTimer)
        }
    }, [embeddedSession])

    const iframeBaseWarning = useMemo(() => {
        const base = iframeBaseUrl.replace(/\/$/, '')
        const origin = window.location.origin.replace(/\/$/, '')
        if (base === origin) return 'AceInt iframe base URL is pointing to this client app. Use the aceint-web app URL (e.g. http://localhost:4000).'
        return ''
    }, [iframeBaseUrl])

    const handleRegenerateSessionId = () => {
        try {
            const parsed = JSON.parse(payloadText) as InterviewPayload
            parsed.sessionId = crypto.randomUUID()
            parsed.sessionDate = new Date().toISOString()
            setPayloadText(JSON.stringify(parsed, null, 2))
            setError('')
        } catch {
            setError('Payload JSON is invalid. Fix it before regenerating.')
        }
    }

    const handleStartInterview = async () => {
        setIsStarting(true)
        setError('')
        setSessionResponse(null)
        setEmbeddedSession(null)

        try {
            const parsed = JSON.parse(payloadText) as InterviewPayload
            if (!parsed.sessionId) parsed.sessionId = crypto.randomUUID()

            const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/saas/session/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
                },
                body: JSON.stringify(parsed),
            })

            const raw = await response.json()
            const data = raw?.data ?? raw

            if (!response.ok) throw new Error(data?.message || raw?.message || `Status ${response.status}`)

            setPayloadText(JSON.stringify(parsed, null, 2))
            setSessionResponse(data)
            setActiveTab('response')

            if (!data?.token || !data?.livekit_url) throw new Error('Session created, but token or livekit_url missing.')

            setEmbeddedSession({
                sessionId: parsed.sessionId,
                token: data.token,
                livekitUrl: data.livekit_url,
                taskId: parsed.taskId,
                interviewCategory: parsed.interviewCategory,
                interviewMode: parsed.interviewMode,
                duration: parsed.duration,
                jobRole: parsed.jobRole,
                interviewDifficulty: parsed.interviewDifficulty,
                sessionStatus: parsed.sessionStatus,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to create interview session.')
        } finally {
            setIsStarting(false)
        }
    }

    return (
        <>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0d0f12;
          --surface: #13161b;
          --surface-2: #1a1e26;
          --surface-3: #21262f;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(255,255,255,0.14);
          --accent: #4f8ef7;
          --accent-dim: rgba(79,142,247,0.12);
          --accent-hover: #6ba3f9;
          --success: #22c55e;
          --success-dim: rgba(34,197,94,0.1);
          --warning: #f59e0b;
          --warning-dim: rgba(245,158,11,0.1);
          --danger: #ef4444;
          --danger-dim: rgba(239,68,68,0.1);
          --text-primary: #f0f2f5;
          --text-secondary: #8b95a4;
          --text-tertiary: #505a68;
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 14px;
          --font: 'DM Sans', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
        }

        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        body {
          font-family: var(--font);
          background: var(--bg);
          color: var(--text-primary);
          font-size: 14px;
          line-height: 1.6;
          min-height: 100vh;
        }

        /* ── Topbar ── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          height: 56px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .topbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 15px;
          color: var(--text-primary);
        }
        .topbar-logo {
          width: 28px;
          height: 28px;
          background: var(--accent);
          border-radius: 8px;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
        }
        .topbar-badge {
          font-size: 11px;
          font-weight: 500;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid rgba(79,142,247,0.2);
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }
        .topbar-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-tertiary);
        }
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        /* ── Layout ── */
        .layout {
          display: grid;
          grid-template-columns: 480px 1fr;
          height: calc(100vh - 56px);
        }

        /* ── Left panel ── */
        .left-panel {
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-header {
          padding: 20px 24px 0;
          flex-shrink: 0;
        }
        .step-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .panel-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .panel-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: var(--surface-3) transparent;
        }

        /* ── Fields ── */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .field label {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .field input, .field textarea {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font);
          font-size: 13px;
          padding: 8px 12px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        .field input:focus, .field textarea:focus {
          border-color: var(--accent);
          background: var(--surface-3);
        }
        .field input::placeholder, .field textarea::placeholder {
          color: var(--text-tertiary);
        }
        .field textarea {
          font-family: var(--font-mono);
          font-size: 11.5px;
          line-height: 1.65;
          resize: vertical;
          min-height: 200px;
        }

        /* ── Section divider ── */
        .section-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }

        /* ── Collapsible payload header ── */
        .payload-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .payload-toggle {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 500;
          color: var(--accent);
          background: var(--accent-dim);
          border: 1px solid rgba(79,142,247,0.2);
          border-radius: 20px;
          padding: 3px 10px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          font-family: var(--font);
        }
        .payload-toggle:hover {
          background: rgba(79,142,247,0.2);
          border-color: rgba(79,142,247,0.4);
        }
        .payload-toggle-icon {
          font-size: 10px;
          transition: transform 0.2s;
          display: inline-block;
        }
        .payload-toggle-icon.open {
          transform: rotate(180deg);
        }
        .payload-body {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.2s ease;
        }
        .payload-body.visible {
          max-height: 600px;
          opacity: 1;
        }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--font);
          font-size: 13px;
          font-weight: 600;
          padding: 9px 18px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
        .btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--font);
          font-size: 12px;
          font-weight: 500;
          padding: 7px 14px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .btn-ghost:hover { border-color: var(--border-hover); color: var(--text-primary); background: var(--surface-2); }
        .btn-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--font);
          font-size: 12px;
          font-weight: 500;
          padding: 7px 14px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .btn-link:hover {
          border-color: var(--border-hover);
          color: var(--text-primary);
          background: var(--surface-2);
        }

        .action-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .action-hint {
          font-size: 11.5px;
          color: var(--text-tertiary);
        }

        /* ── Alert ── */
        .alert {
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 12.5px;
          line-height: 1.5;
        }
        .alert-error {
          background: var(--danger-dim);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5;
        }
        .alert-warning {
          background: var(--warning-dim);
          border: 1px solid rgba(245,158,11,0.2);
          color: #fcd34d;
        }

        /* ── Tabs + code preview ── */
        .preview-block {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .preview-tabs {
          display: flex;
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
        }
        .preview-tab {
          padding: 9px 16px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-tertiary);
          cursor: pointer;
          border: none;
          background: transparent;
          font-family: var(--font);
          border-bottom: 2px solid transparent;
          transition: color 0.15s;
        }
        .preview-tab:hover { color: var(--text-secondary); }
        .preview-tab.active {
          color: var(--text-primary);
          border-bottom-color: var(--accent);
        }
        .preview-body {
          background: var(--bg);
          padding: 14px;
          max-height: 220px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--surface-3) transparent;
        }
        .preview-body pre {
          font-family: var(--font-mono);
          font-size: 11px;
          line-height: 1.7;
          color: var(--text-secondary);
          white-space: pre-wrap;
          word-break: break-all;
        }
        .preview-empty {
          color: var(--text-tertiary);
          font-size: 12px;
          font-style: italic;
        }

        /* ── Right panel ── */
        .right-panel {
          background: var(--bg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .embed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .embed-header-left { display: flex; flex-direction: column; gap: 3px; }

        .embed-meta-row {
          display: flex;
          gap: 24px;
          padding: 12px 28px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .meta-item { display: flex; flex-direction: column; gap: 2px; }
        .meta-key {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-tertiary);
        }
        .meta-val {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }

        .embed-body {
          flex: 1;
          padding: 24px 28px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .iframe-wrap {
          flex: 1;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--surface);
          box-shadow: 0 0 0 1px var(--border), 0 24px 64px rgba(0,0,0,0.4);
        }
        .iframe-wrap iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .embed-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
        }
        .embed-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          display: grid;
          place-items: center;
          font-size: 26px;
        }
        .embed-empty h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .embed-empty p {
          font-size: 13px;
          color: var(--text-tertiary);
          max-width: 280px;
          line-height: 1.6;
        }

        .link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--accent);
          text-decoration: none;
          padding: 6px 12px;
          border: 1px solid rgba(79,142,247,0.25);
          border-radius: var(--radius-sm);
          transition: background 0.15s;
        }
        .link-btn:hover { background: var(--accent-dim); }

        /* ── Spinner ── */
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .help-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 200;
        }
        .help-modal {
          width: min(880px, 100%);
          max-height: min(88vh, 900px);
          overflow: auto;
          background: var(--surface);
          border: 1px solid var(--border-hover);
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
        }
        .help-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 24px 24px 18px;
          border-bottom: 1px solid var(--border);
        }
        .help-title {
          font-size: 22px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .help-subtitle {
          margin-top: 6px;
          font-size: 13px;
          color: var(--text-secondary);
          max-width: 620px;
        }
        .help-close {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 18px;
        }
        .help-close:hover {
          color: var(--text-primary);
          border-color: var(--border-hover);
        }
        .help-body {
          padding: 24px;
          display: grid;
          gap: 18px;
        }
        .help-card {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 18px;
        }
        .help-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .help-card p, .help-card li {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .help-card ol, .help-card ul {
          padding-left: 18px;
          display: grid;
          gap: 8px;
        }
        .help-code {
          margin-top: 12px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--text-primary);
          overflow-x: auto;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>

            {/* Topbar */}
            <header className="topbar">
                <div className="topbar-brand">
                    <div className="topbar-logo">A</div>
                    AceInt
                    <span className="topbar-badge">Client Embed Demo</span>
                </div>
                <div className="topbar-actions">
                    <button className="btn-link" onClick={() => setShowHelp(true)}>
                        How to use
                    </button>
                    <div className="topbar-meta">
                        <span className="status-dot" />
                        Ready
                    </div>
                </div>
            </header>

            {showHelp && (
                <div className="help-overlay" onClick={() => setShowHelp(false)}>
                    <div className="help-modal" onClick={e => e.stopPropagation()}>
                        <div className="help-header">
                            <div>
                                <div className="help-title">How to use this client embed demo</div>
                                <div className="help-subtitle">
                                    This demo creates an AceInt SaaS interview session and then opens the AceInt
                                    interview screen inside an iframe so you can test the full integration flow.
                                </div>
                            </div>
                            <button className="help-close" onClick={() => setShowHelp(false)}>×</button>
                        </div>

                        <div className="help-body">
                            <div className="help-card">
                                <h3>1. Generate the SaaS client token</h3>
                                <ol>
                                    <li>Create or use your SaaS client from the AceInt backend/admin side.</li>
                                    <li>Generate the SaaS JWT token for that client.</li>
                                    <li>Paste that token into the <strong>SaaS API bearer token</strong> field here.</li>
                                </ol>
                                <p>This token authorizes the session creation request from this demo UI.</p>
                            </div>

                            <div className="help-card">
                                <h3>2. Set the two required URLs</h3>
                                <ul>
                                    <li><strong>Backend API base URL</strong> should point to the backend exposing <code>/saas/session/create</code>.</li>
                                    <li><strong>AceInt web base URL</strong> should point to the running <code>aceint-web</code> app.</li>
                                </ul>
                                <div className="help-code">{`Example:
Backend API base URL: http://localhost:3003/api/v1
AceInt web base URL: http://localhost:4000`}</div>
                            </div>

                            <div className="help-card">
                                <h3>3. Update the session payload</h3>
                                <p>
                                    The JSON payload is the interview session data that will be stored for the interview.
                                    You can edit fields like <code>fullName</code>, <code>jobRole</code>,
                                    <code>interviewCategory</code>, <code>duration</code>, and <code>topics</code>.
                                </p>
                                <p>When you click <strong>Start interview</strong>, this page sends:</p>
                                <div className="help-code">POST /saas/session/create</div>
                            </div>

                            <div className="help-card">
                                <h3>4. What happens after clicking Start interview</h3>
                                <ol>
                                    <li>This client demo calls the AceInt SaaS create-session API.</li>
                                    <li>The backend creates and stores the interview session.</li>
                                    <li>This page receives the created session response and uses the <code>sessionId</code>.</li>
                                    <li>The iframe opens the AceInt interview screen from <code>aceint-web</code>.</li>
                                    <li>The AceInt screen fetches the session details and starts the interview.</li>
                                </ol>
                            </div>

                            <div className="help-card">
                                <h3>5. How the iframe URL works</h3>
                                <p>
                                    The iframe points to the AceInt client interview route. The session ID in the path tells
                                    AceInt which interview session to load.
                                </p>
                                <div className="help-code">{`${iframeBaseUrl.replace(/\/$/, '')}/client/interview/{sessionId}/screen`}</div>
                                <p>
                                    In this demo, the parent page is the client app and the embedded page is the AceInt interview UI.
                                </p>
                            </div>

                            <div className="help-card">
                                <h3>6. What a real client integration looks like</h3>
                                <ol>
                                    <li>Client app calls the AceInt SaaS session-create API.</li>
                                    <li>Client app gets back the session information or final iframe URL.</li>
                                    <li>Client app renders the AceInt interview screen inside an iframe.</li>
                                </ol>
                                <div className="help-code">{`<iframe
  src="${iframeBaseUrl.replace(/\/$/, '')}/client/interview/{sessionId}/screen"
  allow="camera; microphone; fullscreen"
/>`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="layout">
                {/* ── Left: Config Panel ── */}
                <aside className="left-panel">
                    <div className="panel-header">
                        <div className="step-label">Step 1</div>
                        <div className="panel-title">Configure &amp; launch session</div>
                    </div>

                    <div className="panel-scroll">

                        {/* URLs */}
                        <div className="field-group">
                            <span className="section-label">Endpoints</span>
                            <div className="field-row">
                                <div className="field">
                                    <label>Backend API base URL</label>
                                    <input
                                        value={apiBaseUrl}
                                        onChange={e => setApiBaseUrl(e.target.value)}
                                        placeholder="http://localhost:3003/api/v1"
                                    />
                                </div>
                                <div className="field">
                                    <label>AceInt web base URL</label>
                                    <input
                                        value={iframeBaseUrl}
                                        onChange={e => setIframeBaseUrl(e.target.value)}
                                        placeholder="http://localhost:4000"
                                    />
                                </div>
                            </div>
                            {iframeBaseWarning && (
                                <div className="alert alert-warning">{iframeBaseWarning}</div>
                            )}
                        </div>

                        {/* Auth */}
                        <div className="field-group">
                            <span className="section-label">Authentication</span>
                            <div className="field">
                                <label>SaaS API bearer token</label>
                                <input
                                    value={apiToken}
                                    onChange={e => setApiToken(e.target.value)}
                                    placeholder="Paste your client API token"
                                    type="password"
                                />
                            </div>
                        </div>

                        {/* Payload — collapsible */}
                        <div className="field-group">
                            <div className="payload-header">
                                <span className="section-label" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                    Session payload
                                </span>
                                <button
                                    className="payload-toggle"
                                    onClick={() => setShowPayload(v => !v)}
                                >
                                    <span className={`payload-toggle-icon ${showPayload ? 'open' : ''}`}>▼</span>
                                    {showPayload ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <div className={`payload-body ${showPayload ? 'visible' : ''}`}>
                                <div className="field">
                                    <label>JSON body — POST /saas/session/create</label>
                                    <textarea
                                        value={payloadText}
                                        onChange={e => setPayloadText(e.target.value)}
                                        rows={16}
                                        spellCheck={false}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="action-row">
                            <button
                                className="btn-primary"
                                onClick={handleStartInterview}
                                disabled={isStarting}
                            >
                                {isStarting ? (
                                    <><span className="spinner" /> Starting...</>
                                ) : (
                                    <>▶ Start interview</>
                                )}
                            </button>
                            <button className="btn-ghost" onClick={handleRegenerateSessionId}>
                                ↺ New session ID
                            </button>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}

                        {/* Request / Response preview */}
                        <div className="preview-block">
                            <div className="preview-tabs">
                                <button
                                    className={`preview-tab ${activeTab === 'request' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('request')}
                                >
                                    Request payload
                                </button>
                                <button
                                    className={`preview-tab ${activeTab === 'response' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('response')}
                                >
                                    Session response
                                    {sessionResponse && ' ✓'}
                                </button>
                            </div>
                            <div className="preview-body">
                                {activeTab === 'request' ? (
                                    <pre>{(() => { try { return JSON.stringify(JSON.parse(payloadText), null, 2) } catch { return payloadText } })()}</pre>
                                ) : sessionResponse ? (
                                    <pre>{JSON.stringify(sessionResponse, null, 2)}</pre>
                                ) : (
                                    <p className="preview-empty">No session started yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </aside>

                {/* ── Right: Embed Panel ── */}
                <main className="right-panel">
                    <div className="embed-header">
                        <div className="embed-header-left">
                            <div className="step-label">Step 2</div>
                            <div className="panel-title">Embedded interview</div>
                        </div>
                        {embeddedSession && (
                            <a className="link-btn" href={iframeUrl} target="_blank" rel="noreferrer">
                                ↗ Open in tab
                            </a>
                        )}
                    </div>

                    {embeddedSession && (
                        <div className="embed-meta-row">
                            <div className="meta-item">
                                <span className="meta-key">Session ID</span>
                                <span className="meta-val">{embeddedSession.sessionId}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-key">Job role</span>
                                <span className="meta-val">{embeddedSession.jobRole}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-key">Mode</span>
                                <span className="meta-val">{embeddedSession.interviewMode}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-key">Duration</span>
                                <span className="meta-val">{embeddedSession.duration} min</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-key">Difficulty</span>
                                <span className="meta-val">{embeddedSession.interviewDifficulty}</span>
                            </div>
                        </div>
                    )}

                    <div className="embed-body">
                        {embeddedSession ? (
                            <div className="iframe-wrap">
                                {isEmbedBooting ? (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '16px',
                                        background: 'linear-gradient(180deg, rgba(19,22,27,1) 0%, rgba(13,15,18,1) 100%)',
                                        color: 'var(--text-primary)',
                                        textAlign: 'center',
                                        padding: '24px'
                                    }}>
                                        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                                        <div>
                                            <div style={{ fontSize: 18, fontWeight: 600 }}>Preparing interview environment</div>
                                            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)', maxWidth: 420 }}>
                                                Please wait for 30 seconds while AceInt initializes the session and gets the interview screen ready.
                                            </div>
                                            <div style={{
                                                marginTop: 14,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: 88,
                                                padding: '8px 14px',
                                                borderRadius: 999,
                                                border: '1px solid rgba(79,142,247,0.25)',
                                                background: 'rgba(79,142,247,0.12)',
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: '#dbe8ff'
                                            }}>
                                                {embedCountdown}s
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <iframe
                                        title="AceInt Interview"
                                        src={iframeUrl}
                                        allow="camera; microphone; fullscreen"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="embed-empty">
                                <div className="embed-empty-icon">🎤</div>
                                <h3>No session active</h3>
                                <p>Configure your payload on the left and click <strong>Start interview</strong> to load the embedded session here.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}
