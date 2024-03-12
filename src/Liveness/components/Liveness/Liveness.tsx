"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useAppDispatch, useAppSelector, useMediaQuery } from "@/hooks";
import { setLiveness } from "@/store/appSlice";
import { CloseBtnIcon, Loader, Modal } from "@/ui";
import Detection from "../Detection/Detection";
import styles from "./styles.module.css";

const Liveness = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.app.liveness);

  const isTablet = useMediaQuery("(max-width: 768px)");

  const webcamRef = useRef<Webcam | null>(null);

  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);

  const setLivenessClose = () => {
    dispatch(setLiveness({ isOpen: false }));
    setIsDetectionActive(false);
  };

  const handleLoadedData = () => {
    setTimeout(() => {
      setIsDetectionActive(true);
    }, 1000);
  };

  const handleError = () => setHasAccess(false);

  return (
    <Modal
      size={isTablet ? "xl" : "lg"}
      isOpen={isOpen}
      onClose={setLivenessClose}
    >
      <div className={styles["wrapper"]}>
        <CloseBtnIcon onClose={setLivenessClose} />
        <div className={styles["loader-wrapper"]}>
          {hasAccess ? <Loader /> : <p>Разрешите доступ к камере</p>}
        </div>
        <Webcam
          style={{ opacity: isDetectionActive ? 1 : 0 }}
          onLoadedData={handleLoadedData}
          onUserMediaError={handleError}
          ref={webcamRef}
          mirrored
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          screenshotQuality={1}
        />
        {isDetectionActive && webcamRef.current && (
          <Detection
            webcam={webcamRef.current}
            setIsDetectionActive={setIsDetectionActive}
          />
        )}
      </div>
    </Modal>
  );
};

export default Liveness;
