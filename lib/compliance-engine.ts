export interface ComplianceRule {
  id: string
  category: "size" | "placement" | "permit" | "structural" | "content"
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
    distanceFromSchool?: number
    distanceFromResidential?: number
    zoneType: "commercial" | "industrial" | "residential" | "highway"
  }
  permit: {
    hasPermit: boolean
    permitNumber?: string
    expirationDate?: string
    isVisible: boolean
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
  }
}

export interface ComplianceResult {
  isCompliant: boolean
  violationMessage?: string
  recommendedAction?: string
  fineAmount?: number
}

// Define compliance rules
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
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "PLACEMENT_001",
    category: "placement",
    name: "Intersection Distance",
    description: "Billboard must be at least 300 feet from intersections",
    severity: "high",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (
        billboard.location.distanceFromIntersection !== undefined &&
        billboard.location.distanceFromIntersection < 300
      ) {
        return {
          isCompliant: false,
          violationMessage: `Billboard too close to intersection (${billboard.location.distanceFromIntersection} ft < 300 ft)`,
          recommendedAction: "Relocate billboard to maintain 300ft minimum distance",
          fineAmount: 750,
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "PLACEMENT_002",
    category: "placement",
    name: "School Distance",
    description: "Billboard must be at least 500 feet from schools",
    severity: "critical",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (billboard.location.distanceFromSchool !== undefined && billboard.location.distanceFromSchool < 500) {
        return {
          isCompliant: false,
          violationMessage: `Billboard too close to school (${billboard.location.distanceFromSchool} ft < 500 ft)`,
          recommendedAction: "Immediate relocation required",
          fineAmount: 1500,
        }
      }
      return { isCompliant: true }
    },
  },
  {
    id: "PERMIT_001",
    category: "permit",
    name: "Valid Permit Required",
    description: "Billboard must have a valid, visible permit",
    severity: "high",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (!billboard.permit.hasPermit) {
        return {
          isCompliant: false,
          violationMessage: "No valid permit found for billboard",
          recommendedAction: "Obtain proper permits or remove billboard",
          fineAmount: 1000,
        }
      }
      if (!billboard.permit.isVisible) {
        return {
          isCompliant: false,
          violationMessage: "Permit number not clearly visible",
          recommendedAction: "Display permit number prominently",
          fineAmount: 250,
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
      if (
        billboard.structural.hasStructuralIssues ||
        billboard.structural.supportCondition === "critical" ||
        billboard.structural.supportCondition === "poor"
      ) {
        return {
          isCompliant: false,
          violationMessage: `Structural safety concerns detected (${billboard.structural.supportCondition} condition)`,
          recommendedAction: "Immediate structural repairs or removal required",
          fineAmount: 2000,
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
    severity: "medium",
    checkFunction: (billboard: BillboardData): ComplianceResult => {
      if (billboard.content.flashingLights) {
        return {
          isCompliant: false,
          violationMessage: "Billboard has prohibited flashing lights",
          recommendedAction: "Remove flashing lights, static illumination only",
          fineAmount: 400,
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
  } {
    const violations: Array<{ rule: ComplianceRule; result: ComplianceResult }> = []
    let totalFines = 0
    let criticalViolations = 0
    let highViolations = 0

    // Check each rule
    for (const rule of this.rules) {
      const result = rule.checkFunction(billboard)
      if (!result.isCompliant) {
        violations.push({ rule, result })
        totalFines += result.fineAmount || 0

        if (rule.severity === "critical") criticalViolations++
        else if (rule.severity === "high") highViolations++
      }
    }

    // Calculate compliance score (0-100)
    const totalRules = this.rules.length
    const violationCount = violations.length
    const complianceScore = Math.round(((totalRules - violationCount) / totalRules) * 100)

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" | "critical" = "low"
    if (criticalViolations > 0) riskLevel = "critical"
    else if (highViolations > 2) riskLevel = "high"
    else if (highViolations > 0 || violations.length > 3) riskLevel = "medium"

    return {
      overallCompliance: violations.length === 0,
      violations,
      complianceScore,
      totalFines,
      riskLevel,
    }
  }

  getRulesByCategory(category: ComplianceRule["category"]): ComplianceRule[] {
    return this.rules.filter((rule) => rule.category === category)
  }

  getRuleById(id: string): ComplianceRule | undefined {
    return this.rules.find((rule) => rule.id === id)
  }
}

// AI Analysis Enhancement with Compliance
export function enhanceAnalysisWithCompliance(
  imageAnalysis: any,
  locationData?: any,
): {
  billboardData: BillboardData
  complianceResults: ReturnType<ComplianceEngine["checkCompliance"]>
} {
  // Mock AI analysis results - in real implementation, this would come from actual AI
  const billboardData: BillboardData = {
    dimensions: {
      width: imageAnalysis?.estimatedWidth || Math.random() * 20 + 10,
      height: imageAnalysis?.estimatedHeight || Math.random() * 10 + 5,
      area: 0,
    },
    location: {
      distanceFromIntersection: locationData?.distanceFromIntersection || Math.random() * 600,
      distanceFromSchool: locationData?.distanceFromSchool || Math.random() * 800,
      zoneType: locationData?.zoneType || "commercial",
    },
    permit: {
      hasPermit: imageAnalysis?.permitDetected ?? Math.random() > 0.3,
      permitNumber: imageAnalysis?.permitNumber,
      isVisible: imageAnalysis?.permitVisible ?? Math.random() > 0.2,
    },
    structural: {
      hasStructuralIssues: imageAnalysis?.structuralIssues ?? Math.random() > 0.8,
      supportCondition:
        imageAnalysis?.supportCondition ||
        (["good", "fair", "poor", "critical"] as const)[Math.floor(Math.random() * 4)],
    },
    content: {
      hasProhibitedContent: imageAnalysis?.prohibitedContent ?? Math.random() > 0.9,
      isIlluminated: imageAnalysis?.illuminated ?? Math.random() > 0.5,
      flashingLights: imageAnalysis?.flashingLights ?? Math.random() > 0.85,
    },
  }

  // Calculate area
  billboardData.dimensions.area = billboardData.dimensions.width * billboardData.dimensions.height

  // Run compliance check
  const complianceEngine = new ComplianceEngine()
  const complianceResults = complianceEngine.checkCompliance(billboardData)

  return {
    billboardData,
    complianceResults,
  }
}
