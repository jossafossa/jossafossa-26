import { useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Project } from '@/data/cv.types';
import { useBulge } from '@/hooks/useBulge';
import { Section } from '@/ui/Section';
import { Container } from '@/ui/Container';
import { SectionTitle } from '@/ui/SectionTitle';
import { Row } from '@/ui/Row';
import { Col } from '@/ui/Col';
import { getColor } from '@/helpers/getColor';
import { shuffle } from '@/helpers/shuffle';
import { ProjectCard } from '@/features/ProjectCard';
import styles from './ProjectsSection.module.scss';

export type ProjectsSectionProps = {
  projects: Project[];
  title?: string;
  showHidden?: boolean;
};

const ALL = 'all';

type FilterPillProps = {
  label: string;
  accent?: string;
  active: boolean;
  onClick: () => void;
};

function FilterPill({ label, accent, active, onClick }: FilterPillProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useBulge(ref);
  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.filter} ${active ? styles.active : ''}`}
      style={accent ? ({ '--accent': accent } as CSSProperties) : undefined}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export function ProjectsSection({ projects, title = 'Projecten', showHidden = false }: ProjectsSectionProps) {
  // hidden projects show when the CMS block opts in, or the URL has ?extended (read once)
  const extended = useMemo(
    () => showHidden || new URLSearchParams(window.location.search).has('extended'),
    [showHidden],
  );
  // shuffle once — stable across re-renders
  const shuffled = useMemo(() => shuffle(projects), [projects]);
  const visible = useMemo(
    () => shuffled.filter((p) => !p.hidden || extended),
    [shuffled, extended],
  );

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of visible) {
      for (const tag of project.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    const sorted = [...counts.entries()]
      .toSorted((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
    return [{ tag: ALL, count: visible.length }, ...sorted];
  }, [visible]);

  const [active, setActive] = useState<string>(ALL);
  const shown = active === ALL ? visible : visible.filter((p) => p.tags.includes(active));

  return (
    <Section variant="dark" id="projecten">
      <Container>
        <div className={styles.inner}>
          <SectionTitle underline="left">{title}</SectionTitle>

          <div className={styles.filters}>
            <strong>Filter op: </strong>
            {filters.map((filter) => (
              <FilterPill
                key={filter.tag}
                label={filter.tag === ALL ? 'All' : `${filter.tag} (${filter.count})`}
                accent={filter.tag === ALL ? undefined : getColor(filter.tag)}
                active={active === filter.tag}
                onClick={() => setActive(filter.tag)}
              />
            ))}
          </div>

          <Row cols={1} md={2} lg={3} stretch>
            {shown.map((project) => (
              <Col key={project.id}>
                <ProjectCard project={project} />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </Section>
  );
}
