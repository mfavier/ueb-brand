import logoSvg from './logos/uccle-europe.svg';

/** The crest as raw SVG markup (inlined at build time). */
export const clubLogoSvg: string = logoSvg;

const logoDataUrl = `data:image/svg+xml,${encodeURIComponent(logoSvg)}`;

/**
 * The official club crest, served from the vector source as an inlined data URL
 * — crisp at any size, no asset pipeline required in the consumer. Size it with
 * `className` (e.g. "h-8 w-auto").
 */
export interface ClubLogoProps {
  className?: string;
  alt?: string;
}

export const ClubLogo = ({ className = 'h-8 w-auto', alt = 'Uccle Europe Basketball' }: ClubLogoProps) => (
  <img src={logoDataUrl} alt={alt} className={className} />
);

export default ClubLogo;
