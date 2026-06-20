// Section blocks that make up the main page, in the order set in the CMS
// (Strapi Homepage dynamic zone). Each maps to a renderer in App.tsx.
import type {
  TimelineItem,
  SkillGroup,
  IconItem,
  SkillsBlock,
  NamedIconList,
} from '@/data/cv.types';

export type AboutHomeSection = {
  kind: 'about';
  id: string;
  title: string;
  body: string;
};

export type TimelineHomeSection = {
  kind: 'timeline';
  id: string;
  title: string;
  items: TimelineItem[];
};

export type SkillsHomeSection = {
  kind: 'skills';
  id: string;
  title: string;
  groups: SkillGroup[];
};

export type IconListHomeSection = {
  kind: 'iconList';
  id: string;
  title: string;
  items: IconItem[];
};

export type ProjectsHomeSection = {
  kind: 'projects';
  id: string;
  title: string;
  showHidden: boolean;
};

// Skills + qualities + interests bundled as one fixed-layout grid block.
export type AttributesHomeSection = {
  kind: 'attributes';
  id: string;
  skills: SkillsBlock;
  qualities: NamedIconList;
  interests: NamedIconList;
};

export type HomeSection =
  | AboutHomeSection
  | TimelineHomeSection
  | SkillsHomeSection
  | IconListHomeSection
  | ProjectsHomeSection
  | AttributesHomeSection;
