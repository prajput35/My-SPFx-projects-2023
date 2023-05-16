import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "PersonWebPartStrings";
//import Person from "./components/Person";
import { IPersonProps } from "./components/IPersonProps";

import { MSGraphClientV3 } from "@microsoft/sp-http";
import Person from "./components/Person";

export interface IPersonWebPartProps {
  description: string;
}

/* export function PersonWebPart(props: IPersonWebPartProps) {
  const props1 = {
    description: "description",
    userDisplayName: "userDisplayName",
    context: WebPartContext,
  };
  const element: React.ReactElement = React.createElement("div", props1);
  ReactDom.render(element, this.domElement);

  
} */

export default class PersonWebPart extends BaseClientSideWebPart<IPersonWebPartProps> {
  msGraphClient: MSGraphClientV3;
  public render(): void {
    /*   const element1: React.ReactElement<IPersonWebPartProps> = (
      <>
        description={this.properties.description}
        userDisplayName={this.context.pageContext.user.displayName}
        context={this.context}
      </>
    ); */

    const props = {
      graphClient: this.msGraphClient,
    };
    const element: React.ReactElement<IPersonProps> = React.createElement(
      Person,
      props
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this.msGraphClient = await this.context.msGraphClientFactory.getClient("3");
    return this._getEnvironmentMessage().then((message) => {
      console.log(message);
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error("Unknown host");
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    //this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
