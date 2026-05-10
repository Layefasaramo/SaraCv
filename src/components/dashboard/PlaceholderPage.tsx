import styles from "./PlaceholderPage.module.css";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function PlaceholderPage({
  title,
  description,
  icon,
}: PlaceholderPageProps) {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.icon}>{icon}</div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.desc}>{description}</p>
        <span className={styles.badge}>Coming Soon</span>
      </div>
    </div>
  );
}
