import styles from "./case-visual.module.css";

type Variant = "score" | "machine" | "studio";

export default function CaseVisual({
  variant,
  large = false,
}: {
  variant: Variant;
  large?: boolean;
}) {
  if (variant === "score") {
    return (
      <div className={`${styles.frame} ${styles.score} ${large ? styles.large : ""}`} aria-label="Prévia visual do NED Score">
        <span className={styles.label}>NED SCORE / DIAGNÓSTICO</span>
        <div className={styles.scoreRing}><strong>78</strong></div>
        <div className={styles.scoreBars} aria-hidden="true">
          <span style={{ "--bar": "82%" } as React.CSSProperties} />
          <span style={{ "--bar": "61%" } as React.CSSProperties} />
          <span style={{ "--bar": "74%" } as React.CSSProperties} />
          <span style={{ "--bar": "46%" } as React.CSSProperties} />
        </div>
      </div>
    );
  }

  if (variant === "machine") {
    return (
      <div className={`${styles.frame} ${styles.machine} ${large ? styles.large : ""}`} aria-label="Prévia visual de A Máquina Quebrada">
        <span className={styles.label}>NED LAB / EXPERIÊNCIA 001</span>
        <div className={styles.machineDesk} aria-hidden="true" />
        <div className={styles.machineScreen} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.machinePhone} aria-hidden="true" />
        <span className={`${styles.hotspot} ${styles.hotspotOne}`}>01</span>
        <span className={`${styles.hotspot} ${styles.hotspotTwo}`}>02</span>
        <span className={`${styles.hotspot} ${styles.hotspotThree}`}>03</span>
      </div>
    );
  }

  return (
    <div className={`${styles.frame} ${styles.studio} ${large ? styles.large : ""}`} aria-label="Prévia visual do NED Growth Studio">
      <span className={styles.label}>GROWTH STUDIO / MÉTODO</span>
      <div className={styles.studioColumns} aria-hidden="true">
        {["Contexto", "Direção", "Revisão"].map((column, index) => (
          <div className={styles.studioColumn} key={column}>
            <strong>{column}</strong>
            <div className={styles.studioCard} />
            <div className={styles.studioCard} />
            {index === 1 && <div className={styles.studioCard} />}
          </div>
        ))}
      </div>
    </div>
  );
}
