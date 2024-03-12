declare interface Landmarks {
  faceLandmarks: Point[];
  boundingBox: BoundingBox;
  lipsLandmarks: Point[];
  leftEyeLandmarks: Point[];
  rightEyeLandmarks: Point[];
}

declare interface Point {
  x: number;
  y: number;
}

declare interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

declare interface BoundingBox {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
