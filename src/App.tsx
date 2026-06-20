import {
  useGetProfileQuery,
  useGetAboutQuery,
  useGetWorkExperienceQuery,
  useGetEducationQuery,
  useGetProjectsQuery,
  useGetSkillsQuery,
  useGetQualitiesQuery,
  useGetInterestsQuery,
} from '@/data/cvApi';
import { Container } from '@/ui/Container';
import { Header } from '@/features/Header';
import { AboutSection } from '@/features/sections/AboutSection';
import { TimelineSection } from '@/features/sections/TimelineSection';
import { ProjectsSection } from '@/features/sections/ProjectsSection';
import { AttributesSection } from '@/features/sections/AttributesSection';
import styles from './App.module.scss';

export default function App() {
  const { data: profile } = useGetProfileQuery();
  const { data: about } = useGetAboutQuery();
  const { data: workExperience } = useGetWorkExperienceQuery();
  const { data: education } = useGetEducationQuery();
  const { data: projects } = useGetProjectsQuery();
  const { data: skills } = useGetSkillsQuery();
  const { data: qualities } = useGetQualitiesQuery();
  const { data: interests } = useGetInterestsQuery();

  if (
    !profile ||
    !about ||
    !workExperience ||
    !education ||
    !projects ||
    !skills ||
    !qualities ||
    !interests
  ) {
    return <div className={styles.loading}>Laden…</div>;
  }

  return (
    <div className={styles.app}>
      <Header profile={profile} />

      {about.map((section) => (
        <AboutSection key={section.id} section={section} />
      ))}

      <TimelineSection group={workExperience} />
      <TimelineSection group={education} />

      <ProjectsSection projects={projects} />

      <AttributesSection skills={skills} qualities={qualities} interests={interests} />

      <footer className={styles.footer}>
        <Container>
          <p>{profile.footer.label}</p>
        </Container>
      </footer>
    </div>
  );
}
