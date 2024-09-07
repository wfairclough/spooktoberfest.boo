import type { MetaFunction } from "@remix-run/node";
import styles from './index.module.css';

export const meta: MetaFunction = () => {
  return [
    { title: "SpoOktober Fest" },
    { name: "description", content: `Welcome to SpoOktober Fest ${new Date().getFullYear()}!` },
  ];
};

export default function Index() {
  return (
    <>
      <div>
        <h1>Welcome to SpoOktober Fest!</h1>
        <div className={styles.all}>
          <div className={styles['page-flip']}>
            <div className={styles.r1}>
              <div className={styles.p1}>
                <div>
                  <div></div>
                </div>
              </div>
            </div>
            <div className={styles.p2}>
              <div></div>
            </div>
            <div className={styles.r3}>
              <div className={styles.p3}>
                <div>
                  <div></div>
                </div>
              </div>
            </div>
            <div className="s">
              <div className={styles.s3}>
                <div className={styles.sp3}></div>
              </div>
            </div>
            <div className={styles.s4 + ' s'}>
              <div className={styles.s2}>
                <div className={styles.sp2}></div>
              </div>
            </div>
            <a className={styles.coke} href="#" title="Pure CSS Coke Can"></a>
            <a className={styles.meninas} href="#" title="CSS 3D Meninas"></a>
          </div>
        </div>
      </div>
    </>
  );
}

