import { useGetHomepageQuery, useGetProfileQuery, useGetProjectsQuery } from '@/data/cvApi';
import type { HomeSection } from '@/data/home.types';
import type { Project } from '@/data/cv.types';
import { Container } from '@/ui/Container';
import { Header } from '@/features/Header';
import { AboutSection } from '@/features/sections/AboutSection';
import { TimelineSection } from '@/features/sections/TimelineSection';
import { ProjectsSection } from '@/features/sections/ProjectsSection';
import { SkillsSection } from '@/features/sections/SkillsSection';
import { IconListSection } from '@/features/sections/IconListSection';
import { AttributesSection } from '@/features/sections/AttributesSection';
import styles from './App.module.scss';

function renderSection(section: HomeSection, projects: Project[]) {
  switch (section.kind) {
    case 'about':
      return <AboutSection section={section} />;
    case 'timeline':
      return <TimelineSection group={section} />;
    case 'skills':
      return <SkillsSection id={section.id} title={section.title} groups={section.groups} />;
    case 'iconList':
      return <IconListSection id={section.id} title={section.title} items={section.items} />;
    case 'attributes':
      return (
        <AttributesSection
          skills={section.skills}
          qualities={section.qualities}
          interests={section.interests}
        />
      );
    case 'projects':
      return (
        <ProjectsSection
          projects={projects}
          title={section.title}
          showHidden={section.showHidden}
        />
      );
  }
}

export default function App() {
  const { data: sections } = useGetHomepageQuery();
  const { data: profile } = useGetProfileQuery();
  const { data: projects } = useGetProjectsQuery();

  if (!sections || !profile || !projects) {
    return <div className={styles.loading}>Laden…</div>;
  }

  return (
    <div className={styles.app}>
      <Header profile={profile} />

      {sections.map((section) => (
        <div key={`${section.kind}-${section.id}`}>{renderSection(section, projects)}</div>
      ))}

      <footer className={styles.footer}>
        <Container>
          <p>{profile.footer.label}</p>
        </Container>
      </footer>
    </div>
  );
}
