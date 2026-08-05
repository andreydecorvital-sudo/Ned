import styles from "./ned-brand-mark.module.css";

export default function NedBrandMark({
  compact = false,
  href = "/",
}: {
  compact?: boolean;
  href?: string;
}) {
  return (
    <a
      className={`${styles.mark} ${compact ? styles.compact : ""}`}
      href={href}
      aria-label="NED Marketing — início"
      data-brand-status="official-user-supplied-logo"
    >
      <img
        className={styles.logo}
        src="/brand/ned-logo-official.webp"
        alt="NED Marketing"
        width={420}
        height={201}
      />
    </a>
  );
}
