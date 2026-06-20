import type { SkillGroup } from '@/data/cv.types';
import { Section } from '@/ui/Section';
import { Container } from '@/ui/Container';
import { SectionTitle } from '@/ui/SectionTitle';
import { Rating } from '@/ui/Rating';
// reuse the original attributes styling
import styles from '../AttributesSection/AttributesSection.module.scss';

export type SkillsSectionProps = {
  id: string;
  title: string;
  groups: SkillGroup[];
};

export function SkillsSection({ id, title, groups }: SkillsSectionProps) {
  return (
    <Section id={id}>
      <Container>
        <div className={styles.skills}>
          <SectionTitle underline="left">{title}</SectionTitle>
          <div className={styles.skillsContainer}>
            {groups.map((group) => (
              <div key={group.title} className={styles.skillTable}>
                <div className={styles.skillTableTitle}>{group.title}</div>
                <div className={styles.skillTableContent}>
                  {group.items.map((item) => (
                    <div key={item.label} className={styles.skillTableRow}>
                      <div>{item.label}</div>
                      <Rating value={item.rating} />
                      <div className={styles.suffix}>{item.suffix}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
