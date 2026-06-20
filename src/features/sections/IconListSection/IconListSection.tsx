import type { IconItem } from '@/data/cv.types';
import { Section } from '@/ui/Section';
import { Container } from '@/ui/Container';
import { SectionTitle } from '@/ui/SectionTitle';
import { Icon } from '@/ui/Icon';
import { Bulge } from '@/ui/Bulge';
// reuse the original attributes styling
import styles from '../AttributesSection/AttributesSection.module.scss';

export type IconListSectionProps = {
  id: string;
  title: string;
  items: IconItem[];
};

export function IconListSection({ id, title, items }: IconListSectionProps) {
  return (
    <Section id={id}>
      <Container>
        <SectionTitle underline="left">{title}</SectionTitle>
        <div className={styles.interestsContainer}>
          {items.map((item) => (
            <Bulge key={item.label} className={styles.marked}>
              {item.icon && <Icon name={item.icon} variant={item.variant} />}
              {item.label}
            </Bulge>
          ))}
        </div>
      </Container>
    </Section>
  );
}
