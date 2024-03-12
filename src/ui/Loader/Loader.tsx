import styles from "./styles.module.css";

const Loader = () => {
  return (
    <div className={styles["loader"]}>
      {Array.from({ length: 4 }).map((_, idx) => (
        <span
          key={idx}
          className={styles["dot"]}
          style={{ animationDelay: `${0.4 * idx}s` }}
        />
      ))}
    </div>
  );
};

export default Loader;
