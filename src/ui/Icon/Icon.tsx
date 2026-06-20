import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import './library';

export type IconProps = {
  name: string; // FA7 icon name, no prefix — e.g. "code", "paintbrush"
  variant?: 'solid' | 'regular';
  className?: string;
};

export function Icon({ name, variant = 'solid', className }: IconProps) {
  const prefix: IconPrefix = variant === 'regular' ? 'far' : 'fas';
  return <FontAwesomeIcon icon={[prefix, name as IconName]} className={className} />;
}
