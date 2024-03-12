import { FaceMesh, Options, Results } from "@mediapipe/face_mesh";
import { boundingBox } from "@/utils/liveness";

const indexFaceOval: number[] = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
  400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109,
];

const indexLips: number[] = [
  146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 185, 40, 39, 37, 0, 267, 269,
  270, 409, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 191, 80, 81, 82, 13,
  312, 311, 310, 415,
];

const indexLeftEye: number[] = [33, 160, 158, 133, 153, 144];
const indexRightEye: number[] = [362, 385, 387, 263, 373, 380];

let landmarks: Landmarks | undefined;

export default class FaceDetector {
  private readonly faceMesh = new FaceMesh({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
  });

  constructor(options: Options) {
    this.faceMesh.setOptions(options);
    this.initializeDetection();
  }

  async initializeDetection() {
    await this.faceMesh.initialize();
    this.faceMesh.onResults(this.getLandmarks);
  }

  async detectFace(
    videoElement: HTMLVideoElement
  ): Promise<Landmarks | undefined> {
    await this.faceMesh.send({ image: videoElement });
    return landmarks;
  }

  async getLandmarks(results: Results) {
    const ovalArray: Point[] = [];
    const leftEyeArray: Point[] = [];
    const rightEyeArray: Point[] = [];
    const lipsArray: Point[] = [];
    if (results.multiFaceLandmarks[0] != undefined) {
      const faceLandmarks = results.multiFaceLandmarks[0];
      const width = results.image.width;
      const height = results.image.height;

      for (const index of indexFaceOval) {
        const point: Point = {
          x: faceLandmarks[index].x * width,
          y: faceLandmarks[index].y * height,
        };
        ovalArray.push(point);
      }

      for (const index of indexLips) {
        const point: Point = {
          x: faceLandmarks[index].x * width,
          y: faceLandmarks[index].y * height,
        };
        lipsArray.push(point);
      }

      for (const index of indexLeftEye) {
        const point: Point = {
          x: faceLandmarks[index].x * width,
          y: faceLandmarks[index].y * height,
        };
        leftEyeArray.push(point);
      }

      for (const index of indexRightEye) {
        const point: Point = {
          x: faceLandmarks[index].x * width,
          y: faceLandmarks[index].y * height,
        };
        rightEyeArray.push(point);
      }

      const box: BoundingBox = boundingBox(results);

      landmarks = {
        faceLandmarks: ovalArray,
        leftEyeLandmarks: leftEyeArray,
        rightEyeLandmarks: rightEyeArray,
        lipsLandmarks: lipsArray,
        boundingBox: box,
      } as Landmarks;
    }
  }
}
