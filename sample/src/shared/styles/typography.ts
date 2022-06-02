import type { TextStyle } from 'react-native';

const scaleFactor = (n: number) => n;

export type Typo =
  | 'h1'
  | 'h2'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'button'
  | 'caption1'
  | 'caption2'
  | 'caption3'
  | 'caption4';
type FontAttributes = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight'>;
const Typography: Record<Typo, FontAttributes> = {
  h1: {
    fontWeight: '500',
    fontSize: scaleFactor(18),
    lineHeight: scaleFactor(20),
  },
  h2: {
    fontWeight: 'bold',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(20),
    letterSpacing: scaleFactor(-0.2),
  },
  subtitle1: {
    fontWeight: '500',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(22),
    letterSpacing: scaleFactor(-0.2),
  },
  subtitle2: {
    fontWeight: 'normal',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(22),
  },
  body1: {
    fontWeight: 'normal',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(20),
  },
  body2: {
    fontWeight: '500',
    fontSize: scaleFactor(14),
    lineHeight: scaleFactor(16),
  },
  body3: {
    fontWeight: 'normal',
    fontSize: scaleFactor(14),
    lineHeight: scaleFactor(20),
  },
  button: {
    fontWeight: 'bold',
    fontSize: scaleFactor(14),
    lineHeight: scaleFactor(16),
    letterSpacing: scaleFactor(0.4),
  },
  caption1: {
    fontWeight: 'bold',
    fontSize: scaleFactor(12),
    lineHeight: scaleFactor(12),
  },
  caption2: {
    fontWeight: 'normal',
    fontSize: scaleFactor(12),
    lineHeight: scaleFactor(12),
  },
  caption3: {
    fontWeight: 'bold',
    fontSize: scaleFactor(11),
    lineHeight: scaleFactor(12),
  },
  caption4: {
    fontWeight: 'normal',
    fontSize: scaleFactor(11),
    lineHeight: scaleFactor(12),
  },
};

export default Typography;
