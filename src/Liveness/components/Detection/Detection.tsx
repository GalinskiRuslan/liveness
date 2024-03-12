import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import FaceDetector from "@/models/faceDetector";
import {
  blinkDetection,
  calculateFaceArea,
  checkDistanceArea,
  checkInsideArea,
  smileDetection,
} from "@/utils/liveness";
import { setImageData, setLiveness } from "@/store/appSlice";
import { useAppDispatch, useMediaQuery } from "@/hooks";
import { sleep } from "@/utils";
import styles from "./styles.module.css";

const faceDetector: FaceDetector = new FaceDetector({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

interface DetectionProps {
  webcam: Webcam;
  setIsDetectionActive: Dispatch<SetStateAction<boolean>>;
}

const Detection = ({ webcam, setIsDetectionActive }: DetectionProps) => {
  const dispatch = useAppDispatch();

  const isTablet = useMediaQuery("(max-width: 768px)");

  const ovalRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [landmarks, setLandmarks] = useState<Landmarks>({
    faceLandmarks: [],
    leftEyeLandmarks: [],
    lipsLandmarks: [],
    rightEyeLandmarks: [],
    boundingBox: {
      xMax: 0,
      yMax: 0,
      xMin: 0,
      yMin: 0,
    },
  });

  const video = webcam?.video;

  const width = video?.clientWidth ?? 0;
  const height = video?.clientHeight ?? 0;

  const widthMultiplyKf = isTablet ? 0.5 : 0.4;
  const heightMultiplyKf = isTablet ? 0.5 : 0.6;

  const setLivenessClose = async () => {
    dispatch(setLiveness({ isOpen: false }));
    setIsDetectionActive(false);
  };

  const setBorderColor = (color: string) => {
    if (ovalRef.current) {
      ovalRef.current.style.borderColor = color;
    }
  };

  const setMessage = (message: string) => {
    if (messageRef.current) {
      messageRef.current.innerText = message;
    }
  };

  const capturePhoto = async () => {
    await sleep();
    const imageData = webcam.getScreenshot();
    dispatch(setImageData(imageData));
    setLivenessClose();
  };

  const stopCamera = async () => {
    await cameraRef.current?.stop();
  };

  const handleCurrentStep = async (landmarks: Landmarks) => {
    if (currentStep === 1) {
      setMessage("Улыбнитесь");
      if (smileDetection(landmarks.lipsLandmarks, landmarks.faceLandmarks)) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setMessage("Моргните");
      if (
        blinkDetection(landmarks.leftEyeLandmarks, landmarks.rightEyeLandmarks)
      ) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setMessage("Не двигайтесь");
      setCurrentStep(4);
      capturePhoto();
    }
  };

  useEffect(() => {
    if (ovalRef.current) {
      ovalRef.current.style.width = `${width * widthMultiplyKf}px`;
      ovalRef.current.style.height = `${height * heightMultiplyKf}px`;
    }
    const init = async () => {
      if (video) {
        cameraRef.current = new Camera(video, {
          onFrame: async () => {
            if (video) {
              const results = await faceDetector.detectFace(video);
              if (results) {
                setLandmarks(results);
              }
            }
          },
        });
        await cameraRef.current.start();
      }
    };
    init();
  }, []);

  useEffect(() => {
    const faceArea = calculateFaceArea(
      width,
      height,
      widthMultiplyKf,
      heightMultiplyKf
    );
    if (checkInsideArea(faceArea, landmarks.faceLandmarks)) {
      setBorderColor("green");
      if (checkDistanceArea(faceArea, landmarks.boundingBox)) {
        handleCurrentStep(landmarks);
      } else {
        setMessage("Приблизьтесь к камере");
        setBorderColor("yellow");
      }
    } else {
      setBorderColor("red");
      setMessage("Поместите лицо в центр овала");
    }
  }, [landmarks]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={styles["oval"]} ref={ovalRef}>
      <p ref={messageRef}></p>
    </div>
  );
};

export default Detection;
