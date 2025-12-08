
import { describe, it, expect } from 'vitest'
import { ComplianceEngine, BillboardData } from './compliance-engine'

describe('ComplianceEngine', () => {
    const engine = new ComplianceEngine()

    it('should detect size violation for billboards > 800 sq ft', () => {
        const data: BillboardData = {
            dimensions: { width: 30, height: 30, area: 900 }, // 900 > 800
            location: {
                zoneType: 'commercial',
                nearIntersection: false,
                hasTrafficSignalsVisible: false
            },
            structural: {
                hasStructuralIssues: false,
                supportCondition: 'good'
            },
            content: {
                hasProhibitedContent: false,
                isIlluminated: false,
                flashingLights: false,
                isDigital: false
            }
        }

        const result = engine.checkCompliance(data)
        expect(result.overallCompliance).toBe(false)
        expect(result.violations).toHaveLength(1)
        expect(result.violations[0].rule.id).toBe('SIZE_001')
    })

    it('should pass for compliant billboard', () => {
        const data: BillboardData = {
            dimensions: { width: 20, height: 20, area: 400 },
            location: {
                zoneType: 'commercial',
                nearIntersection: false,
                hasTrafficSignalsVisible: false
            },
            structural: {
                hasStructuralIssues: false,
                supportCondition: 'good'
            },
            content: {
                hasProhibitedContent: false,
                isIlluminated: false,
                flashingLights: false,
                isDigital: false
            }
        }

        const result = engine.checkCompliance(data)
        expect(result.overallCompliance).toBe(true)
        expect(result.violations).toHaveLength(0)
    })

    it('should detect critical intersection violation', () => {
        const data: BillboardData = {
            dimensions: { width: 20, height: 20, area: 400 },
            location: {
                zoneType: 'commercial',
                nearIntersection: true, // Key factor
                hasTrafficSignalsVisible: true, // Key factor
                distanceFromIntersection: 100 // < 300ft limit
            },
            structural: {
                hasStructuralIssues: false,
                supportCondition: 'good'
            },
            content: {
                hasProhibitedContent: false,
                isIlluminated: false,
                flashingLights: false,
                isDigital: false
            }
        }

        const result = engine.checkCompliance(data)
        expect(result.overallCompliance).toBe(false)

        // Should find PLACEMENT_001
        const violation = result.violations.find(v => v.rule.id === 'PLACEMENT_001')
        expect(violation).toBeDefined()
        expect(violation?.rule.severity).toBe('critical')
    })
})
