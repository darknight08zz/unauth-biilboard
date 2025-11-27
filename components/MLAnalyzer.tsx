"use client";

import { useEffect, useRef, useState } from 'react';
import * as ort from 'onnxruntime-web';
import { preprocess, postprocess, LABELS, BILLBOARD_LABELS } from '@/utils/yolo';

// Set wasm path to CDN or local public folder if you copy the wasm files there
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";

interface AnalysisResult {
    width: number;
    height: number;
    aspectRatio: number;
    compliant: boolean;
    details: string;
    detections: any[];
}

interface MLAnalyzerProps {
    imageUrl: string | null;
    onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function MLAnalyzer({ imageUrl, onAnalysisComplete }: MLAnalyzerProps) {
    const [status, setStatus] = useState<string>('Idle');
    const [progress, setProgress] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [session, setSession] = useState<ort.InferenceSession | null>(null);
    const [debugMode, setDebugMode] = useState<boolean>(false);
    const [lastDetections, setLastDetections] = useState<any[]>([]);

    useEffect(() => {
        loadModel();
    }, []);

    useEffect(() => {
        if (imageUrl && session) {
            analyze();
        }
    }, [imageUrl, session]);

    const loadModel = async () => {
        try {
            setStatus('Loading YOLO model... (Check public/models/)');
            // Try to load the custom trained model first
            const modelPath = '/models/best.onnx';

            // Check if model exists (optional, fetch head)
            const response = await fetch(modelPath, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error(`Model not found at ${modelPath}. Please train your model and place it in public/models/best.onnx`);
            }

            const sess = await ort.InferenceSession.create(modelPath, {
                executionProviders: ['wasm'],
            });
            setSession(sess);
            setStatus('Model loaded');
        } catch (err: any) {
            console.error("Failed to load model", err);
            setStatus(`Error: ${err.message}`);
        }
    };

    const analyze = async () => {
        if (!imageUrl || !canvasRef.current || !session) return;

        setStatus('Analyzing...');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        img.onload = async () => {
            const canvas = canvasRef.current!;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);

            try {
                // 1. Preprocess
                const modelInputShape = [640, 640]; // YOLOv8 standard
                const { tensor, xRatio, yRatio } = preprocess(img, modelInputShape[0], modelInputShape[1]);

                // 2. Run Inference
                const feeds = { images: tensor };
                const results = await session.run(feeds);

                // YOLOv8 output name is usually 'output0', check your model if different
                const output = results[session.outputNames[0]];

                // 3. Postprocess
                const detections = postprocess(
                    output,
                    xRatio,
                    yRatio,
                    0.25, // Confidence Threshold
                    0.45, // IoU Threshold
                    LABELS // Use COCO labels or custom BILLBOARD_LABELS if trained on single class
                );

                console.log("Detections:", detections);
                setLastDetections(detections);

                // 4. Draw Boxes & Select Best Candidate
                let billboardBox = null;
                let maxArea = 0;
                let bestLabel = "";
                let bestScore = 0;

                // Filter for billboard-like objects if using COCO model, or just take 'billboard' if custom
                // For now, let's assume custom model might return 'billboard' (class 0) or we look for 'tv', 'sign' in COCO
                const TARGET_CLASSES = ['billboard', 'tv', 'monitor', 'screen', 'sign', 'banner', 'poster'];

                detections.forEach((det: any) => {
                    const { box, label, score } = det;
                    const { xmax, xmin, ymax, ymin } = box;
                    const width = xmax - xmin;
                    const height = ymax - ymin;
                    const area = width * height;

                    // If label is in our target list OR we just accept everything from a custom 1-class model
                    const isTarget = TARGET_CLASSES.includes(label.toLowerCase()) || detections.length <= 5;

                    if (isTarget && area > maxArea) {
                        maxArea = area;
                        billboardBox = box;
                        bestLabel = label;
                        bestScore = score;
                    }
                });

                // Draw Best Candidate
                if (billboardBox) {
                    const { xmax, xmin, ymax, ymin } = billboardBox;
                    const width = xmax - xmin;
                    const height = ymax - ymin;

                    ctx.strokeStyle = '#00FF00'; // Bright Green
                    ctx.lineWidth = 4;
                    ctx.strokeRect(xmin, ymin, width, height);

                    ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
                    const text = `${bestLabel} (${Math.round(bestScore * 100)}%)`;
                    const textWidth = ctx.measureText(text).width;
                    ctx.fillRect(xmin, ymin - 25, textWidth + 10, 25);

                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 16px Arial';
                    ctx.fillText(text, xmin + 5, ymin - 7);
                } else {
                    // Fallback: use entire image
                    billboardBox = { xmin: 0, ymin: 0, xmax: img.width, ymax: img.height };
                    ctx.strokeStyle = '#FFFF00';
                    ctx.lineWidth = 4;
                    ctx.setLineDash([10, 5]);
                    ctx.strokeRect(0, 0, img.width, img.height);
                    ctx.setLineDash([]);
                }

                const bbWidth = billboardBox.xmax - billboardBox.xmin;
                const bbHeight = billboardBox.ymax - billboardBox.ymin;
                const aspectRatio = bbWidth / bbHeight;

                // Compliance Check (Updated for India 2024 Rules - Mumbai/Bangalore)
                let compliant = false;
                let details = "Non-standard size";
                let violation = "Unknown";

                // Tolerance for aspect ratio matching
                const tolerance = 0.2;

                // 1. Square / Near-Square (Mumbai 2024 Policy: Max 40x40ft)
                // Aspect Ratio ~1.0
                if (Math.abs(aspectRatio - 1.0) < tolerance) {
                    compliant = true;
                    details = "Matches Mumbai 2024 Policy (Square 1:1, e.g., 40x40ft)";
                    violation = "None (Ensure size < 40x40ft)";
                }
                // 2. Standard Wide (Bulletin) (14x48ft -> Ratio ~3.4)
                // WARNING: Bangalore 2024 restricts width to 40ft. 14x48 is 48ft wide -> Violation in Bangalore.
                else if (Math.abs(aspectRatio - 3.4) < 0.4) {
                    compliant = true; // It's a standard shape, but might violate local rules
                    details = "Standard Bulletin (14x48ft)";
                    violation = "Potential Violation: Width > 40ft (Bangalore 2024 Rules)";
                }
                // 3. Junior Poster / Wide (12x24ft -> Ratio ~2.0)
                else if (Math.abs(aspectRatio - 2.0) < 0.3) {
                    compliant = true;
                    details = "Junior Poster (12x24ft)";
                    violation = "None (Check local height restrictions)";
                }
                // 4. Portrait / Vertical (Often illegal if obstructing views)
                else if (aspectRatio < 0.8) {
                    compliant = false;
                    details = "Vertical/Portrait Format";
                    violation = "High Risk: Vertical billboards often restricted near roads";
                }
                else {
                    details = `Detected Ratio: ${aspectRatio.toFixed(2)}`;
                    violation = "Non-standard dimensions";
                }

                const result: AnalysisResult = {
                    width: bbWidth,
                    height: bbHeight,
                    aspectRatio,
                    compliant,
                    details: `${details}. Note: ${violation}`,
                    detections
                };

                onAnalysisComplete(result);
                setStatus('Analysis Complete');

            } catch (err) {
                console.error("Analysis failed", err);
                setStatus('Analysis failed');
            }
        };
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-semibold mb-2 flex justify-between items-center">
                AI Analysis (YOLOv8 ONNX)
                <button
                    onClick={() => setDebugMode(!debugMode)}
                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300"
                >
                    {debugMode ? 'Hide Debug' : 'Show Debug'}
                </button>
            </h3>
            <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Status: <span className="font-medium">{status}</span>
            </div>

            {status.includes('Loading') && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
            )}

            <div className="relative overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                <canvas ref={canvasRef} className="w-full h-auto block" />
            </div>

            {debugMode && (
                <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-auto max-h-40">
                    <p className="font-bold mb-1">Raw Detections:</p>
                    <pre className="whitespace-pre-wrap break-words">
                        {JSON.stringify(lastDetections, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
