import type { ContentSection } from '@/data/cv.types';
import { Section } from '@/ui/Section';
import { Container } from '@/ui/Container';
import { SectionTitle } from '@/ui/SectionTitle';
import { Markdown } from '@/ui/Markdown';

export type AboutSectionProps = {
  section: ContentSection;
};

export function AboutSection({ section }: AboutSectionProps) {
  return (
    <Section id={section.id}>
      <Container size="small">
        <SectionTitle underline="left">{section.title}</SectionTitle>
        <Markdown>{section.body}</Markdown>
      </Container>
    </Section>
  );
}
