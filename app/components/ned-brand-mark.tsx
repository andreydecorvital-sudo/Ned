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
  href?: string;
  variant?: "wordmark" | "signature";
  vector?: boolean;
};

export default function NedBrandMark({
  href = "/",
  variant = "wordmark",
  vector = false,
}: NedBrandMarkProps) {
  const isWordmark = variant === "wordmark";

  return (
    <a
      className={`${styles.mark} ${isWordmark ? styles.wordmark : styles.signature}`}
      href={href}
      aria-label="NED Marketing — início"
      data-brand-status="official-user-supplied-logo"
      data-brand-variant={variant}
    >
      {isWordmark ? (
        vector ? (
          <img
            className={styles.vectorWordmark}
            src="/brand/ned-wordmark-vector.svg"
            alt="NED"
            width={520}
            height={120}
          />
        ) : (
          <span className={styles.rasterCrop} aria-hidden="true">
            <img
              className={styles.rasterLogo}
              src="/brand/ned-logo-official.webp"
              alt=""
              width={420}
              height={201}
            />
          </span>
        )
      ) : (
        <img
          className={styles.fullLogo}
          src="/brand/ned-logo-official.webp"
          alt="NED Marketing"
          width={420}
          height={201}
        />
      )}
    </a>
  );
}
