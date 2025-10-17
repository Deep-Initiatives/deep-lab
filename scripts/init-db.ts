import { db } from "../server/db";
import { users, pods, apps, milestones } from "@shared/schema";
import bcrypt from "bcryptjs";

async function initializeDatabase() {
  console.log("🚀 Initializing Deep Lab database...");

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    }).returning();

    console.log("✅ Admin user created:", adminUser[0].username);

    // Create sample pods
    const samplePods = [
      {
        name: "AI Avatar",
        description: "Creating next-generation avatar generation systems with advanced AI models",
        status: "Active",
        progress: 85,
        teamSize: 4,
        startDate: new Date("2025-06-24"),
        technologies: ["Python", "Firestore", "Nextjs"],
        coordinatorId: adminUser[0].id,
      },
      {
        name: "AI-based Idea Filtering",
        description: "Developing AI systems to evaluate and prioritize innovative ideas",
        status: "Active",
        progress: 90,
        teamSize: 3,
        startDate: new Date("2025-06-24"),
        technologies: ["NLP", "Classification Models"],
        coordinatorId: adminUser[0].id,
      },
      {
        name: "Impact Measurement",
        description: "Creating frameworks to quantify and track project impact metrics",
        status: "Active",
        progress: 55,
        teamSize: 4,
        startDate: new Date("2025-06-24"),
        technologies: ["Data Analytics", "Visualization"],
        coordinatorId: adminUser[0].id,
      },
      {
        name: "Community Hub Portal",
        description: "Building a central platform for community engagement and collaboration",
        status: "Active",
        progress: 40,
        teamSize: 4,
        startDate: new Date("2025-08-15"),
        technologies: ["React", "MySql"],
        coordinatorId: adminUser[0].id,
      },
      {
        id: "8",
        name: "CrisisScope AI",
        description: "AI-powered crisis analysis and response assistant that monitors global events, detects emerging crises, and provides real-time insights and summaries to aid decision-making and humanitarian response efforts.",
        status: "Planning",
        progress: 0,
        teamSize: 4,
        startDate: new Date("2025-10-10"),
        technologies: ["Python", "LangChain", "FastAPI", "NewsAPI", "Vector Databases"],
        coordinatorId: adminUser[0].id,
      }
    ];

    const createdPods = await db.insert(pods).values(samplePods).returning();
    console.log("✅ Sample pods created:", createdPods.length);

    // Create sample apps
    const sampleApps = [
      {
        name: "AI Avatar",
        description: "Interactive AI avatar for DeepFunding that answers questions, provides guidance, and explains initiatives related to the DeepFunding ecosystem using natural language understanding.",
        category: "AI Agent",
        status: "Live",
        technologies: ["Python", "Firestore", "FastAPI"],
        demoUrl: "https://ai-avatar-updated-137748040614.us-central1.run.app/",
        podId: createdPods[0].id,
      },
      {
        name: "AI Review Assistants",
        description: "Intelligent review analysis tool that provides comprehensive feedback using natural language processing.",
        category: "AI Agent",
        status: "Beta",
        technologies: ["GPT-4", "React", "Node.js"],
        demoUrl: "https://aireviewassistant-137748040614.us-central1.run.app/",
        podId: createdPods[1].id,
      },
      {
        name: "Voting Methods Experiment",
        description: "Experimental platform testing various democratic voting methodologies and consensus mechanisms.",
        category: "Web App",
        status: "Prototype",
        technologies: ["TypeScript", "Web3", "Ethereum"],
        podId: createdPods[2].id,
      },
      {
        name: "AI-based Idea Filtering",
        description: "AI-powered tool that analyzes and filters project ideas based on feasibility and innovation potential.",
        category: "Tool",
        status: "In Development",
        technologies: ["Python", "NLP", "Redis"],
        demoUrl: "https://aiideafilter-137748040614.us-central1.run.app",
        podId: createdPods[1].id,
      },
      {
        name: "CrisisScope AI",
        description: "AI-powered crisis analysis and response assistant that monitors global events, detects emerging crises, and provides real-time insights and summaries to aid decision-making and humanitarian response efforts.",
        category: "AI Agent",
        status: "In Development",
        technologies: ["Python", "LangChain", "FastAPI", "NewsAPI", "Vector Databases"],
        podId: createdPods[4].id, // CrisisScope AI pod
      },
      {
        name: "Impact Measure",
        description: "Quantitative framework for measuring the real-world impact of AI projects and interventions.",
        category: "Tool",
        status: "In Development",
        technologies: ["R", "PostgreSQL", "D3.js"],
        podId: createdPods[2].id, // Impact Measurement pod
      },
      {
        name: "HiveMind/MM Integration",
        description: "Distributed AI system enabling collective intelligence through multi-model coordination.",
        category: "Service",
        status: "Live",
        technologies: ["PyTorch", "Redis", "gRPC"],
        demoUrl: "https://hivemind.deepfunding.ai/",
        podId: createdPods[0].id, // AI Avatar pod
      },
      {
        name: "Internal NewsFeed/Newsletter",
        description: "Smart content aggregation system delivering personalized AI and tech news to the community.",
        category: "Web App",
        status: "Beta",
        technologies: ["Next.js", "AI Models", "Firestore"],
        demoUrl: "https://newsletter.deepfunding.ai/",
        podId: createdPods[3].id, // Community Hub Portal pod
      },
      {
        name: "AI Assisted Proposal Refinement",
        description: "AI assistant helping teams craft better project proposals through iterative feedback.",
        category: "AI Agent",
        status: "Beta",
        technologies: ["Gemini", "Nextjs", "Firestore"],
        demoUrl: "https://proposal-refinement.deepfunding.ai/",
        podId: createdPods[1].id, // AI-based Idea Filtering pod
      },
      {
        name: "Community Hub Portal",
        description: "Central platform connecting developers, researchers, and AI enthusiasts in our ecosystem.",
        category: "Web App",
        status: "In Development",
        technologies: ["Vue.js", "Firebase", "Tailwind"],
        podId: createdPods[3].id, // Community Hub Portal pod
      }
    ];

    const createdApps = await db.insert(apps).values(sampleApps).returning();
    console.log("✅ Sample apps created:", createdApps.length);

    // Create sample milestones
    const sampleMilestones = [
      {
        date: new Date("2025-06-01"),
        title: "Deep Lab Inception",
        description: "Official launch of Deep Lab with initial team formation and vision establishment for rapid AI prototyping",
        type: "launch",
      },
      {
        date: new Date("2025-07-01"),
        title: "First 5 Apps Deployed",
        description: "Successfully prototyped and deployed our first batch of AI applications including Avatar Generator and Idea Filtering",
        type: "achievement",
      },
      {
        date: new Date("2025-08-15"),
        title: "10+ Apps Milestone",
        description: "Reached double-digit app count with diverse portfolio across AI agents, web apps, and developer tools",
        type: "milestone",
      },
      {
        date: new Date("2025-09-01"),
        title: "Partnership with DeepFunding",
        description: "Established strategic partnership with DeepFunding to accelerate AI innovation and provide funding opportunities",
        type: "partnership",
      },
    ];

    const createdMilestones = await db.insert(milestones).values(sampleMilestones).returning();
    console.log("✅ Sample milestones created:", createdMilestones.length);

    console.log("🎉 Database initialization completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`- Admin user: admin / admin123`);
    console.log(`- Pods: ${createdPods.length}`);
    console.log(`- Apps: ${createdApps.length}`);
    console.log(`- Milestones: ${createdMilestones.length}`);

  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase().then(() => {
  console.log("✅ Database setup complete!");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Setup failed:", error);
  process.exit(1);
});

export { initializeDatabase };
