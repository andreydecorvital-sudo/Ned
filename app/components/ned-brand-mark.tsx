import styles from "./ned-brand-mark.module.css";

export function NedSpiral({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`${styles.spiral} ${className}`}
      viewBox="0 0 32 32"
      aria-hidden="true"
      data-brand-asset="ned-symbol-spiral"
    >
      <path d="M16 3.5c-7 0-12.5 5.2-12.5 12 0 7.2 5.7 13 13.1 13 6.5 0 11.6-4.3 11.6-10.1 0-5.1-3.9-9-8.8-9-4.3 0-7.6 2.9-7.6 6.6 0 3.3 2.5 5.8 5.8 5.8 2.8 0 4.8-1.8 4.8-4.1 0-1.9-1.5-3.3-3.3-3.3-1.5 0-2.7 1-2.7 2.2" />
    </svg>
  );
}

export default function NedBrandMark({
  compact = false,
  href = "/",
}: {
  compact?: boolean;
  href?: string;
}) {
  const source = compact ? "/brand/ned-wordmark.svg" : "/brand/ned-logo-flat.svg";

  return (
    <a
      className={`${styles.mark} ${compact ? styles.compact : ""}`}
      href={href}
      aria-label="NED Marketing — início"
      data-brand-status="canonical-vector-implementation"
    >
      <img
        className={styles.logo}
        src={source}
        alt="NED Marketing"
        width={compact ? 535 : 560}
        height={compact ? 145 : 190}
      />
    </a>
  );
}
