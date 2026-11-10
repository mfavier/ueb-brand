export type TemplateId = '01-resultats' | '02-programme' | '03-partenaire' | '04-player-of-the-week' | '05-annonce-officielle' | '06-communication' | '07-score-final' | '08-libre';
export type PosterFormat = 'feed' | 'story';
export type TextValue = string | readonly string[];
export type ImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type BackgroundColor = 'white' | 'paper' | 'sky' | 'blue' | 'night' | 'gold';
export interface VisualSettings {
  source: 'auto' | 'photo' | 'logo' | 'none';
  mode?: 'background-monochrome' | 'foreground-color';
  photo?: string | null;
  logo?: string | null;
}
export interface ResolvedVisual {
  source: 'photo' | 'logo' | 'none';
  mode: 'background-monochrome' | 'foreground-color';
  image: string | null;
  clubLogo: boolean;
}
export interface CrestSettings { x?: number; y?: number; width?: number; opacity?: number; color?: 'night' | 'blue' | 'white'; }
export interface SponsorData { id?: string; name: string; logo?: string | null; label?: string; }
export interface StatData { value: string | number; label: string; }
export interface MatchData {
  id?: string; category?: string; home?: string; away?: string;
  homeScore?: string | number | null; awayScore?: string | number | null; score?: string;
  day?: string; opponent?: string; venue?: string; side?: string; time?: string;
  homeLogo?: string | null; awayLogo?: string | null; opponentLogo?: string | null;
}
/** Image fields contain embedded data URIs or kit asset paths at rendering time.
 * Crest coordinates use the 1080x1350 feed space; stories add 200px vertically. */
export interface PosterData {
  title?: TextValue; edition?: string; footer?: string; demo?: boolean; alt?: string;
  backgroundStyle?: 'plain' | 'crest'; surface?: BackgroundColor; variant?: 'light' | 'dark'; visual?: VisualSettings;
  crest?: CrestSettings; sponsor?: SponsorData | null; photoPosition?: ImagePosition;
  logo?: string | null; photo?: string | null; portrait?: string | null; backgroundPhoto?: string | null; photoCaption?: string;
  matches?: readonly MatchData[]; name?: TextValue; contribution?: TextValue; season?: string;
  category?: string; number?: string | number | null; stats?: readonly StatData[];
  subject?: TextValue; body?: TextValue; signature?: string; when?: string; details?: TextValue; note?: string;
  home?: TextValue; away?: TextValue; homeScore?: string | number | null; awayScore?: string | number | null;
  homeLogo?: string | null; awayLogo?: string | null; closing?: TextValue; action?: string;
}
export interface PosterResult { svg: string; warnings: string[]; width: 1080; height: 1350 | 1920; }
export const COLORS: Readonly<Record<'night' | 'blue' | 'sky' | 'gold' | 'white' | 'paper' | 'muted' | 'line', string>>;
export function initEngine(options?: { assetBaseUrl?: string }): Promise<void>;
export function getAssetDataURL(path: string): string;
export function resolvePosterVisual(templateId: TemplateId, data: PosterData): ResolvedVisual;
export function getPosterBackground(templateId: TemplateId, data?: PosterData): BackgroundColor;
export function getPosterCrest(templateId: TemplateId, data: PosterData): Required<CrestSettings>;
export function buildPoster(templateId: TemplateId, data?: PosterData, format?: PosterFormat): PosterResult;
export function paginatePosterData(templateId: TemplateId, data: PosterData, format?: PosterFormat): PosterData[];
export function posterToPng(svg: string): Promise<Blob>;
