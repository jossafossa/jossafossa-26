import type { Project } from '@/data/cv.types';
import { OptionalLink } from '@/ui/OptionalLink';
import { ResponsiveImage } from '@/ui/ResponsiveImage';
import { ImageLightbox } from '@/ui/ImageLightbox';
import { Button } from '@/ui/Button';
import { Markdown } from '@/ui/Markdown';
import { Tag } from '@/ui/Tag';
import { getColor } from '@/helpers/getColor';
import { useRipple } from '@/hooks/useRipple';
import { useBulge } from '@/hooks/useBulge';
import styles from './ProjectCard.module.scss';

export type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { ref, rippleProps, ripples } = useRipple<HTMLElement>();
  useBulge(ref);

  return (
    <OptionalLink href={project.url}>
      <article ref={ref} {...rippleProps} className={styles.card}>
        {project.image && (
          <header className={styles.media}>
            <ResponsiveImage src={project.image} alt={project.title} />
            {project.images && (
              <div className={styles.cardLinks}>
                <ImageLightbox
                  images={project.images}
                  trigger={<Button>Bekijk afbeeldingen</Button>}
                />
              </div>
            )}
          </header>
        )}

        <section className={styles.body}>
          <h2 className={styles.title}>{project.title}</h2>
          {project.description && <Markdown inline>{project.description}</Markdown>}
        </section>

        <footer className={styles.footer}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} accent={getColor(tag)} />
          ))}
        </footer>

        {ripples}
      </article>
    </OptionalLink>
  );
}
