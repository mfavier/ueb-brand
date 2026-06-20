import * as react from 'react';

/** The crest as raw SVG markup (inlined at build time). */
declare const clubLogoSvg: string;
/**
 * The official club crest, served from the vector source as an inlined data URL
 * — crisp at any size, no asset pipeline required in the consumer. Size it with
 * `className` (e.g. "h-8 w-auto").
 */
interface ClubLogoProps {
    className?: string;
    alt?: string;
}
declare const ClubLogo: ({ className, alt }: ClubLogoProps) => react.JSX.Element;

export { ClubLogo, type ClubLogoProps, clubLogoSvg, ClubLogo as default };
