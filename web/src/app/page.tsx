import styles from "@/styles/page.module.css";
import { Header } from "@/components/header";
import { Lead } from "@/components/lead";
import { DirectionsGrid } from "@/components/directions-grid";
import { Signatures } from "@/components/signatures";
import { SiteFooter } from "@/components/site-footer";
import { FxProvider } from "@/fx/fx-provider";

export default function Home() {
  return (
    <div className={styles.wrap}>
      <Header />
      <Lead />
      <DirectionsGrid />
      <Signatures />
      <SiteFooter />
      <FxProvider accent="#00e5a0" />
    </div>
  );
}
