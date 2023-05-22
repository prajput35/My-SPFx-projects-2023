import { SPHttpClient } from "@microsoft/sp-http";
export interface IFC3Props {
    userDisplayName: string;
    spHttpClient: SPHttpClient;
    currentSiteUrl: string;
  }
  