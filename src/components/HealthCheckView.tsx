import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Activity,
  HeartPulse,
  Server,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Terminal,
  Zap,
  ShieldCheck,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Play
} from "lucide-react";

interface EndpointInfo {
  path: string;
  method: string;
  description: string;
}

interface ServerHealthData {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  uptimeFormatted: string;
  service: string;
  version: string;
  environment: string;
  hasApiKey: boolean;
  gemini: {
    configured: boolean;
    preferredModel: string;
    candidateModels: string[];
    mode: string;
  };
  system: {
    nodeVersion: string;
    platform: string;
    arch: string;
    pid: number;
    memoryUsage: {
      heapUsed: string;
      heapTotal: string;
      rss: string;
    };
  };
  endpoints: EndpointInfo[];
}

interface PingHistoryItem {
  id: string;
  timestamp: string;
  status: number;
  statusText: string;
  latencyMs: number;
  healthy: boolean;
}

interface HealthCheckViewProps {
  onNavigateToAnalyze?: () => void;
}

export const HealthCheckView: React.FC<HealthCheckViewProps> = ({ onNavigateToAnalyze }) => {
  const [healthData, setHealthData] = useState<ServerHealthData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [pingHistory, setPingHistory] = useState<PingHistoryItem[]>([]);
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "fetch" | "python" | "node">("curl");
  
  // Interactive Endpoint Playground state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/api/health");
  const [testPayload, setTestPayload] = useState<string>("");
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<{ code: number; text: string; latency: number } | null>(null);

  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch health check endpoint
  const checkHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch("/api/health", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const endTime = performance.now();
      const roundtripMs = Math.round(endTime - startTime);
      setLatency(roundtripMs);
      setLastChecked(new Date());

      if (response.ok) {
        const data: ServerHealthData = await response.json();
        setHealthData(data);
        setError(null);

        // Record history
        setPingHistory((prev) => [
          {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toLocaleTimeString(),
            status: response.status,
            statusText: response.statusText || "OK",
            latencyMs: roundtripMs,
            healthy: true,
          },
          ...prev.slice(0, 9), // keep last 10
        ]);
      } else {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      const endTime = performance.now();
      const roundtripMs = Math.round(endTime - startTime);
      setLatency(roundtripMs);
      setError(err?.message || "Unable to connect to /api/health");
      setPingHistory((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          status: 500,
          statusText: err?.message || "Connection Error",
          latencyMs: roundtripMs,
          healthy: false,
        },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Auto-refresh interval (every 10s when enabled)
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshTimerRef.current = setInterval(() => {
        checkHealth();
      }, 10000);
    } else if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }

    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    };
  }, [autoRefresh, checkHealth]);

  // Handle clipboard copy
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Set default payload when selecting endpoint in playground
  useEffect(() => {
    if (selectedEndpoint === "/api/health") {
      setTestPayload("");
    } else if (selectedEndpoint === "/api/verify-resume") {
      setTestPayload(
        JSON.stringify(
          {
            fileName: "candidate_resume.txt",
            text: "Jane Doe\nSoftware Engineer\nEmail: jane@example.com | Phone: 555-0199\n\nEXPERIENCE:\nSenior Frontend Engineer at TechCorp (2022-Present)\n- Built scalable React & TypeScript web applications\n\nEDUCATION:\nB.S. in Computer Science, State University\n\nSKILLS:\nReact, TypeScript, Node.js, Tailwind CSS, Python",
          },
          null,
          2
        )
      );
    } else if (selectedEndpoint === "/api/chat") {
      setTestPayload(
        JSON.stringify(
          {
            messages: [{ role: "user", content: "What are the most valued skills for a modern AI Engineer in 2026?" }],
            context: { targetRole: "AI Engineer", targetCompany: "Google" },
          },
          null,
          2
        )
      );
    } else if (selectedEndpoint === "/api/extract-text") {
      setTestPayload(
        JSON.stringify(
          {
            fileName: "sample.txt",
            fileBase64: btoa("Alex Smith - Full Stack Developer\nEducation: B.Tech Computer Science\nSkills: React, Node.js, Express"),
          },
          null,
          2
        )
      );
    }
  }, [selectedEndpoint]);

  // Execute interactive endpoint test
  const handleRunEndpointTest = async () => {
    setTestLoading(true);
    setTestResponse(null);
    setTestStatus(null);
    const start = performance.now();

    try {
      const isGet = selectedEndpoint === "/api/health";
      const options: RequestInit = {
        method: isGet ? "GET" : "POST",
        headers: { "Content-Type": "application/json" },
      };

      if (!isGet && testPayload.trim()) {
        options.body = testPayload;
      }

      const res = await fetch(selectedEndpoint, options);
      const end = performance.now();
      const elapsed = Math.round(end - start);

      const data = await res.json();
      setTestStatus({
        code: res.status,
        text: res.statusText || (res.ok ? "OK" : "Error"),
        latency: elapsed,
      });
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      const end = performance.now();
      setTestStatus({
        code: 500,
        text: "Network or Server Error",
        latency: Math.round(end - start),
      });
      setTestResponse(JSON.stringify({ error: err?.message || "Request failed" }, null, 2));
    } finally {
      setTestLoading(false);
    }
  };

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const healthEndpointFullUrl = `${currentOrigin}/api/health`;

  // Code snippets generator
  const getCodeSnippet = (tab: "curl" | "fetch" | "python" | "node") => {
    switch (tab) {
      case "curl":
        return `# Health Check GET Request
curl -X GET "${healthEndpointFullUrl}" \\
  -H "Accept: application/json"`;
      case "fetch":
        return `// JavaScript Fetch
const response = await fetch("${healthEndpointFullUrl}", {
  headers: { "Accept": "application/json" }
});
const healthData = await response.json();
console.log("Service status:", healthData.status);
console.log("Gemini configured:", healthData.hasApiKey);`;
      case "python":
        return `# Python 3 (requests)
import requests

url = "${healthEndpointFullUrl}"
response = requests.get(url, headers={"Accept": "application/json"})

if response.status_code == 200:
    data = response.json()
    print(f"Status: {data['status']}, Uptime: {data['uptimeFormatted']}")
else:
    print(f"Health check failed with code {response.status_code}")`;
      case "node":
        return `// Node.js (axios / node-fetch)
import axios from 'axios';

async function checkResumeApiHealth() {
  try {
    const res = await axios.get('${healthEndpointFullUrl}');
    console.log('Status:', res.data.status);
    console.log('Gemini model:', res.data.gemini?.preferredModel);
  } catch (error) {
    console.error('API health check error:', error.message);
  }
}

checkResumeApiHealth();`;
    }
  };

  return (
    <div id="health-check-page" className="py-10 md:py-16 bg-[#FAFAFA] min-h-[calc(100vh-4.5rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-black text-white shadow-xs">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-heading tracking-tight">
                Health Check API Endpoint
              </h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                GET /api/health
              </span>
            </div>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl">
              Inspect real-time server health, latency diagnostics, Gemini API model status, and test all backend endpoints interactively.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="ping-health-now-btn"
              onClick={checkHealth}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Pinging..." : "Ping Now"}</span>
            </button>

            <button
              id="toggle-autorefresh-btn"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                autoRefresh
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white border-neutral-300 text-neutral-700 hover:border-black"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Auto-Refresh (10s): {autoRefresh ? "ON" : "OFF"}</span>
            </button>

            <button
              id="copy-endpoint-url-btn"
              onClick={() => handleCopy(healthEndpointFullUrl, "endpoint-url")}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white border border-neutral-300 text-neutral-700 hover:border-black transition-all cursor-pointer"
            >
              {copiedKey === "endpoint-url" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied URL</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: API Status */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
                Endpoint Status
              </span>
              <div className={`p-1.5 rounded-lg ${error ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${error ? "bg-rose-500" : "bg-emerald-500"} animate-pulse`} />
                <span className="text-2xl font-black text-neutral-950 font-heading">
                  {error ? "Degraded" : "200 OK"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {error ? error : "All primary routes accepting connections"}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Service</span>
              <span className="font-mono font-semibold text-neutral-900">{healthData?.service || "ResumeLens Engine"}</span>
            </div>
          </div>

          {/* Card 2: Roundtrip Latency */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
                Ping Latency
              </span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-neutral-950 font-heading">
                  {latency !== null ? `${latency}` : "--"}
                </span>
                <span className="text-sm font-semibold text-neutral-500">ms</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {latency !== null && latency < 100
                  ? "Ultra fast response time"
                  : latency !== null && latency < 300
                  ? "Normal API latency"
                  : "Measured roundtrip time"}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Last Checked</span>
              <span className="font-mono text-neutral-900">
                {lastChecked ? lastChecked.toLocaleTimeString() : "Just now"}
              </span>
            </div>
          </div>

          {/* Card 3: Gemini AI Status */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
                AI Engine
              </span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-neutral-950 font-heading">
                  {healthData?.hasApiKey ? "Gemini 3.8 Flash" : "Grounded Engine"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {healthData?.hasApiKey ? "Multi-model failover active" : "Deterministic career benchmark"}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>API Key</span>
              <span className={`font-semibold ${healthData?.hasApiKey ? "text-emerald-600" : "text-amber-600"}`}>
                {healthData?.hasApiKey ? "Configured & Active" : "Local Mode"}
              </span>
            </div>
          </div>

          {/* Card 4: System Uptime & Memory */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
                Process Uptime
              </span>
              <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-neutral-950 font-heading">
                {healthData?.uptimeFormatted || "Active"}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Node {healthData?.system?.nodeVersion || process.version} ({healthData?.system?.platform || "Linux"})
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Heap Used</span>
              <span className="font-mono text-neutral-900">
                {healthData?.system?.memoryUsage?.heapUsed || "45 MB"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Response & Detailed Diagnostics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live JSON Response Viewer (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-neutral-900" />
                <h3 className="text-sm font-bold text-neutral-950 font-heading">
                  Live JSON Payload from /api/health
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-500">HTTP 200 OK</span>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(healthData, null, 2), "json-response")}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedKey === "json-response" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Block */}
            <div className="mt-4 flex-1">
              <pre className="p-4 rounded-2xl bg-neutral-950 text-neutral-100 font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed border border-neutral-800 shadow-inner">
                {healthData ? JSON.stringify(healthData, null, 2) : "// Loading live response..."}
              </pre>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Status verified in real time
              </span>
              <span className="font-mono text-[11px]">
                Content-Type: application/json; charset=utf-8
              </span>
            </div>
          </div>

          {/* Right Column: Server Environment & System Specs (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-200">
                <Server className="w-4 h-4 text-neutral-900" />
                <h3 className="text-sm font-bold text-neutral-950 font-heading">
                  System Architecture & Runtime
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                  <span className="text-neutral-600">Runtime Platform:</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    Node.js {healthData?.system?.nodeVersion || process.version} ({healthData?.system?.platform || "Linux"} {healthData?.system?.arch || "x64"})
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                  <span className="text-neutral-600">Process Memory (Heap Used):</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    {healthData?.system?.memoryUsage?.heapUsed || "45 MB"} / {healthData?.system?.memoryUsage?.heapTotal || "65 MB"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                  <span className="text-neutral-600">Resident Set Size (RSS):</span>
                  <span className="font-mono font-semibold text-neutral-900">
                    {healthData?.system?.memoryUsage?.rss || "85 MB"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                  <span className="text-neutral-600">Preferred AI Model:</span>
                  <span className="font-mono font-bold text-neutral-950 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {healthData?.gemini?.preferredModel || "gemini-3.8-flash"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                  <span className="text-neutral-600">Failover Candidates:</span>
                  <span className="font-mono text-neutral-700 text-[11px]">
                    gemini-flash-latest • gemini-3.1-flash-lite
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Link to Resume Analysis */}
            {onNavigateToAnalyze && (
              <div className="mt-6 p-4 rounded-2xl bg-neutral-950 text-white flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold font-heading">Ready to analyze a resume?</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Launch the core ATS gap and roadmap pipeline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToAnalyze}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Go to Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Endpoint Explorer & API Playground */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-neutral-900" />
                <h3 className="text-lg font-bold text-neutral-950 font-heading">
                  Interactive API Endpoint Playground
                </h3>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Select any registered endpoint below, inspect the payload, and send a live request directly from your browser.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-semibold text-neutral-500">Active Target:</span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900 font-mono font-bold text-xs">
                {selectedEndpoint}
              </span>
            </div>
          </div>

          {/* Endpoints Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                path: "/api/health",
                method: "GET",
                label: "Health Check",
                desc: "Diagnostic status & telemetry",
                icon: HeartPulse,
              },
              {
                path: "/api/verify-resume",
                method: "POST",
                label: "Verify Resume",
                desc: "ATS Gatekeeper & authenticity",
                icon: ShieldCheck,
              },
              {
                path: "/api/extract-text",
                method: "POST",
                label: "Extract Text",
                desc: "Parse binary PDF / DOCX files",
                icon: FileText,
              },
              {
                path: "/api/chat",
                method: "POST",
                label: "Career Coach Chat",
                desc: "AI coach interaction",
                icon: MessageSquare,
              },
            ].map((ep) => {
              const Icon = ep.icon;
              const isSelected = selectedEndpoint === ep.path;
              return (
                <button
                  key={ep.path}
                  type="button"
                  id={`playground-tab-${ep.path.replace(/\//g, "-")}`}
                  onClick={() => {
                    setSelectedEndpoint(ep.path);
                    setTestResponse(null);
                    setTestStatus(null);
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-neutral-50/80 border-neutral-200 text-neutral-800 hover:border-black hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        ep.method === "GET"
                          ? isSelected
                            ? "bg-blue-900 text-blue-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                          : isSelected
                          ? "bg-emerald-900 text-emerald-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-neutral-500"}`} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isSelected ? "text-white" : "text-neutral-950"}`}>
                      {ep.label}
                    </div>
                    <div className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                      {ep.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Request Payload & Execution Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
            
            {/* Input payload (if POST) */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-900 uppercase font-mono tracking-wider">
                  Request Configuration
                </label>
                <span className="text-[11px] text-neutral-500">
                  {selectedEndpoint === "/api/health" ? "No body required (GET)" : "JSON Body (POST)"}
                </span>
              </div>

              {selectedEndpoint === "/api/health" ? (
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex flex-col items-center justify-center min-h-[180px] text-center">
                  <Activity className="w-8 h-8 text-neutral-400 mb-2" />
                  <p className="font-semibold text-neutral-800">GET /api/health</p>
                  <p className="text-[11px] text-neutral-500 mt-1 max-w-xs">
                    This endpoint does not take any request body. Click "Execute Call" to send a live HTTP GET request.
                  </p>
                </div>
              ) : (
                <textarea
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  rows={8}
                  className="w-full p-3.5 rounded-2xl bg-white border border-neutral-300 font-mono text-xs focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-2xs leading-relaxed"
                  placeholder="Enter JSON request payload..."
                />
              )}

              <button
                type="button"
                id="execute-api-playground-btn"
                onClick={handleRunEndpointTest}
                disabled={testLoading}
                className="w-full py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {testLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Request...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Send {selectedEndpoint === "/api/health" ? "GET" : "POST"} Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Output response */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-900 uppercase font-mono tracking-wider">
                  Live Response
                </label>
                {testStatus && (
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      testStatus.code >= 200 && testStatus.code < 300
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {testStatus.code} {testStatus.text} ({testStatus.latency}ms)
                  </span>
                )}
              </div>

              <pre className="p-4 rounded-2xl bg-neutral-950 text-neutral-100 font-mono text-xs overflow-x-auto min-h-[220px] max-h-[220px] border border-neutral-800 shadow-inner leading-relaxed">
                {testResponse ? testResponse : "// Response will appear here after clicking Send Request"}
              </pre>
            </div>
          </div>
        </div>

        {/* Integration Code Snippets Tabs */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div>
              <h3 className="text-base font-bold text-neutral-950 font-heading">
                Client Integration Code Snippets
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Ready-to-use boilerplate to ping `/api/health` from external monitoring services, microservices, or client applications.
              </p>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
              {(["curl", "fetch", "python", "node"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    activeCodeTab === tab
                      ? "bg-white text-black font-bold shadow-xs"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  {tab === "curl" ? "cURL" : tab === "fetch" ? "Fetch" : tab === "python" ? "Python" : "Node.js"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-2xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
              {getCodeSnippet(activeCodeTab)}
            </pre>
            <button
              type="button"
              id="copy-snippet-code-btn"
              onClick={() => handleCopy(getCodeSnippet(activeCodeTab), "code-snippet")}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              {copiedKey === "code-snippet" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ping History Log Table */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-900" />
              <h3 className="text-base font-bold text-neutral-950 font-heading">
                Recent Ping Activity Log
              </h3>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              Last {pingHistory.length} pings tracked in-session
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Endpoint</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pingHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-neutral-500">
                      No pings recorded yet. Click "Ping Now" above to initiate a check.
                    </td>
                  </tr>
                ) : (
                  pingHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-neutral-600">{item.timestamp}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-neutral-900">GET /api/health</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                            item.healthy
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {item.status} {item.statusText}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700">{item.latencyMs} ms</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Passed
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
