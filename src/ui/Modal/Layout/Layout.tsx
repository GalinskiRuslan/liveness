import { useRef, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";
import styles from "./styles.module.css";

const overlayAnimation = {
  enter: styles["overlay-enter"],
  enterActive: styles["overlay-enter-active"],
  exit: styles["overlay-exit"],
  exitActive: styles["overlay-exit-active"],
};

const modalContentAnimation = {
  enter: styles["modal-content-enter"],
  enterActive: styles["modal-content-enter-active"],
  exit: styles["modal-content-exit"],
  exitActive: styles["modal-content-exit-active"],
};

const popupContentAnimation = {
  enter: styles["popup-content-enter"],
  enterActive: styles["popup-content-enter-active"],
  exit: styles["popup-content-exit"],
  exitActive: styles["popup-content-exit-active"],
};

const animation = {
  sm: modalContentAnimation,
  lg: modalContentAnimation,
  xl: popupContentAnimation,
};

interface LayoutProps {
  size: "sm" | "lg" | "xl";
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Layout = ({ size, isOpen, onClose, children }: LayoutProps) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const [animationIn, setAnimationIn] = useState(false);

  useEffect(() => {
    setAnimationIn(isOpen);
  }, [isOpen]);

  return (
    <div
      className={styles["container"]}
      style={{ padding: size !== "xl" ? "30px" : 0 }}
      role="dialog"
      onClick={(evt) => evt.stopPropagation()}
    >
      <CSSTransition
        classNames={overlayAnimation}
        nodeRef={overlayRef}
        in={animationIn}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <div
          className={styles["overlay"]}
          ref={overlayRef}
          role="button"
          tabIndex={0}
          onClick={onClose}
        />
      </CSSTransition>
      <CSSTransition
        classNames={animation[size]}
        nodeRef={contentRef}
        in={animationIn}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <div
          className={classNames(styles["content"], {
            [styles["sm-size"]]: size === "sm",
            [styles["lg-size"]]: size === "lg",
            [styles["xl-size"]]: size === "xl",
          })}
          ref={contentRef}
        >
          {children}
        </div>
      </CSSTransition>
    </div>
  );
};

export default Layout;
