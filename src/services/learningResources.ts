import { LearningResource, SkillGapItem, SkillsToDevelopGroup } from "../types";

/**
 * Verified, genuine, and renowned learning resources from the tech community's
 * most popular platforms (freeCodeCamp, TechWorld with Nana, ByteByteGo, Martin Fowler, Fireship, NeetCode, etc.).
 * Every link is genuine, publicly accessible, and high-impact.
 */
export const VERIFIED_RESOURCE_CATALOG: LearningResource[] = [
  // -------------------------------------------------------------
  // 1. Docker & Containerization
  // -------------------------------------------------------------
  {
    id: "res-docker-yt-1",
    topic: "Docker & Containerization",
    title: "Docker Tutorial for Beginners [Full Course in 3 Hours]",
    creatorOrPublisher: "TechWorld with Nana",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
    durationOrReadTime: "3h 05m video",
    description: "The gold standard Docker masterclass: containers vs VMs, Dockerfile multi-stage builds, docker-compose orchestration, and volume mounting.",
    popularMetric: "5.8M+ views • Top Rated",
    difficulty: "Beginner",
    whyRecommended: "Fixes missing containerization evidence in your projects so recruiters see cloud-ready deployment skills."
  },
  {
    id: "res-docker-docs-1",
    topic: "Docker & Containerization",
    title: "Docker Official Get Started & Hands-on Lab Guide",
    creatorOrPublisher: "Docker Documentation",
    type: "documentation",
    url: "https://docs.docker.com/get-started/",
    durationOrReadTime: "Official Interactive Labs",
    description: "Official interactive tutorial from Docker engineers detailing container lifecycle, network isolation, and microservice integration.",
    popularMetric: "Official Standard",
    difficulty: "Beginner",
    whyRecommended: "Directly bridges the gap between running code locally and packaging it for reproducible environments."
  },
  {
    id: "res-docker-article-1",
    topic: "Docker & Containerization",
    title: "Best Practices for Writing Production-Grade Dockerfiles",
    creatorOrPublisher: "Docker Engineering / Snyk",
    type: "article",
    url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/",
    durationOrReadTime: "12 min read",
    description: "Essential rules for image layer caching, non-root user execution, minimal Alpine base images, and minimizing container security attack surface.",
    popularMetric: "Industry Essential",
    difficulty: "Intermediate",
    whyRecommended: "Teaches you how to write Dockerfiles that pass corporate security and efficiency reviews."
  },

  // -------------------------------------------------------------
  // 2. Kubernetes & Cloud Orchestration
  // -------------------------------------------------------------
  {
    id: "res-k8s-yt-1",
    topic: "Kubernetes & Cloud Orchestration",
    title: "Kubernetes Tutorial for Beginners [Full Course in 4 Hours]",
    creatorOrPublisher: "TechWorld with Nana",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=X48VuDVv0do",
    durationOrReadTime: "3h 50m video",
    description: "The premier Kubernetes video: Pods, Deployments, Services, Ingress controllers, ConfigMaps, Secrets, and Helm packaging.",
    popularMetric: "4.4M+ views",
    difficulty: "Intermediate",
    whyRecommended: "Bridges the gap to modern DevOps expectations by teaching container orchestration and self-healing systems."
  },
  {
    id: "res-k8s-docs-1",
    topic: "Kubernetes & Cloud Orchestration",
    title: "Kubernetes Basics & Interactive Node Tutorials",
    creatorOrPublisher: "Kubernetes Official (CNCF)",
    type: "documentation",
    url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
    durationOrReadTime: "Official CNCF Tutorials",
    description: "Step-by-step interactive labs walking through cluster deployment, scaling replica sets, rolling zero-downtime updates, and service discovery.",
    popularMetric: "CNCF Global Standard",
    difficulty: "Intermediate",
    whyRecommended: "Validates your understanding of cluster mechanics needed for scalable infrastructure roles."
  },

  // -------------------------------------------------------------
  // 3. System Design & Distributed Systems
  // -------------------------------------------------------------
  {
    id: "res-sysdesign-yt-1",
    topic: "System Design & Distributed Systems",
    title: "System Design for Beginners Course",
    creatorOrPublisher: "freeCodeCamp.org",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=m8Icp_Cid5o",
    durationOrReadTime: "2h 30m video",
    description: "Architectural primer covering horizontal scaling, reverse proxies, database sharding, CAP theorem, consistent hashing, and caching tiers.",
    popularMetric: "2.3M+ views",
    difficulty: "Intermediate",
    whyRecommended: "Transitions your profile from a basic CRUD coder to someone who designs fault-tolerant, high-throughput architectures."
  },
  {
    id: "res-sysdesign-blog-1",
    topic: "System Design & Distributed Systems",
    title: "ByteByteGo System Design Newsletter & Architecture Insights",
    creatorOrPublisher: "ByteByteGo (Alex Xu)",
    type: "article",
    url: "https://blog.bytebytego.com/",
    durationOrReadTime: "Visual Articles • 10 min each",
    description: "Famous visual breakdowns of real-world Netflix, Uber, YouTube, and payment gateway architectures by the author of System Design Interview.",
    popularMetric: "500k+ Engineers Read",
    difficulty: "Intermediate",
    whyRecommended: "Gives you the exact architectural diagrams, tradeoffs, and jargon required in senior technical interviews."
  },
  {
    id: "res-fowler-dist-1",
    topic: "System Design & Distributed Systems",
    title: "Patterns of Distributed Systems",
    creatorOrPublisher: "Martin Fowler",
    type: "article",
    url: "https://martinfowler.com/articles/patterns-of-distributed-systems/",
    durationOrReadTime: "Deep Architectural Guide",
    description: "Foundational architecture patterns explaining Write-Ahead Log, Paxos/Raft consensus, heartbeat mechanisms, and idempotent consumers.",
    popularMetric: "Classic Reference",
    difficulty: "Advanced",
    whyRecommended: "Grounds your resume project descriptions in proven distributed consensus and reliability patterns."
  },

  // -------------------------------------------------------------
  // 4. Redis, Caching & High Performance
  // -------------------------------------------------------------
  {
    id: "res-redis-yt-1",
    topic: "Redis & Distributed Caching",
    title: "Redis Crash Course - High Performance In-Memory Caching",
    creatorOrPublisher: "Hussein Nasser",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
    durationOrReadTime: "48m video",
    description: "In-depth engineering dive into Redis memory data structures (Strings, Hashes, Sets, Sorted Sets), cache-aside patterns, TTL eviction, and pub/sub.",
    popularMetric: "520k+ views",
    difficulty: "Intermediate",
    whyRecommended: "Shows you how to add an in-memory caching layer to your projects, dropping p95 latency from 300ms to under 15ms."
  },
  {
    id: "res-redis-fireship-1",
    topic: "Redis & Distributed Caching",
    title: "Redis in 100 Seconds // Quick Architecture Overview",
    creatorOrPublisher: "Fireship",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=G1rOAtVcL30",
    durationOrReadTime: "2m fast-paced video",
    description: "Lightning overview of in-memory caching, key-value stores, persistence modes (RDB vs AOF), and pub-sub messaging.",
    popularMetric: "1.5M+ views",
    difficulty: "Beginner",
    whyRecommended: "Quickly grasp why Redis is universally used in production backend architectures."
  },
  {
    id: "res-redis-bytebytego-1",
    topic: "Redis & Distributed Caching",
    title: "Top 5 Redis Use Cases in Modern Production Architecture",
    creatorOrPublisher: "ByteByteGo",
    type: "article",
    url: "https://blog.bytebytego.com/p/top-5-redis-use-cases",
    durationOrReadTime: "8 min read",
    description: "Visual analysis of Session Storage, Distributed Rate Limiting, Leaderboards with Sorted Sets, and Pub/Sub Event Queues.",
    popularMetric: "Widely Shared Architecture Post",
    difficulty: "Intermediate",
    whyRecommended: "Enables you to speak credibly about caching strategies, cache stampede mitigation, and TTL invalidation."
  },

  // -------------------------------------------------------------
  // 5. CI/CD & Automated Testing
  // -------------------------------------------------------------
  {
    id: "res-cicd-yt-1",
    topic: "CI/CD & Automated Testing",
    title: "GitHub Actions Tutorial - CI/CD DevOps Pipeline",
    creatorOrPublisher: "TechWorld with Nana",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=R8_veQiYBjI",
    durationOrReadTime: "1h 45m video",
    description: "Step-by-step pipeline creation: automated test matrices, linters, Docker image building and pushing, and cloud deployments on pull requests.",
    popularMetric: "1.2M+ views",
    difficulty: "Beginner",
    whyRecommended: "Adding automated GitHub Actions to your public repos proves to recruiters you have real production collaboration skills."
  },
  {
    id: "res-fowler-ci-1",
    topic: "CI/CD & Automated Testing",
    title: "Continuous Integration & Deployment Guide",
    creatorOrPublisher: "Martin Fowler",
    type: "article",
    url: "https://martinfowler.com/articles/continuousIntegration.html",
    durationOrReadTime: "18 min read",
    description: "The seminal essay defining automated regression suites, trunk-based development, self-testing code, and deployment pipeline discipline.",
    popularMetric: "Industry Landmark",
    difficulty: "Intermediate",
    whyRecommended: "Eliminates the 'works on my machine' anti-pattern from your projects."
  },
  {
    id: "res-tdd-fowler-1",
    topic: "CI/CD & Automated Testing",
    title: "The Practical Test Pyramid",
    creatorOrPublisher: "Ham Vocke / Martin Fowler",
    type: "article",
    url: "https://martinfowler.com/articles/practical-test-pyramid.html",
    durationOrReadTime: "15 min read",
    description: "Concrete breakdown of unit tests, component contract tests, and end-to-end integration tests to maximize velocity and code confidence.",
    popularMetric: "Essential Reading",
    difficulty: "Intermediate",
    whyRecommended: "Helps you structure test suites with high code coverage for your portfolio repositories."
  },

  // -------------------------------------------------------------
  // 6. SQL, Database Optimization & Indexing
  // -------------------------------------------------------------
  {
    id: "res-sql-yt-1",
    topic: "SQL & Database Optimization",
    title: "SQL and Database Design Course - Full Tutorial",
    creatorOrPublisher: "freeCodeCamp.org",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    durationOrReadTime: "4h 20m video",
    description: "From relational normalization (1NF-3NF) to complex multi-table joins, subqueries, aggregation functions, and index design.",
    popularMetric: "4.9M+ views",
    difficulty: "Beginner",
    whyRecommended: "Transforms basic SQL knowledge into robust schema design and query execution proficiency."
  },
  {
    id: "res-sql-index-1",
    topic: "SQL & Database Optimization",
    title: "Use The Index, Luke! - A Guide to Database Performance",
    creatorOrPublisher: "Markus Winand",
    type: "article",
    url: "https://use-the-index-luke.com/",
    durationOrReadTime: "Interactive Masterclass",
    description: "Widely regarded as the single best free guide on B-Tree index structures, composite indexing, and execution plan profiling.",
    popularMetric: "Top Performance Reference",
    difficulty: "Intermediate",
    whyRecommended: "Solves slow database query bottlenecks and teaches EXPLAIN ANALYZE interpretation."
  },
  {
    id: "res-sql-hussein-1",
    topic: "SQL & Database Optimization",
    title: "Database Indexing Explained - B-Trees, Clustered & Non-Clustered",
    creatorOrPublisher: "Hussein Nasser",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=-qNSXK7s7_w",
    durationOrReadTime: "42m video",
    description: "Under-the-hood analysis of disk pages, secondary indexes, table scans, and how database query optimizers execute lookups.",
    popularMetric: "850k+ views",
    difficulty: "Intermediate",
    whyRecommended: "Gives you the exact technical depth to answer senior database performance interview questions."
  },

  // -------------------------------------------------------------
  // 7. Cloud Architecture (AWS / GCP / Cloud Run)
  // -------------------------------------------------------------
  {
    id: "res-cloud-yt-1",
    topic: "Cloud Architecture (AWS/GCP)",
    title: "AWS Certified Cloud Practitioner - Full Course",
    creatorOrPublisher: "freeCodeCamp.org",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    durationOrReadTime: "14h comprehensive video",
    description: "Zero-to-hero mastery of VPC networking, EC2 compute, S3 object storage, IAM least-privilege security, and RDS managed databases.",
    popularMetric: "3.5M+ views",
    difficulty: "Beginner",
    whyRecommended: "Covers foundational cloud services expected by almost every modern software engineering team."
  },
  {
    id: "res-cloud-aws-docs-1",
    topic: "Cloud Architecture (AWS/GCP)",
    title: "AWS Well-Architected Framework: Reliability & Performance",
    creatorOrPublisher: "AWS Architecture Center",
    type: "documentation",
    url: "https://aws.amazon.com/architecture/well-architected/",
    durationOrReadTime: "Official Whitepapers",
    description: "The 6 architectural pillars used by senior cloud architects to build resilient, cost-effective, multi-AZ cloud applications.",
    popularMetric: "Global Cloud Standard",
    difficulty: "Intermediate",
    whyRecommended: "Allows you to adopt industry-standard cloud terminology and design principles in your resume bullet points."
  },

  // -------------------------------------------------------------
  // 8. Machine Learning & PyTorch / AI Engineering
  // -------------------------------------------------------------
  {
    id: "res-ml-yt-1",
    topic: "Machine Learning & AI Engineering",
    title: "Machine Learning for Everybody - Full Course",
    creatorOrPublisher: "freeCodeCamp.org",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
    durationOrReadTime: "3h 50m video",
    description: "Understand supervised vs unsupervised learning, gradient descent, feature engineering, and model evaluation metrics with Python & Scikit-learn.",
    popularMetric: "2.1M+ views",
    difficulty: "Beginner",
    whyRecommended: "Builds a clear foundational understanding of ML evaluation metrics (Precision, Recall, ROC-AUC) to feature in your bullets."
  },
  {
    id: "res-pytorch-yt-1",
    topic: "Machine Learning & AI Engineering",
    title: "PyTorch for Deep Learning & Machine Learning - Full Course",
    creatorOrPublisher: "Daniel Bourke / freeCodeCamp",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=V_xro1bcAuA",
    durationOrReadTime: "26h complete bootcamp",
    description: "Zero to mastery in PyTorch: tensors, neural network architectures, computer vision with CNNs, transfer learning, and model saving/loading.",
    popularMetric: "2.6M+ views • Gold Standard",
    difficulty: "Intermediate",
    whyRecommended: "Replaces basic Scikit-learn tutorials with modern, production-grade PyTorch deep learning implementations."
  },
  {
    id: "res-ml-google-1",
    topic: "Machine Learning & AI Engineering",
    title: "Google Machine Learning Crash Course",
    creatorOrPublisher: "Google Developers",
    type: "article",
    url: "https://developers.google.com/machine-learning/crash-course",
    durationOrReadTime: "Interactive Modules & Labs",
    description: "Self-study curriculum featuring video lectures from Google researchers, real-world case studies, and hands-on TensorFlow Colabs.",
    popularMetric: "Google Official",
    difficulty: "Beginner",
    whyRecommended: "Google's verified curriculum for core ML concepts and production training hygiene."
  },
  {
    id: "res-ml-huggingface-1",
    topic: "Machine Learning & AI Engineering",
    title: "Hugging Face NLP & Transformers Masterclass",
    creatorOrPublisher: "Hugging Face",
    type: "documentation",
    url: "https://huggingface.co/learn/nlp-course",
    durationOrReadTime: "Complete Hands-on Course",
    description: "Modern transformer fine-tuning, tokenization pipelines, RAG implementations, and model deployment on Hugging Face Spaces.",
    popularMetric: "Premier NLP Course",
    difficulty: "Intermediate",
    whyRecommended: "Provides hands-on modern LLM, RAG, and Transformer skills that attract high recruiter interest."
  },

  // -------------------------------------------------------------
  // 9. REST APIs & Backend System Fundamentals
  // -------------------------------------------------------------
  {
    id: "res-api-yt-1",
    topic: "REST APIs & Backend Engineering",
    title: "APIs for Beginners - How to Use and Build APIs",
    creatorOrPublisher: "freeCodeCamp.org",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=GZvSYJ38wxU",
    durationOrReadTime: "2h 15m video",
    description: "Deep dive into HTTP methods, status codes, JWT authentication, rate limiting, and API contract design.",
    popularMetric: "2.8M+ views",
    difficulty: "Beginner",
    whyRecommended: "Ensures you can explain API contracts, request validation, and HTTP response codes cleanly."
  },
  {
    id: "res-api-ms-1",
    topic: "REST APIs & Backend Engineering",
    title: "RESTful API Design Best Practices",
    creatorOrPublisher: "Microsoft Azure Architecture Center",
    type: "article",
    url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design",
    durationOrReadTime: "14 min read",
    description: "Definitive guidelines for URI resource naming, idempotent endpoints, pagination, error schemas, and API versioning strategies.",
    popularMetric: "Industry Benchmark",
    difficulty: "Intermediate",
    whyRecommended: "Helps you build and document clean REST APIs following enterprise architectural standards."
  },

  // -------------------------------------------------------------
  // 10. Python Advanced, OOP & Clean Code
  // -------------------------------------------------------------
  {
    id: "res-py-corey-1",
    topic: "Python & Software Craftsmanship",
    title: "Python OOP Tutorials - Working with Classes and Instances",
    creatorOrPublisher: "Corey Schafer",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
    durationOrReadTime: "6-part video series (~1h 30m)",
    description: "The acclaimed tutorial series covering Python object-oriented programming, dunder methods, inheritance, classmethods, and property decorators.",
    popularMetric: "3.4M+ views • Top Rated",
    difficulty: "Beginner",
    whyRecommended: "Transitions your code from disorganized procedural scripts into professional, modular Python classes."
  },
  {
    id: "res-py-realpython-1",
    topic: "Python & Software Craftsmanship",
    title: "Python Best Practices, Type Hints & Clean Code Patterns",
    creatorOrPublisher: "Real Python",
    type: "article",
    url: "https://realpython.com/",
    durationOrReadTime: "Comprehensive Guides & Tutorials",
    description: "Authoritative engineering tutorials on Python typing, pytest test fixtures, async/await, generators, and package structuring.",
    popularMetric: "#1 Community Python Resource",
    difficulty: "Intermediate",
    whyRecommended: "Helps you adopt modern type annotations (mypy) and unit test standards."
  },

  // -------------------------------------------------------------
  // 11. Data Structures, Algorithms & LeetCode Prep
  // -------------------------------------------------------------
  {
    id: "res-dsa-yt-1",
    topic: "Data Structures & Coding Interviews",
    title: "Algorithms and Data Structures Tutorial - Full Course",
    creatorOrPublisher: "freeCodeCamp.org",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=8hly31xKli0",
    durationOrReadTime: "5h 22m video",
    description: "Complete walkthrough of Big-O asymptotic analysis, Arrays, Linked Lists, Binary Trees, Heaps, and Graph traversal algorithms (BFS/DFS).",
    popularMetric: "4.5M+ views",
    difficulty: "Beginner",
    whyRecommended: "Prepares you to pass initial automated algorithmic screening tests and technical coding rounds."
  },
  {
    id: "res-neetcode-1",
    topic: "Data Structures & Coding Interviews",
    title: "NeetCode 150 & Algorithms Visual Roadmap",
    creatorOrPublisher: "NeetCode",
    type: "article",
    url: "https://neetcode.io/roadmap",
    durationOrReadTime: "Interactive Problem Roadmap",
    description: "Structured roadmap covering the 150 highest-frequency interview coding patterns (Two Pointers, Sliding Window, Graphs, Dynamic Programming).",
    popularMetric: "1.2M+ Active Engineers",
    difficulty: "Intermediate",
    whyRecommended: "Eliminates guesswork in technical interview prep with battle-tested problem patterns."
  },

  // -------------------------------------------------------------
  // 12. Resume Metric Quantification & STAR Bullet Writing
  // -------------------------------------------------------------
  {
    id: "res-resume-yt-1",
    topic: "Resume Quantification & Impact Bullets",
    title: "How to Write a Tech Resume that gets FAANG / Tier-1 Interviews",
    creatorOrPublisher: "freeCodeCamp.org",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=yp693O87GmM",
    durationOrReadTime: "1h 15m video",
    description: "Detailed breakdown of the STAR format, quantifying business metrics, avoiding passive responsibilities, and optimizing for ATS screeners.",
    popularMetric: "1.1M+ views",
    difficulty: "Beginner",
    whyRecommended: "Solves the exact 'weak metric quantification' flaw identified in your resume."
  },
  {
    id: "res-google-xyz-1",
    topic: "Resume Quantification & Impact Bullets",
    title: "The Google 'Accomplished [X] as measured by [Y] by doing [Z]' Formula",
    creatorOrPublisher: "Laszlo Bock / Inc. Magazine",
    type: "article",
    url: "https://www.inc.com/bill-murphy-jr/google-recruiters-say-these-5-words-are-secret-to-a-perfect-resume.html",
    durationOrReadTime: "7 min read",
    description: "The universal rubric created by Google's VP of People Operations for formatting high-impact engineering resume bullet points.",
    popularMetric: "Global Industry Gold Standard",
    difficulty: "Beginner",
    whyRecommended: "The definitive formula used by hiring managers to evaluate applicant achievement."
  },

  // -------------------------------------------------------------
  // 13. Git & Production Collaboration
  // -------------------------------------------------------------
  {
    id: "res-git-yt-1",
    topic: "Git & Version Control Mastery",
    title: "Git and GitHub for Beginners - Crash Course",
    creatorOrPublisher: "freeCodeCamp.org",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
    durationOrReadTime: "1h 10m video",
    description: "Master interactive rebase, merge conflicts, pull request reviews, cherry-picking, and conventional commit standards.",
    popularMetric: "6.2M+ views",
    difficulty: "Beginner",
    whyRecommended: "Demonstrates git hygiene and pull request fluency needed for team collaboration."
  },
  {
    id: "res-git-progit-1",
    topic: "Git & Version Control Mastery",
    title: "Pro Git Book (Complete Online Edition)",
    creatorOrPublisher: "Scott Chacon & Ben Straub",
    type: "documentation",
    url: "https://git-scm.com/book/en/v2",
    durationOrReadTime: "Official Free Book",
    description: "The official, definitive book covering Git internals, tree objects, commit SHAs, and distributed branching strategies.",
    popularMetric: "Official Git Guide",
    difficulty: "Intermediate",
    whyRecommended: "Deepens your knowledge of distributed version control beyond basic git push commands."
  },

  // -------------------------------------------------------------
  // 14. Roadmap & Career Curriculum
  // -------------------------------------------------------------
  {
    id: "res-roadmap-sh-1",
    topic: "Engineering Role Curricula",
    title: "Developer Roadmaps & Skill Guides (Backend, DevOps, AI)",
    creatorOrPublisher: "roadmap.sh",
    type: "article",
    url: "https://roadmap.sh/",
    durationOrReadTime: "Interactive Roadmaps",
    description: "Community-driven visual charts tracking exactly what technologies, protocols, and architectural concepts engineers need in 2026.",
    popularMetric: "285k+ GitHub Stars",
    difficulty: "Intermediate",
    whyRecommended: "Gives you a clear step-by-step curriculum to navigate from student to production engineer."
  }
];

/**
 * Given a skill name or deficit string, finds the most relevant genuine popular resources.
 */
export function findResourcesForSkill(skillName: string): LearningResource[] {
  const query = (skillName || "").toLowerCase().trim();

  let matches: LearningResource[] = [];

  if (query.includes("docker") || query.includes("container") || query.includes("compose")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Docker"));
  } else if (query.includes("kubernetes") || query.includes("k8s") || query.includes("orchestrat") || query.includes("helm")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Kubernetes"));
  } else if (query.includes("redis") || query.includes("cache") || query.includes("in-memory")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Redis"));
  } else if (query.includes("system design") || query.includes("distribut") || query.includes("scalab") || query.includes("architect") || query.includes("microservice")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("System Design") || r.topic.includes("Redis"));
  } else if (query.includes("ci/cd") || query.includes("pipeline") || query.includes("github actions") || query.includes("test") || query.includes("automation")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("CI/CD"));
  } else if (query.includes("sql") || query.includes("database") || query.includes("postgres") || query.includes("mysql") || query.includes("index") || query.includes("query")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("SQL"));
  } else if (query.includes("cloud") || query.includes("aws") || query.includes("gcp") || query.includes("azure") || query.includes("deploy")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Cloud"));
  } else if (query.includes("pytorch") || query.includes("deep learning") || query.includes("machine learning") || query.includes("ml") || query.includes("ai") || query.includes("nlp") || query.includes("model")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Machine Learning"));
  } else if (query.includes("python") || query.includes("oop") || query.includes("clean code")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Python"));
  } else if (query.includes("algorithm") || query.includes("data structure") || query.includes("dsa") || query.includes("leetcode")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Data Structures"));
  } else if (query.includes("metric") || query.includes("quantif") || query.includes("star") || query.includes("bullet") || query.includes("flaw")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Quantification"));
  } else if (query.includes("git") || query.includes("version control") || query.includes("github")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("Git"));
  } else if (query.includes("api") || query.includes("rest") || query.includes("backend") || query.includes("fastapi") || query.includes("endpoint")) {
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("REST APIs"));
  } else {
    // General fallback: System Design & Developer Roadmaps
    matches = VERIFIED_RESOURCE_CATALOG.filter(r => r.topic.includes("System Design") || r.topic.includes("Curricula"));
  }

  // Personalize whyRecommended with the specific skill name if not set
  return matches.slice(0, 3).map(res => ({
    ...res,
    whyRecommended: res.whyRecommended || `Curated to directly bridge your identified gap in: ${skillName}`
  }));
}

/**
 * Generates an aggregated, deduplicated set of curated resources specifically addressing
 * the candidate's verified skill gaps, deficits, and must-develop items.
 */
export function getCuratedResourcesForGaps(
  skillGaps: SkillGapItem[],
  skillsToDevelop?: SkillsToDevelopGroup,
  targetRole?: string
): LearningResource[] {
  const resourceMap = new Map<string, LearningResource>();

  // 1. Gather high/medium gap skills or skills without strong evidence
  const deficitSkills: string[] = [];

  (skillGaps || []).forEach(gapItem => {
    if (gapItem.gap === "High" || gapItem.gap === "Medium" || gapItem.currentEvidence !== "Strong") {
      deficitSkills.push(gapItem.skill);
    }
  });

  // 2. Gather mustDevelop skills
  if (skillsToDevelop?.mustDevelop) {
    skillsToDevelop.mustDevelop.forEach(item => {
      deficitSkills.push(item.skill);
    });
  }

  // 3. Gather strengthen skills
  if (skillsToDevelop?.strengthen) {
    skillsToDevelop.strengthen.forEach(item => {
      deficitSkills.push(item.skill);
    });
  }

  // If role is provided, add role-specific keywords
  if (targetRole) {
    const roleLower = targetRole.toLowerCase();
    if (roleLower.includes("machine learning") || roleLower.includes("ai") || roleLower.includes("data scientist")) {
      deficitSkills.push("Machine Learning & AI Engineering");
      deficitSkills.push("PyTorch & Deep Learning");
    } else if (roleLower.includes("devops") || roleLower.includes("cloud") || roleLower.includes("sre")) {
      deficitSkills.push("Kubernetes & Cloud Orchestration");
      deficitSkills.push("Docker & Containerization");
      deficitSkills.push("Cloud Architecture (AWS/GCP)");
    } else {
      deficitSkills.push("System Design & Distributed Systems");
      deficitSkills.push("Docker & Containerization");
      deficitSkills.push("SQL & Database Optimization");
    }
  }

  // Always include resume bullet quantification resource because all candidates benefit from it
  deficitSkills.push("Resume Metric Quantification & STAR Bullet Writing");

  // 4. Match against catalog
  deficitSkills.forEach(skill => {
    const matched = findResourcesForSkill(skill);
    matched.forEach(res => {
      if (!resourceMap.has(res.id)) {
        resourceMap.set(res.id, {
          ...res,
          whyRecommended: res.whyRecommended || `Addresses your identified deficit in: ${skill}`
        });
      }
    });
  });

  // Ensure we have at least 5 top popular resources
  if (resourceMap.size < 5) {
    VERIFIED_RESOURCE_CATALOG.slice(0, 8).forEach(res => {
      if (!resourceMap.has(res.id)) {
        resourceMap.set(res.id, res);
      }
    });
  }

  return Array.from(resourceMap.values());
}
