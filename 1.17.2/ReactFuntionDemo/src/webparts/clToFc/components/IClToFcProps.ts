import { SPHttpClient } from "@microsoft/sp-http";
export interface IClToFcProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  spHttpClient: SPHttpClient;
  currentSiteUrl: string;
}
