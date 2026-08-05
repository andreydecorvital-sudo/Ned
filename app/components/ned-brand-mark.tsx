import styles from "./ned-brand-mark.module.css";

export function NedSpiral({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`${styles.spiral} ${className}`}
      viewBox="0 0 32 32"
      aria-hidden="true"
      data-brand-asset="ned-spiral-secondary"
    >
      <path d="M16 3.5c-7 0-12.5 5.2-12.5 12 0 7.2 5.7 13 13.1 13 6.5 0 11.6-4.3 11.6-10.1 0-5.1-3.9-9-8.8-9-4.3 0-7.6 2.9-7.6 6.6 0 3.3 2.5 5.8 5.8 5.8 2.8 0 4.8-1.8 4.8-4.1 0-1.9-1.5-3.3-3.3-3.3-1.5 0-2.7 1-2.7 2.2" />
    </svg>
  );
}

type NedBrandMarkProps = {
  compact?: boolean;
  href?: string;
  variant?: "full" | "header";
};

export default function NedBrandMark({
  compact = false,
  href = "/",
  variant = "full",
}: NedBrandMarkProps) {
  if (variant === "header") {
    return (
      <a
        className={`${styles.mark} ${styles.headerMark}`}
        href={href}
        aria-label="NED Marketing — início"
        data-brand-status="header-lockup"
      >
        <strong className={styles.word}>NED</strong>
        <span className={styles.signature}>
          Marketing <NedSpiral />
        </span>
      </a>
    );
  }

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
