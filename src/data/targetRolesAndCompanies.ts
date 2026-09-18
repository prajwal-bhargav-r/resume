export interface CompanyDetail {
  name: string;
  category: string;
  publicTechStack: string[];
  publicResearchTopics: {
    topic: string;
    source: string;
    publicDetail: string;
    aiRecommendation: string;
  }[];
}

export const TARGET_ROLES: string[] = [
  "Machine Learning Engineer",
  "AI Engineer",
  "Data Scientist",
  "Software Engineer",
  "Data Analyst",
  "Backend Engineer",
  "Frontend Engineer",
  "Embedded Engineer",
  "VLSI Engineer",
  "Cybersecurity Engineer",
];

export const TARGET_COMPANIES: CompanyDetail[] = [
  {
    name: "NVIDIA",
    category: "Semiconductors & Accelerated Computing",
    publicTechStack: ["CUDA", "C++", "PyTorch", "TensorRT", "DeepStream", "Linux", "Distributed Systems"],
    publicResearchTopics: [
      {
        topic: "Accelerated Computing & CUDA",
        source: "NVIDIA Technical Blog & Open Developer Docs",
        publicDetail: "High-performance parallel computing, GPU kernels, memory bandwidth optimization, and CUDA programming models are ubiquitous across core teams.",
        aiRecommendation: "Familiarize yourself with GPU hardware architectures, CUDA fundamentals (threads/blocks/grids), and profiling tools like Nsight Systems."
      },
      {
        topic: "Model Optimization & Inference Engines",
        source: "NVIDIA Deep Learning Institute (DLI) Public Coursework",
        publicDetail: "TensorRT, Triton Inference Server, and FP16/INT8 quantization are primary deployment stacks for low-latency production pipelines.",
        aiRecommendation: "Demonstrate converting a PyTorch model into ONNX and running inference with TensorRT or Triton to show deployment readiness."
      }
    ]
  },
  {
    name: "Google",
    category: "Cloud, AI & Internet Services",
    publicTechStack: ["Python", "Go", "C++", "Kubernetes", "JAX", "TensorFlow", "BigQuery"],
    publicResearchTopics: [
      {
        topic: "Distributed Systems & Scalability",
        source: "Google Research & Google Cloud Architecture Whitepapers",
        publicDetail: "Emphasis on high-concurrency RPC services (gRPC/Protobuf), fault-tolerant consensus, and horizontal container orchestration.",
        aiRecommendation: "Highlight experience with microservices, asynchronous message queues (Kafka/PubSub), and robust unit/integration testing methodologies."
      },
      {
        topic: "Clean Engineering & Algorithmic Rigor",
        source: "Google Engineering Practices Documentation (Google Style Guides)",
        publicDetail: "Public code review guidelines emphasize test coverage, documentation, readability, and predictable time/space complexity.",
        aiRecommendation: "Ensure projects feature clean Git commits, modular architectures, readable docstrings, and comprehensive test suites."
      }
    ]
  },
  {
    name: "Microsoft",
    category: "Enterprise Software, Cloud & AI",
    publicTechStack: ["C#", ".NET Core", "Python", "Azure", "TypeScript", "SQL Server", "ONNX"],
    publicResearchTopics: [
      {
        topic: "Azure Cloud Native & Hybrid Workloads",
        source: "Microsoft Learn Architecture Center",
        publicDetail: "Cloud architectural design patterns including circuit breakers, event-driven architectures, and managed container apps.",
        aiRecommendation: "Practice deploying web applications or APIs on cloud container services and securing endpoints with managed identities."
      },
      {
        topic: "Enterprise AI Integration",
        source: "Microsoft Azure AI Documentation",
        publicDetail: "Enterprise retrieval-augmented generation (RAG), Semantic Kernel, and compliant data governance.",
        aiRecommendation: "Build a prototype that integrates vector embeddings and semantic search with strict error handling."
      }
    ]
  },
  {
    name: "Amazon",
    category: "E-Commerce, Cloud & Logistics",
    publicTechStack: ["Java", "Python", "AWS", "DynamoDB", "Docker", "Typescript", "S3"],
    publicResearchTopics: [
      {
        topic: "Leadership Principles & Operational Excellence",
        source: "Amazon Day 1 Culture & Leadership Principles (Public)",
        publicDetail: "Customer obsession, bias for action, and dive deep are evaluated through metric-driven project narratives.",
        aiRecommendation: "Format your resume bullets using STAR: quantify latency improvements, throughput, user base, or cost efficiencies."
      },
      {
        topic: "AWS Native Architecture & High Availability",
        source: "AWS Well-Architected Framework",
        publicDetail: "Multi-region resilience, serverless architectures (Lambda/ECS), and decoupled microservice communication.",
        aiRecommendation: "Demonstrate hands-on familiarity with core cloud primitives (compute, object storage, serverless functions, IAM)."
      }
    ]
  },
  {
    name: "Apple",
    category: "Consumer Devices & Software Platforms",
    publicTechStack: ["Swift", "Objective-C", "C++", "Python", "CoreML", "Metal", "Embedded C"],
    publicResearchTopics: [
      {
        topic: "On-Device Efficiency & Privacy",
        source: "Apple Machine Learning Research & WWDC Sessions",
        publicDetail: "Running lightweight neural networks locally on neural engines without sacrificing battery life or user privacy.",
        aiRecommendation: "Focus on model quantization, memory footprint reduction, and latency profiling on resource-constrained hardware."
      }
    ]
  },
  {
    name: "Meta",
    category: "Social Platforms & AI Infrastructure",
    publicTechStack: ["PyTorch", "Python", "C++", "React", "GraphQL", "Presto/Trino", "Distributed Storage"],
    publicResearchTopics: [
      {
        topic: "PyTorch & Large-Scale AI Training",
        source: "Meta AI Research (FAIR) Open Publications",
        publicDetail: "PyTorch ecosystem, FSDP (Fully Sharded Data Parallel), and distributed training across large GPU clusters.",
        aiRecommendation: "Demonstrate knowledge of distributed training principles, PyTorch dataloaders, and tensor parallelization concepts."
      }
    ]
  },
  {
    name: "OpenAI",
    category: "Frontier AI & Foundational Models",
    publicTechStack: ["Python", "PyTorch", "Triton", "Ray", "Docker", "Kubernetes", "FastAPI"],
    publicResearchTopics: [
      {
        topic: "Scalable Model Serving & Triton Kernels",
        source: "OpenAI Research Blogs & Triton Compiler Documentation",
        publicDetail: "Writing custom GPU kernels, optimizing KV caching, dynamic batching, and high-throughput inference serving.",
        aiRecommendation: "Study GPU memory hierarchies, vLLM / HuggingFace TGI paradigms, and multi-threaded API architectures."
      }
    ]
  },
  {
    name: "IBM",
    category: "Enterprise AI & Hybrid Cloud",
    publicTechStack: ["Python", "Java", "Red Hat OpenShift", "Kubernetes", "watsonx", "Linux"],
    publicResearchTopics: [
      {
        topic: "Enterprise Hybrid Cloud & Governance",
        source: "IBM Redbooks & Technical Guides",
        publicDetail: "OpenShift container platforms, enterprise compliance, data lineage, and trusted AI pipelines.",
        aiRecommendation: "Show experience with CI/CD automation, container security scanning, and documented API contracts."
      }
    ]
  },
  {
    name: "Infosys",
    category: "Global IT Services & Consulting",
    publicTechStack: ["Java", "Spring Boot", "Python", "React", "Angular", "SQL", "Cloud (AWS/Azure)"],
    publicResearchTopics: [
      {
        topic: "Enterprise Digital Modernization",
        source: "Infosys Living Labs & Engineering Publications",
        publicDetail: "Migrating legacy monolithic architectures to microservices, API gateways, and cloud-native databases.",
        aiRecommendation: "Solidify core OOP fundamentals, relational database schema design, and RESTful API integration."
      }
    ]
  },
  {
    name: "TCS",
    category: "Global IT Services & Consulting",
    publicTechStack: ["Java", "Python", "C#", "Oracle SQL", "Spring", "Docker", "Agile/DevOps"],
    publicResearchTopics: [
      {
        topic: "Agile Software Lifecycle & Quality Engineering",
        source: "TCS Research & Innovation Whitepapers",
        publicDetail: "Enterprise SDLC, automated regression testing, CI/CD pipelines, and secure coding standards.",
        aiRecommendation: "Ensure resume highlights practical version control workflow, debugging skills, and unit testing frameworks."
      }
    ]
  },
  {
    name: "Accenture",
    category: "Technology Consulting & Digital Transformation",
    publicTechStack: ["Python", "Java", "Salesforce", "Cloud (AWS/Azure/GCP)", "Data Engineering", "PowerBI"],
    publicResearchTopics: [
      {
        topic: "Data Engineering & Analytics at Scale",
        source: "Accenture Technology Vision Reports",
        publicDetail: "Extract-Transform-Load (ETL) pipelines, data lakehouses, and business intelligence dashboards for enterprise clients.",
        aiRecommendation: "Emphasize end-to-end data pipeline construction, data cleaning rigors, and cross-functional communication."
      }
    ]
  }
];
