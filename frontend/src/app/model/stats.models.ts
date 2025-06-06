// Models for the statistics API responses

/**
 * Summary statistics for vulnerabilities
 */
export interface VulnerabilitySummary {
    totalRepos: number;
    criticalTotal: number;
    highTotal: number;
    mediumTotal: number;
    lowTotal: number;
    sastTotal: number;
    scaTotal: number;
    iacTotal: number;
    secretsTotal: number;
    gitlabTotal: number;
    openTotal: number;
    removedTotal: number;
    reviewedTotal: number;
    averageFixTime: number;
}

/**
 * Daily trend data point
 */
export interface VulnerabilityTrendDataPoint {
    date: string;
    sastCritical?: number;
    sastHigh?: number;
    sastMedium?: number;
    sastRest?: number;
    scaCritical?: number;
    scaHigh?: number;
    scaMedium?: number;
    scaRest?: number;
    iacCritical?: number;
    iacHigh?: number;
    iacMedium?: number;
    iacRest?: number;
    secretsCritical?: number;
    secretsHigh?: number;
    secretsMedium?: number;
    secretsRest?: number;
    gitlabCritical?: number;
    gitlabHigh?: number;
    gitlabMedium?: number;
    gitlabRest?: number;
    openFindings?: number;
    removedFindings?: number;
    reviewedFindings?: number;
}

/**
 * Repository statistics
 */
export interface RepositoryStats {
    repoId: number;
    repoName: string;
    teamName: string;
    criticalCount: number;
    highCount: number;
    totalVulnerabilities: number;
    averageFixTime: number;
}

/**
 * Team statistics
 */
export interface TeamStats {
    teamId: number;
    teamName: string;
    repoCount: number;
    criticalCount: number;
    highCount: number;
    totalVulnerabilities: number;
    fixedVulnerabilities: number;
}

/**
 * Chart data structure for Line charts
 */
export interface LineChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        fill: boolean;
        borderColor: string;
        backgroundColor: string;
        borderWidth: number;
    }[];
}

/**
 * Chart data structure for Doughnut charts
 */
export interface DoughnutChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }[];
}