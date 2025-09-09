export interface ComplianceRule {
  id: string
  category: "size" | "placement" | "structural" | "content" | "digital"
  name: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  checkFunction: (billboard: BillboardData) => ComplianceResult
}

export interface BillboardData {
  dimensions: {
    width: number
    height: number
    area: number
  }
  location: {
    distanceFromIntersection?: number
    distanceFromTrafficSignals?: number
    distanceFromResidential?: number
    zoneType: "commercial" | "industrial" | "residential" | "highway"
    nearIntersection: boolean
    hasTrafficSignalsVisible: boolean
  }
  structural: {
    hasStructuralIssues: boolean
    lastInspectionDate?: string
    supportCondition: "good" | "fair" | "poor" | "critical"
  }
  content: {
    hasProhibitedContent: boolean
    isIlluminated: boolean
    flashingLights: boolean
    isDigital: boolean
    brightnessLevel?: "low" | "medium" | "high" | "excessive"
  }
}

export interface ComplianceResult {
  isCompliant: boolean
  violationMessage?: string
  recommendedAction?: string
  fineAmount?: number
  urgency?: "immediate" | "within_30_days" | "within_60_days" | "routine"
}

// Enhanced compliance rules with image-based distance detection
export const complianceRules: ComplianceRule[] = [
  {
    id: "SIZE_001",
    category: "size",
    name: "Maximum Size Limit",
    description: "Billboard must not exceed 120 square feet in commercial zones",
    severity: "high",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      const maxArea = billboard.location.zoneType === "highway" ? 200 : 120
      if (billboard.dimensions.area > maxArea) {
        return {
          isCompliant: false,
          violationMessage: `Billboard exceeds maximum size limit (${billboard.dimensions.area} sq ft > ${maxArea} sq ft)`,
          recommendedAction: "Reduce billboard size or relocate to appropriate zone",
          fineAmount: 500,
          urgency: "within_60_days"
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "PLACEMENT_001",
    category: "placement",
    name: "Intersection Distance - Critical Safety Zone",
    description: "Billboard must be at least 300 feet from intersections with traffic signals",
    severity: "critical",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      // Enhanced logic for image-detected proximity
      if (billboard.location.nearIntersection && billboard.location.hasTrafficSignalsVisible) {
        const distance = billboard.location.distanceFromIntersection || 0
        if (distance < 300) {
          return {
            isCompliant: false,
            violationMessage: `Billboard critically positioned too close to signalized intersection (estimated ${distance} ft < required 300 ft minimum)`,
            recommendedAction: "IMMEDIATE relocation required - poses traffic safety hazard",
            fineAmount: 1500,
            urgency: "immediate"
          }
        }
      }
      
      // Standard intersection distance check
      if (billboard.location.distanceFromIntersection !== undefined && 
          billboard.location.distanceFromIntersection < 300) {
        return {
          isCompliant: false,
          violationMessage: `Billboard too close to intersection (${billboard.location.distanceFromIntersection} ft < 300 ft required)`,
          recommendedAction: "Relocate billboard to maintain 300ft minimum distance from intersection",
          fineAmount: 750,
          urgency: "within_30_days"
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "PLACEMENT_002", 
    category: "placement",
    name: "Traffic Signal Visibility",
    description: "Billboard must not obstruct or interfere with traffic signal visibility",
    severity: "critical",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (billboard.location.hasTrafficSignalsVisible && 
          billboard.location.distanceFromTrafficSignals !== undefined &&
          billboard.location.distanceFromTrafficSignals < 150) {
        return {
          isCompliant: false,
          violationMessage: `Billboard may obstruct traffic signal visibility (${billboard.location.distanceFromTrafficSignals} ft from signals)`,
          recommendedAction: "Conduct visibility impact study and relocate if necessary",
          fineAmount: 2000,
          urgency: "immediate"
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "DIGITAL_001",
    category: "digital",
    name: "Digital Billboard Intersection Restrictions",
    description: "Digital billboards have stricter placement rules near intersections",
    severity: "high",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (billboard.content.isDigital && billboard.location.nearIntersection) {
        const minDistance = 500 // Stricter requirement for digital signs
        const distance = billboard.location.distanceFromIntersection || 0
        
        if (distance < minDistance) {
          return {
            isCompliant: false,
            violationMessage: `Digital billboard too close to intersection (${distance} ft < ${minDistance} ft required for digital signage)`,
            recommendedAction: "Relocate digital billboard or convert to static signage",
            fineAmount: 1200,
            urgency: "within_30_days"
          }
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "DIGITAL_002",
    category: "digital", 
    name: "Digital Billboard Brightness Control",
    description: "Digital billboards must have appropriate brightness levels to prevent driver distraction",
    severity: "medium",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (billboard.content.isDigital && billboard.content.brightnessLevel === "excessive") {
        return {
          isCompliant: false,
          violationMessage: "Digital billboard brightness exceeds safe levels for traffic areas",
          recommendedAction: "Install automatic brightness controls and reduce daytime brightness",
          fineAmount: 600,
          urgency: "within_30_days"
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "STRUCTURAL_001",
    category: "structural",
    name: "Structural Safety",
    description: "Billboard structure must be in safe condition",
    severity: "critical",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (billboard.structural.hasStructuralIssues ||
          billboard.structural.supportCondition === "critical" ||
          billboard.structural.supportCondition === "poor") {
        return {
          isCompliant: false,
          violationMessage: `Structural safety concerns detected (${billboard.structural.supportCondition} condition)`,
          recommendedAction: "Immediate structural inspection and repairs or removal required",
          fineAmount: 2000,
          urgency: "immediate"
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "CONTENT_001",
    category: "content",
    name: "Prohibited Content",
    description: "Billboard must not contain prohibited content",
    severity: "medium",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (billboard.content.hasProhibitedContent) {
        return {
          isCompliant: false,
          violationMessage: "Billboard contains prohibited content",
          recommendedAction: "Remove or modify prohibited content",
          fineAmount: 300,
          urgency: "within_30_days"
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "CONTENT_002",
    category: "content",
    name: "Flashing Lights Prohibited",
    description: "Billboard cannot have flashing or moving lights",
    severity: "high",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (billboard.content.flashingLights) {
        return {
          isCompliant: false,
          violationMessage: "Billboard has prohibited flashing lights - traffic safety hazard",
          recommendedAction: "Immediately disable flashing lights, static illumination only",
          fineAmount: 800,
          urgency: "immediate"
        }
      }
      return { isCompliant: true }
    },
  },
]

export class ComplianceEngine {
  private rules: ComplianceRule[]

  constructor(rules: ComplianceRule[] = complianceRules) {
    this.rules = rules
  }

  checkCompliance(billboard: BillboardData): {
    overallCompliance: boolean
    violations: Array<{
      rule: ComplianceRule
      result: ComplianceResult
    }>
    complianceScore: number
    totalFines: number
    riskLevel: "low" | "medium" | "high" | "critical"
    immediateActionRequired: boolean
    priorityViolations: Array<{
      rule: ComplianceRule
      result: ComplianceResult
    }>
  } {
    const violations: Array<{ rule: ComplianceRule; result: ComplianceResult }> = []
    const priorityViolations: Array<{ rule: ComplianceRule; result: ComplianceResult }> = []
    let totalFines = 0
    let criticalViolations = 0
    let highViolations = 0
    let immediateActionRequired = false

    // Check each rule
    for (const rule of this.rules) {
      const result = rule.checkFunction(billboard)
      if (!result.isCompliant) {
        violations.push({ rule, result })
        totalFines += result.fineAmount || 0

        if (rule.severity === "critical") {
          criticalViolations++
          priorityViolations.push({ rule, result })
        }
        else if (rule.severity === "high") {
          highViolations++
          priorityViolations.push({ rule, result })
        }

        if (result.urgency === "immediate") {
          immediateActionRequired = true
        }
      }
    }

    // Calculate compliance score (0-100)
    const totalRules = this.rules.length
    const violationCount = violations.length
    const complianceScore = Math.round(((totalRules - violationCount) / totalRules) * 100)

    // Determine risk level with enhanced logic
    let riskLevel: "low" | "medium" | "high" | "critical" = "low"
    if (criticalViolations > 0 || immediateActionRequired) riskLevel = "critical"
    else if (highViolations > 2 || totalFines > 1000) riskLevel = "high"  
    else if (highViolations > 0 || violations.length > 3) riskLevel = "medium"

    return {
      overallCompliance: violations.length === 0,
      violations,
      complianceScore,
      totalFines,
      riskLevel,
      immediateActionRequired,
      priorityViolations
    }
  }

  getRulesByCategory(category: ComplianceRule["category"]): ComplianceRule[] {
    return this.rules.filter((rule) => rule.category === category)
  }

  getRuleById(id: string): ComplianceRule | undefined {
    return this.rules.find((rule) => rule.id === id)
  }

  // New method to analyze image-based positioning
  analyzeImagePositioning(imageAnalysisData: {
    nearIntersection: boolean
    hasVisibleTrafficSignals: boolean
    estimatedDistanceFromIntersection: number
    estimatedDistanceFromTrafficSignals: number
  }): Partial<BillboardData['location']> {
    return {
      nearIntersection: imageAnalysisData.nearIntersection,
      hasTrafficSignalsVisible: imageAnalysisData.hasVisibleTrafficSignals,
      distanceFromIntersection: imageAnalysisData.estimatedDistanceFromIntersection,
      distanceFromTrafficSignals: imageAnalysisData.estimatedDistanceFromTrafficSignals
    }
  }
}

// Enhanced AI Analysis with Realistic Assessment
export function enhanceAnalysisWithCompliance(
  imageAnalysis: any,
  locationData?: any,
): {
  billboardData: BillboardData
  complianceResults: ReturnType<ComplianceEngine["checkCompliance"]>
} {
  // Realistic analysis based on image context
  const isNearIntersection = imageAnalysis?.detectsIntersection ?? false 
  const hasTrafficSignals = imageAnalysis?.detectsTrafficSignals ?? false 
  
  // More realistic distance estimates for well-positioned billboards
  const estimatedDistance = imageAnalysis?.estimatedDistanceFromIntersection ?? 200 // Reasonable distance
  
  const billboardData: BillboardData = {
    dimensions: {
      width: imageAnalysis?.estimatedWidth || 16,
      height: imageAnalysis?.estimatedHeight || 9,  
      area: 0,
    },
    location: {
      distanceFromIntersection: estimatedDistance,
      distanceFromTrafficSignals: imageAnalysis?.distanceFromTrafficSignals || 150, // Safe distance
      zoneType: locationData?.zoneType || "commercial",
      nearIntersection: isNearIntersection,
      hasTrafficSignalsVisible: hasTrafficSignals
    },
    structural: {
      hasStructuralIssues: imageAnalysis?.structuralIssues ?? false,
      supportCondition: imageAnalysis?.supportCondition || "good" // Assume good condition unless detected otherwise
    },
    content: {
      hasProhibitedContent: imageAnalysis?.prohibitedContent ?? false,
      isIlluminated: imageAnalysis?.illuminated ?? true,
      flashingLights: imageAnalysis?.flashingLights ?? false, // Assume compliant unless detected
      isDigital: imageAnalysis?.isDigital ?? true,
      brightnessLevel: imageAnalysis?.brightnessLevel || "medium" // Reasonable brightness
    },
  }

  // Calculate area
  billboardData.dimensions.area = billboardData.dimensions.width * billboardData.dimensions.height

  // Run compliance check with enhanced engine
  const complianceEngine = new ComplianceEngine()
  const complianceResults = complianceEngine.checkCompliance(billboardData)

  return {
    billboardData,
    complianceResults,
  }
}

// Utility function to generate compliance report
export function generateComplianceReport(
  complianceResults: ReturnType<ComplianceEngine["checkCompliance"]>,
  billboardData: BillboardData
): string {
  let report = "=== BILLBOARD COMPLIANCE ANALYSIS REPORT ===\n\n"
  
  report += `Overall Compliance: ${complianceResults.overallCompliance ? "COMPLIANT" : "NON-COMPLIANT"}\n`
  report += `Compliance Score: ${complianceResults.complianceScore}%\n`
  report += `Risk Level: ${complianceResults.riskLevel.toUpperCase()}\n`
  report += `Total Fines: $${complianceResults.totalFines}\n`
  
  if (complianceResults.immediateActionRequired) {
    report += "\n🚨 IMMEDIATE ACTION REQUIRED 🚨\n"
  }
  
  if (complianceResults.violations.length > 0) {
    report += "\n--- VIOLATIONS DETECTED ---\n"
    complianceResults.violations.forEach((violation, index) => {
      report += `\n${index + 1}. ${violation.rule.name} (${violation.rule.severity.toUpperCase()})\n`
      report += `   ${violation.result.violationMessage}\n`
      report += `   Action Required: ${violation.result.recommendedAction}\n`
      if (violation.result.fineAmount) {
        report += `   Fine: $${violation.result.fineAmount}\n`
      }
      if (violation.result.urgency) {
        report += `   Timeline: ${violation.result.urgency.replace('_', ' ').toUpperCase()}\n`
      }
    })
  }
  
  return report
}