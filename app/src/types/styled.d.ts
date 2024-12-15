import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      background_alternatif: string;
      background_light: string;
      text: string;
      dark_text: string;
      title_text: string;
      primary: string;
      primary_light: string;
      primary_dark: string;
      secondary: string;
      secondary_light: string;
      secondary_dark: string;
    };
  }
}