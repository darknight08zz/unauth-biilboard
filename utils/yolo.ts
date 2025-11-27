import * as ort from 'onnxruntime-web';

/**
 * YOLOv8 Class Labels (COCO default, but should be overridden if custom model has different classes)
 * For billboard detection, if we trained on 1 class, we just need ['billboard']
 */
export const LABELS = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light",
    "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
    "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove", "skateboard", "surfboard",
    "tennis racket", "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
    "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch",
    "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", "keyboard", "cell phone",
    "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors", "teddy bear",
    "hair drier", "toothbrush"
];

// If using a custom model with only 'billboard', we'll detect that dynamically or use this:
export const BILLBOARD_LABELS = ['billboard'];

/**
 * Preprocess image for YOLOv8
 * Resizes to 640x640, normalizes to [0,1], and creates Tensor
 */
export const preprocess = (image: HTMLImageElement, modelWidth: number, modelHeight: number): { tensor: ort.Tensor, xRatio: number, yRatio: number } => {
    const canvas = document.createElement('canvas');
    canvas.width = modelWidth;
    canvas.height = modelHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get context");

    ctx.drawImage(image, 0, 0, modelWidth, modelHeight);
    const imgData = ctx.getImageData(0, 0, modelWidth, modelHeight);
    const { data } = imgData;

    // YOLOv8 expects float32 [1, 3, 640, 640] normalized to [0, 1]
    const red: number[] = [];
    const green: number[] = [];
    const blue: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
        red.push(data[i] / 255.0);
        green.push(data[i + 1] / 255.0);
        blue.push(data[i + 2] / 255.0);
    }

    const transposedData = [...red, ...green, ...blue]; // [R, R, ... G, G, ... B, B...]
    const tensor = new ort.Tensor('float32', new Float32Array(transposedData), [1, 3, modelWidth, modelHeight]);

    return {
        tensor,
        xRatio: image.width / modelWidth,
        yRatio: image.height / modelHeight
    };
};

/**
 * Postprocess YOLOv8 Output
 * Output shape: [1, 4 + num_classes, 8400]
 * We need to transpose to [8400, 4 + num_classes]
 * Then filter by confidence and apply NMS
 */
export const postprocess = (
    results: ort.Tensor,
    xRatio: number,
    yRatio: number,
    confThreshold: number,
    iouThreshold: number,
    labels: string[]
) => {
    const output = results.data as Float32Array;
    const [batch, channels, anchors] = results.dims; // [1, 84, 8400] usually

    const boxes: any[] = [];
    const scores: any[] = [];
    const classIndices: any[] = [];

    // Transpose loop: Iterate over anchors (8400)
    for (let i = 0; i < anchors; i++) {
        // Find maximum class score
        let maxScore = 0;
        let maxClass = -1;

        // Channels 0-3 are box coords (xc, yc, w, h), 4+ are classes
        for (let c = 4; c < channels; c++) {
            const score = output[c * anchors + i]; // Accessing [c, i] in flattened array
            if (score > maxScore) {
                maxScore = score;
                maxClass = c - 4;
            }
        }

        if (maxScore > confThreshold) {
            const xc = output[0 * anchors + i];
            const yc = output[1 * anchors + i];
            const w = output[2 * anchors + i];
            const h = output[3 * anchors + i];

            const x1 = (xc - w / 2) * xRatio;
            const y1 = (yc - h / 2) * yRatio;
            const x2 = (xc + w / 2) * xRatio;
            const y2 = (yc + h / 2) * yRatio;

            boxes.push([x1, y1, x2, y2]);
            scores.push(maxScore);
            classIndices.push(maxClass);
        }
    }

    // NMS (Non-Maximum Suppression)
    const indices = nms(boxes, scores, iouThreshold);

    return indices.map(i => ({
        box: {
            xmin: boxes[i][0],
            ymin: boxes[i][1],
            xmax: boxes[i][2],
            ymax: boxes[i][3],
        },
        score: scores[i],
        label: labels[classIndices[i]] || "unknown",
        classId: classIndices[i]
    }));
};

/**
 * Simple NMS implementation
 */
const nms = (boxes: number[][], scores: number[], iouThreshold: number): number[] => {
    const indices = Array.from(Array(scores.length).keys()).sort((a, b) => scores[b] - scores[a]);
    const result: number[] = [];

    while (indices.length > 0) {
        const current = indices.shift()!;
        result.push(current);

        for (let i = 0; i < indices.length; i++) {
            const other = indices[i];
            const iou = calculateIoU(boxes[current], boxes[other]);
            if (iou > iouThreshold) {
                indices.splice(i, 1);
                i--;
            }
        }
    }
    return result;
};

const calculateIoU = (box1: number[], box2: number[]): number => {
    const [x1, y1, x2, y2] = box1;
    const [x3, y3, x4, y4] = box2;

    const xi1 = Math.max(x1, x3);
    const yi1 = Math.max(y1, y3);
    const xi2 = Math.min(x2, x4);
    const yi2 = Math.min(y2, y4);

    const interArea = Math.max(0, xi2 - xi1) * Math.max(0, yi2 - yi1);
    const box1Area = (x2 - x1) * (y2 - y1);
    const box2Area = (x4 - x3) * (y4 - y3);
    const unionArea = box1Area + box2Area - interArea;

    return interArea / unionArea;
};
