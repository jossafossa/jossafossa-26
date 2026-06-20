import type { Profile } from '@/data/cv.types';
import { Container } from '@/ui/Container';
import { Row } from '@/ui/Row';
import { Col } from '@/ui/Col';
import { Button } from '@/ui/Button';
import { FancyTable } from '@/ui/FancyTable';
import { BubbleImage } from '@/ui/BubbleImage';
import styles from './Header.module.scss';

export type HeaderProps = {
  profile: Profile;
};

export function Header({ profile }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Container>
        <Row className={styles.inner}>
          <Col span={12} lg={8} className={styles.left}>
            <div className={styles.photo}>
              <BubbleImage images={profile.images} alt={profile.name} />
            </div>
            <div className={`${styles.content} ${styles.horCenter}`}>
              <h1 className={styles.name}>{profile.name}</h1>
              <div className={styles.keyValue}>
                <div>{profile.linksLabel}</div>
                {profile.links.map((link) => (
                  <Button key={link.url} href={link.url}>
                    {link.label}
                  </Button>
                ))}
              </div>
            </div>
          </Col>
          <Col span={12} lg={4} className={styles.information}>
            <FancyTable
              variant="condensed"
              rows={profile.contactInfo.map((c) => [c.label, c.value])}
            />
          </Col>
        </Row>
      </Container>
    </header>
  );
}
