import { Results } from "@mediapipe/face_mesh";

const SMILE_RATIO = 0.4;
const UMBRAL = 0.1;

const pointsDistance = (x: number, y: number, x2: number, y2: number) => {
  const a = x - x2;
  const b = y - y2;

  return Math.sqrt(a * a + b * b);
};

const contains = (rect1: Rect, rect2: Rect) => {
  return (
    rect1.x <= rect2.x &&
    rect1.y <= rect2.y &&
    rect1.x + rect1.width >= rect2.x + rect2.width &&
    rect1.y + rect1.height >= rect2.y + rect2.height
  );
};

export const boundingBox = (results: Results): BoundingBox => {
  let cx_min = results.image.width;
  let cy_min = results.image.height;
  let cx_max = 0;
  let cy_max = 0;

  for (const landmark of results.multiFaceLandmarks[0]) {
    const cx = landmark.x * results.image.width;
    const cy = landmark.y * results.image.height;

    if (cx < cx_min) {
      cx_min = cx;
    }
    if (cy < cy_min) {
      cy_min = cy;
    }
    if (cx > cx_max) {
      cx_max = cx;
    }
    if (cy > cy_max) {
      cy_max = cy;
    }
  }
  return {
    xMin: cx_min,
    xMax: cx_max,
    yMin: cy_min,
    yMax: cy_max,
  } as BoundingBox;
};

export const checkInsideArea = (area: Rect, landmarks: Point[]): boolean => {
  if (landmarks.length == 0) return false;

  for (const landmark of landmarks) {
    const point: Rect = {
      x: landmark.x,
      y: landmark.y,
      width: 0,
      height: 0,
    };
    if (!contains(area, point)) {
      return false;
    }
  }
  return true;
};

export const checkDistanceArea = (area: Rect, box: BoundingBox) => {
  const distanceCenter = pointsDistance(
    area.x,
    area.y,
    area.x + area.width / 2,
    area.y + area.height / 2
  );
  const distanceTopLeft = pointsDistance(area.x, area.y, box.xMin, box.yMin);
  const distanceTopRight = pointsDistance(
    area.x + area.width,
    area.y,
    box.xMax,
    box.yMin
  );
  const distanceBottomLeft = pointsDistance(
    area.x,
    area.y + area.height,
    box.xMin,
    box.yMax
  );
  const distanceBottomRight = pointsDistance(
    area.x + area.width,
    area.y + area.height,
    box.xMax,
    box.yMax
  );

  const ratio =
    (distanceTopLeft +
      distanceTopRight +
      distanceBottomLeft +
      distanceBottomRight) /
    (4 * distanceCenter);

  return ratio < 0.4;
};

export const smileDetection = (
  lipsLandmarks: Point[],
  faceLandmarks: Point[]
) => {
  const lipsWidth = Math.abs(lipsLandmarks[10].x - lipsLandmarks[18].x);
  const faceWidth = Math.abs(faceLandmarks[27].x - faceLandmarks[9].x);
  const ratio = lipsWidth / faceWidth;
  return ratio > SMILE_RATIO;
};

export const blinkDetection = (
  coordLeftEye: Point[],
  coordRightEye: Point[]
): boolean => {
  let leftEye = 0;
  let rightEye = 0;

  if (coordLeftEye.length > 0) {
    leftEye = ratio(coordLeftEye);
  }

  if (coordRightEye.length > 0) {
    rightEye = ratio(coordRightEye);
  }

  const ear = (leftEye + rightEye) / 2;

  return ear != 0 && ear < UMBRAL;
};

const ratio = (coordinates: Point[]) => {
  const d_A = coordinates[1].y - coordinates[5].y;
  const d_B = coordinates[2].y - coordinates[4].y;
  const d_C = coordinates[0].x - coordinates[3].x;

  return (d_A + d_B) / (2 * d_C);
};

export const calculateFaceArea = (
  width: number,
  height: number,
  widthMultiplyKf: number,
  heightMultiplyKf: number
): Rect => {
  return {
    x: width / 2 - (width * widthMultiplyKf) / 2,
    y: height / 2 - (height * heightMultiplyKf) / 2,
    width: width * widthMultiplyKf,
    height: height * heightMultiplyKf,
  };
};
