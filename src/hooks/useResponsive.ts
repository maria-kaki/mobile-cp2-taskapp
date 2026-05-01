import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 380;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const contentWidth = isMobile ? width : Math.min(width * 0.6, 680);
  const horizontalPadding = isSmall ? 16 : isMobile ? 20 : 32;

  const fontSize = {
    xs: isSmall ? 10 : 12,
    sm: isSmall ? 12 : 13,
    md: isSmall ? 14 : 15,
    lg: isSmall ? 16 : isTablet ? 18 : 17,
    xl: isSmall ? 18 : isTablet ? 22 : 20,
    xxl: isSmall ? 22 : isTablet ? 30 : 26,
    hero: isSmall ? 26 : isTablet ? 38 : 32,
  };

  return {
    width,
    height,
    isSmall,
    isMobile,
    isTablet,
    isDesktop,
    contentWidth,
    horizontalPadding,
    fontSize,
  };
}
