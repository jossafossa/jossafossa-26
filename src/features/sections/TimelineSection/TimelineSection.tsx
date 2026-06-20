import type { TimelineGroup, TimelineItem } from '@/data/cv.types';
import { Section } from '@/ui/Section';
import { Container } from '@/ui/Container';
import { SectionTitle } from '@/ui/SectionTitle';
import { FancyTable } from '@/ui/FancyTable';
import { Bulge } from '@/ui/Bulge';
import styles from './TimelineSection.module.scss';

export type TimelineSectionProps = {
  group: TimelineGroup;
};

function TimelineRow({ item }: { item: TimelineItem }) {
  return (
    <div className={styles.item}>
      <header className={styles.itemHeader}>
        <div className={styles.itemTitle}>{item.title}</div>
        <div className={styles.itemDate}>{item.time}</div>
      </header>
      <section className={styles.itemSection}>
        <Bulge>
          <FancyTable variant="condensed" rows={Object.entries(item.attributes)} />
        </Bulge>
      </section>
    </div>
  );
}

export function TimelineSection({ group }: TimelineSectionProps) {
  return (
    <Section variant="dark" id={group.id}>
      <Container noPadding>
        <div className={styles.head}>
          <SectionTitle banner>{group.title}</SectionTitle>
        </div>
        <div className={styles.timeline}>
          <div className={styles.items}>
            {group.items.map((item) => (
              <TimelineRow key={item.title} item={item} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
