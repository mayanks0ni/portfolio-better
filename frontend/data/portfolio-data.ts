export interface PersonalInfo {
  name: string;
  pronouns: string;
  role: string;
  institution: string;
  degree: string;
  duration: string;
  location: string;
  coordinates: string;
  headline: string;
  bio: string;
  statusBadge: string;
  focusAreas: string[];
}

export interface SocialLinks {
  email: string;
  github: string;
  linkedin: string;
  discord: string;
  discordAvatar?: string;
  spotifyUser?: string;
  anilistUser: string;
  x: string;
  xUser: string;
  reddit: string;
  redditUser: string;
}

export interface SkillGroup {
  id: string;
  name: string;
  label: string;
  items: {
    name: string;
    context: string;
    highlight?: boolean;
  }[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: string;
  year: string;
  featured: boolean;
  problem: string;
  solution: string;
  contribution: string;
  techStack: string[];
  stats: string;
  architectureCallout: string;
  githubUrl: string;
  liveUrl?: string;
  image?: string;
}

export interface CreativeItem {
  id: string;
  title: string;
  category: "designs" | "posters" | "edits" | "experiments" | string;
  year: string;
  tools: string[];
  description: string;
  aspect: string;
  accentColor: string;
  mediaType?: "image" | "video";
  src?: string;
  thumbnail?: string;
}

export const PERSONAL_INFO: PersonalInfo = {
  name: "mayank soni",
  pronouns: "he/him",
  role: "software engineer & creative technologist",
  institution: "iit jodhpur",
  degree: "electrical engineering student at iit jodhpur",
  duration: "2024 — 2028",
  location: "jodhpur, rajasthan, india",
  coordinates: "26.29° n, 73.01° e",
  headline: "engineering robust systems, ai architectures, and art-directed digital experiences.",
  bio: "software engineer specializing in deep learning model optimization, c++ graph pathfinding systems, and full-stack ai applications.",
  statusBadge: "open to work",
  focusAreas: [
    "deep learning & transformer optimization",
    "c++ graph algorithms & geospatial systems",
    "full-stack ai applications & micro-learning",
    "creative technology & editorial design",
  ],
};

export const SOCIAL_LINKS: SocialLinks = {
  email: "mayanks86027@gmail.com",
  github: "https://github.com/mayanks0ni",
  linkedin: "https://linkedin.com/in/mayanks0ni",
  discord: "spider_mon_",
  discordAvatar: "/discord-avatar.png",
  anilistUser: "spideykun05",
  x: "https://x.com/spidey054",
  xUser: "spidey054",
  reddit: "https://www.reddit.com/u/mayanks0ni",
  redditUser: "mayanks0ni",
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "languages",
    name: "languages",
    label: "01",
    items: [
      { name: "python", context: "asyncio, pytorch, pyzmq, data planes", highlight: true },
      { name: "typescript", context: "next.js app router, strict typing, apis", highlight: true },
      { name: "c / c++", context: "pathfinding, graph theory, dijkstra", highlight: true },
      { name: "javascript", context: "esnext, node.js, modern web apis" },
      { name: "sql", context: "postgresql, clickhouse schema modeling" },
      { name: "html5 / css3", context: "fluid layouts, custom transforms, typography" },
    ],
  },
  {
    id: "frontend",
    name: "frontend",
    label: "02",
    items: [
      { name: "react 19", context: "concurrent rendering, hooks, state architecture", highlight: true },
      { name: "next.js 15", context: "server components, app router, route handlers", highlight: true },
      { name: "tailwind css v4", context: "modern token systems, responsive design", highlight: true },
      { name: "gsap", context: "timelines, scrolltrigger, performance transforms", highlight: true },
      { name: "vite", context: "fast bundling and instant hmr" },
    ],
  },
  {
    id: "backend",
    name: "backend & systems",
    label: "03",
    items: [
      { name: "c++17 & stl", context: "graph pathfinding, min-heap priority queues", highlight: true },
      { name: "node.js & express", context: "rest apis, authentication, middleware", highlight: true },
      { name: "cpp-httplib", context: "lightweight c++ json http services", highlight: true },
      { name: "firebase backend", context: "authentication, cloud persistence", highlight: true },
      { name: "fastapi", context: "asynchronous python rest microservices" },
    ],
  },
  {
    id: "ai",
    name: "ai & deep learning",
    label: "04",
    items: [
      { name: "pytorch", context: "diffusion transformers, structural pruning", highlight: true },
      { name: "dit-xl/2 optimization", context: "ffn width pruning, movement pruning", highlight: true },
      { name: "gemini api", context: "content generation, educational feeds", highlight: true },
      { name: "pinecone", context: "vector search, semantic retrieval", highlight: true },
      { name: "clustering & merging", context: "cat merging, k-means clustering, token pruning" },
    ],
  },
  {
    id: "infrastructure",
    name: "databases & infrastructure",
    label: "05",
    items: [
      { name: "firebase", context: "auth, database, user session management", highlight: true },
      { name: "pinecone vector db", context: "high-dimensional indexing & search", highlight: true },
      { name: "git & github", context: "version control, branching, workflows", highlight: true },
      { name: "postgresql", context: "relational persistence, transactional queries" },
      { name: "linux / macos cli", context: "shell scripting, build pipelines" },
    ],
  },
  {
    id: "creative",
    name: "creative tools",
    label: "06",
    items: [
      { name: "figma", context: "design systems, editorial layouts, ux flows", highlight: true },
      { name: "editorial typography", context: "grid systems, font hierarchy, editorial craft", highlight: true },
      { name: "premiere pro", context: "rhythm cuts, pacing, motion sequencing" },
      { name: "after effects", context: "kinetic typography, visual effects" },
      { name: "blender", context: "geometric forms, lighting, spatial renders" },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "dit-pruning",
    title: "dit-xl/2 structural pruning",
    subtitle: "inference-time gflops reduction on diffusion transformers",
    tagline: "hard structural pruning strategies cutting diffusion transformer compute by up to 34% on imagenet 256×256 without retraining.",
    category: "deep learning & vision research",
    year: "2024",
    featured: true,
    problem:
      "diffusion transformers (dit-xl/2 with 28 blocks) require immense inference compute across multi-step denoising trajectories, making real-time imagenet 256×256 generation prohibitive without structural optimizations.",
    solution:
      "researched inference-time gflops reduction under dr. palash das, implementing hard structural pruning strategies for imagenet 256×256 generation without retraining: ffn width pruning via movement pruning criterion (|grad × weight|), attend-then-prune skipping mlp for bottom-20% tokens in layers 9–19, cat merging with k-means clustering + global k/v mean-pooling reducing attention from o(t²) to o(t), and timestep-aware pruning schedules.",
    contribution:
      "physically removed mlp neurons cutting ffn compute by 25% per block (hidden dim 4608 → 3456); fixed critical adaln double-call bug causing inconsistent modulation gates across attention and mlp paths, eliminating blob artifacts; achieved up to 34% total gflops reduction across 250 denoising steps scaling ratio 10% → 20% based on noise level.",
    techStack: [
      "pytorch",
      "dit-xl/2",
      "diffusion transformers",
      "structural pruning",
      "movement pruning",
      "k-means clustering",
      "adaln modulation",
      "imagenet 256×256",
    ],
    stats: "up to 34% total gflops reduction (250 steps)",
    architectureCallout:
      "hard structural pruning: ffn width reduction (4608 → 3456), attend-then-prune + cat merging, and fixed adaln modulation gates.",
    githubUrl: "https://github.com/mayanks0ni",
  },
  {
    id: "cascade",
    title: "cascade",
    subtitle: "turning doomscrolling into deep learning",
    tagline: "a micro-learning platform converting short-form scrolling into structured, ai-generated study sessions and focus analytics.",
    category: "full-stack ai & micro-learning",
    year: "2025",
    featured: true,
    problem:
      "endless passive scrolling on social media fragments attention spans without providing structured, engaging, or trackable learning retention.",
    solution:
      "built a micro-learning web application that blends short-form social feed mechanics with productive study habits: ai-generated educational feeds via gemini api, vector-backed relevance using pinecone, embedded quizzes, engagement analytics, session recaps, and eduwrapped study insights.",
    contribution:
      "architected next.js app router frontend and api routes, integrated firebase authentication and backend, implemented gemini and pinecone pipelines for personalized feeds, created scroll and focus interruption detection, and built timetable analysis endpoint.",
    techStack: [
      "next.js (app router)",
      "typescript",
      "tailwind css",
      "firebase",
      "gemini api",
      "pinecone vector search",
    ],
    stats: "infinite micro-learning feed & focus tracking",
    architectureCallout:
      "gemini api + pinecone vector search powering infinite personalized study feeds with focus interruption detection.",
    githubUrl: "https://github.com/mayanks0ni/cascade",
  },
  {
    id: "ev-route-optimization-system",
    title: "ev route optimization system",
    subtitle: "c++ intelligent pathfinder & charging network engine",
    tagline: "c++17 dijkstra routing engine on 150k openstreetmap nodes guaranteeing reachable charging intervals and travel time estimation.",
    category: "algorithms & geospatial",
    year: "2024",
    featured: true,
    problem:
      "standard navigation algorithms find the shortest distance but fail electric vehicle drivers by ignoring battery depletion thresholds and charging station reachability.",
    solution:
      "developed a c++17 intelligent route planner using dijkstra's algorithm on real openstreetmap weighted graph datasets (jaipur road network with ~150,000 nodes preprocessed) supporting shortest path mode and ev charging mode ensuring charging stations are reachable every x kilometers.",
    contribution:
      "implemented adjacency list graph storage with min-heap priority queue, designed custom state struct (node, distance since last station, total distance) for constraint-based battery limits, built cpp-httplib json http server, and created interactive react + cytoscape.js route visualization with velocity-based travel time estimation.",
    techStack: [
      "c++17",
      "dijkstra algorithm",
      "openstreetmap (osm)",
      "priority queue (min-heap)",
      "cpp-httplib",
      "react.js",
      "cytoscape.js",
    ],
    stats: "150,000+ osm nodes preprocessed",
    architectureCallout:
      "custom state struct tracking distance since last charging stop in a min-heap dijkstra queue for battery-constrained routing.",
    githubUrl: "https://github.com/mayanks0ni/ev-route-optimization-system",
  },
];

export const CREATIVE_ARCHIVE: CreativeItem[] = [
  {
    id: "kaguya-banner",
    title: "kaguya banner poster",
    category: "posters",
    year: "2024",
    tools: ["photoshop", "typography", "figma"],
    description: "high-contrast cinematic anime banner exploration with layered typography, textured grain, and dynamic focal composition.",
    aspect: "aspect-[16/9]",
    accentColor: "#2b1c20",
    mediaType: "image",
    src: "/collection/posters/kaguya-banner.png",
  },
  {
    id: "kasumigaoka-utaha",
    title: "kasumigaoka utaha editorial banner",
    category: "designs",
    year: "2024",
    tools: ["figma", "illustrator", "design systems"],
    description: "editorial design banner featuring minimalist typography, monochrome tonal contrast, and character silhouette framing.",
    aspect: "aspect-[16/9]",
    accentColor: "#1d1f28",
    mediaType: "image",
    src: "/collection/designs/kasumigaoka-utaha-banner.png",
  },
  {
    id: "positions-edit",
    title: "positions kinetic edit",
    category: "edits",
    year: "2024",
    tools: ["premiere pro", "after effects"],
    description: "kinetic video sequence synchronized to rhythmic audio beats with velocity curves and micro-motion transitions.",
    aspect: "aspect-[16/9]",
    accentColor: "#161621",
    mediaType: "video",
    src: "/collection/edits/positions-edit.mp4",
    thumbnail: "/collection/edits/positions-edit-thumb.jpg",
  },
  {
    id: "wherever-i-go",
    title: "wherever i go visual edit",
    category: "edits",
    year: "2024",
    tools: ["premiere pro", "audition"],
    description: "cinematic rhythm montage exploring spatial cuts, atmosphere grading, and audio-visual cadence.",
    aspect: "aspect-[16/9]",
    accentColor: "#221c28",
    mediaType: "video",
    src: "/collection/edits/wherever-i-go-edit.mp4",
    thumbnail: "/collection/edits/wherever-i-go-edit-thumb.jpg",
  },
  {
    id: "aui-banner",
    title: "aui digital brand banner",
    category: "designs",
    year: "2024",
    tools: ["figma", "brand design"],
    description: "wide-format brand visual banner with subtle gradients and geometric typography.",
    aspect: "aspect-[16/9]",
    accentColor: "#17202a",
    mediaType: "image",
    src: "/collection/designs/aui-banner.png",
  },
];
