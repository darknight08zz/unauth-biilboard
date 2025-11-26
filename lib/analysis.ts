import sharp from 'sharp';

export interface AnalysisResult {
    width: number;
    height: number;
    aspectRatio: number;
    format: string;
    compliant: boolean;
    details: string;
}

// Standard billboard aspect ratio is often 14:48 (approx 0.29) or similar.
// Let's define a range for "compliant" for now, or just return data.
// Common sizes: 14'x48', 10'x30', 10.5'x36'
const STANDARD_RATIOS = [
    { name: "Bulletin (14x48)", ratio: 14 / 48, tolerance: 0.1 },
    { name: "Poster (10.5x22.8)", ratio: 10.5 / 22.8, tolerance: 0.1 },
    { name: "Junior Poster (6x12)", ratio: 6 / 12, tolerance: 0.1 },
];

export async function analyzeImage(buffer: Buffer): Promise<AnalysisResult> {
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error('Could not extract image dimensions');
    }

    const width = metadata.width;
    const height = metadata.height;
    const aspectRatio = height / width; // Height / Width is standard for vertical/horizontal check? Usually W/H.
    // Let's use W/H for ratio.
    const ratio = width / height;

    let compliant = false;
    let details = "Non-standard aspect ratio";

    // Check against standard ratios
    for (const std of STANDARD_RATIOS) {
        // Check both landscape and portrait orientation
        const stdRatio = std.ratio; // H/W or W/H? 14x48 is W=48, H=14 usually. So 48/14 = 3.42
        // My ratio calc above: width / height.
        // 14x48 (HxW) -> 48/14 = 3.42.

        // Let's assume input is 14x48 (HxW) means Height 14, Width 48.
        // Ratio = Width / Height.

        const targetRatio = 1 / std.ratio; // If std.ratio is H/W.
        // Wait, let's just use the numbers.
        // 14x48 -> 48/14 = 3.428

        // Let's re-define STANDARD_RATIOS with W/H
        // 14x48 -> 3.42
        // 10.5x22.8 -> 2.17
        // 6x12 -> 2.0
    }

    // Simplified compliance check:
    // Just check if resolution is high enough?
    // Or check if it matches 14:48 roughly.

    if (ratio > 3.0 && ratio < 4.0) {
        compliant = true;
        details = "Matches Bulletin (14x48) aspect ratio";
    } else if (ratio > 1.8 && ratio < 2.4) {
        compliant = true;
        details = "Matches Poster/Junior Poster aspect ratio";
    } else {
        details = `Aspect Ratio: ${ratio.toFixed(2)}. Standard ratios are approx 3.4 or 2.0`;
    }

    return {
        width,
        height,
        aspectRatio: ratio,
        format: metadata.format || 'unknown',
        compliant,
        details,
    };
}
