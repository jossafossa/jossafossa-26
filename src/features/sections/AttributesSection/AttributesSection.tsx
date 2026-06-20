import type { SkillsBlock, NamedIconList } from '@/data/cv.types';
import { Section } from '@/ui/Section';
import { Container } from '@/ui/Container';
import { Row } from '@/ui/Row';
import { Col } from '@/ui/Col';
import { SectionTitle } from '@/ui/SectionTitle';
import { Rating } from '@/ui/Rating';
import { Icon } from '@/ui/Icon';
import { Bulge } from '@/ui/Bulge';
import styles from './AttributesSection.module.scss';

export type AttributesSectionProps = {
  skills: SkillsBlock;
  qualities: NamedIconList;
  interests: NamedIconList;
};

export function AttributesSection({ skills, qualities, interests }: AttributesSectionProps) {
  return (
    <Section id="attributes">
      <Container>
        <Row>
          <Col span={12} lg={8}>
            <div id="skills" className={styles.skills}>
              <SectionTitle underline="left">{skills.title}</SectionTitle>
              <div className={styles.skillsContainer}>
                {skills.groups.map((group) => (
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
          </Col>

          <Col span={12} lg={4}>
            <div className={styles.small}>
              <div id="qualities" className={styles.qualities}>
                <SectionTitle underline="right">{qualities.title}</SectionTitle>
                {qualities.items.map((item) => (
                  <div key={item.label} className={styles.qualitiesRow}>
                    <div className={styles.qualityIcon}>
                      <Icon name={item.icon} variant={item.variant} />
                    </div>
                    <Bulge>{item.label}</Bulge>
                  </div>
                ))}
              </div>

              <div id="interests">
                <SectionTitle underline="right">{interests.title}</SectionTitle>
                <div className={styles.interestsContainer}>
                  {interests.items.map((item) => (
                    <Bulge key={item.label} className={styles.marked}>
                      {item.icon && <Icon name={item.icon} variant={item.variant} />}
                      {item.label}
                    </Bulge>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}
