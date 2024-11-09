import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      background_alternatif: string;
      text: string;
      primary: string;
      primary_light: string;
      primary_dark: string;
      secondary: string;
      secondary_light: string;
      secondary_dark: string;
    };
  }
}