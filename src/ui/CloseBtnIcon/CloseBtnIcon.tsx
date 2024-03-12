import styles from "./styles.module.css";

interface CloseBtnIconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose: () => void;
}

const CloseBtnIcon = (props: CloseBtnIconProps) => {
  const { onClose, ...restProps } = props;

  return (
    <button
      className={styles["btn"]}
      aria-label="Закрыть"
      onClick={onClose}
      {...restProps}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
      >
        <path
          d="M2.51513 14.1388L15.022 2.08096M15.022 14.1388L2.51513 2.08096"
          stroke="#322443"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default CloseBtnIcon;
