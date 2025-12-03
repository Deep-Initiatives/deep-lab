import type { App, Pod, AppStatus, PodStatus, ProjectCategory, Industry } from "@shared/schema";

/**
 * Maps app/pod status to project category for UI organization
 */
export function getProjectCategory(status: string, type: "app" | "pod"): ProjectCategory {
    const normalizedStatus = status.toLowerCase().trim();

    if (type === "app") {
        // App status mapping
        if (normalizedStatus === "prototype") return "Lined Up";
        if (normalizedStatus === "in development" || normalizedStatus === "beta") return "In Progress";
        if (normalizedStatus === "live" || normalizedStatus === "completed") return "Completed";
    } else {
        // Pod status mapping
        if (normalizedStatus === "planning") return "Lined Up";
        if (normalizedStatus === "active" || normalizedStatus === "on hold") return "In Progress";
        if (normalizedStatus === "completed") return "Completed";
    }

    // Default fallback
    return "In Progress";
}

/**
 * Formats status for display (e.g. "Live" -> "Completed")
 */
export function formatStatus(status: string): string {
    if (status.toLowerCase() === "live") return "Completed";
    return status;
}

/**
 * Gets color scheme for industry badges
 */
export function getIndustryColor(industry?: string | null): string {
    if (!industry) return "bg-muted text-muted-foreground";

    const industryMap: Record<string, string> = {
        "AI4SDGs": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        "Blockchain": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        "ClimateTech": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        "Emerging Technologies": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        "Platform Development": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        "Research": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    };

    return industryMap[industry] || "bg-muted text-muted-foreground";
}

/**
 * Gets gradient color for category badges
 */
export function getCategoryGradient(category: ProjectCategory): string {
    const gradientMap: Record<ProjectCategory, string> = {
        "Lined Up": "from-yellow-500 to-orange-500",
        "In Progress": "from-blue-500 to-purple-500",
        "Completed": "from-green-500 to-emerald-500",
    };

    return gradientMap[category];
}

/**
 * Filters projects by category, technology, and industry
 */
export function filterProjects<T extends (App | Pod) & { status: string }>(
    projects: T[],
    filters: {
        category?: ProjectCategory | "All";
        technologies?: string[];
        industries?: string[];
        searchTerm?: string;
    },
    type: "app" | "pod"
): T[] {
    return projects.filter((project) => {
        // Category filter
        if (filters.category && filters.category !== "All") {
            const projectCategory = getProjectCategory(project.status, type);
            if (projectCategory !== filters.category) return false;
        }

        // Technology filter
        if (filters.technologies && filters.technologies.length > 0) {
            const projectTechs = (project.technologies || []).map(t => t.toLowerCase());
            const hasMatchingTech = filters.technologies.some(tech =>
                projectTechs.some(pt => pt.includes(tech.toLowerCase()))
            );
            if (!hasMatchingTech) return false;
        }

        // Industry filter
        if (filters.industries && filters.industries.length > 0) {
            const projectIndustry = (project as any).industry;
            if (!projectIndustry || !filters.industries.includes(projectIndustry)) {
                return false;
            }
        }

        // Search term filter
        if (filters.searchTerm && filters.searchTerm.trim()) {
            const searchLower = filters.searchTerm.toLowerCase();
            const matchesName = project.name.toLowerCase().includes(searchLower);
            const matchesDescription = project.description.toLowerCase().includes(searchLower);
            const matchesTech = (project.technologies || []).some(tech =>
                tech.toLowerCase().includes(searchLower)
            );

            if (!matchesName && !matchesDescription && !matchesTech) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Gets all unique technologies from projects
 */
export function getAllTechnologies(projects: (App | Pod)[]): string[] {
    const techSet = new Set<string>();
    projects.forEach(project => {
        (project.technologies || []).forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
}

/**
 * Gets all unique industries from projects
 */
export function getAllIndustries(projects: (App | Pod)[]): Industry[] {
    const industrySet = new Set<Industry>();
    projects.forEach(project => {
        const industry = (project as any).industry;
        if (industry) industrySet.add(industry as Industry);
    });
    return Array.from(industrySet).sort();
}

/**
 * Formats project category for display
 */
export function formatCategory(category: ProjectCategory): string {
    return category;
}

/**
 * Sorts projects by various criteria
 */
export function sortProjects<T extends { name: string; createdAt?: Date | string | null }>(
    projects: T[],
    sortBy: "name" | "date" | "newest" | "oldest"
): T[] {
    const sorted = [...projects];

    switch (sortBy) {
        case "name":
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "date":
        case "newest":
            return sorted.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        case "oldest":
            return sorted.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateA - dateB;
            });
        default:
            return sorted;
    }
}
