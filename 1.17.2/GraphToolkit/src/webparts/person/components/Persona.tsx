import * as React from "react";
import { GraphError, ResponseType } from "@microsoft/microsoft-graph-client";
import {
  IPersonaProps,
  IPersonaSharedProps,
  IPersonaStyles,
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";
import { Icon, IIconStyles } from "@fluentui/react/lib/Icon";
import { Stack } from "@fluentui/react/lib/Stack";
import { Link } from "office-ui-fabric-react/lib/components/Link";
import { IPersonProps } from "./IPersonProps";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

const personaStyles: Partial<IPersonaStyles> = {
  root: { margin: "0 0 10px 0" },
};
const iconStyles: Partial<IIconStyles> = { root: { marginRight: 5 } };
const PersonaCustomRenderExample: React.FunctionComponent<IPersonProps> = (
  props: IPersonProps
) => {
  const [image, setImage] = React.useState<string>(null);
  const [user, setUser] = React.useState<MicrosoftGraph.User>({
    displayName: "",
    jobTitle: "",
    mail: "",
    businessPhones: [],
  });
  const examplePersona: IPersonaSharedProps = {
    imageUrl: image,
    imageInitials: "PR",
    text: user.displayName,
    secondaryText: user.jobTitle,
    tertiaryText: user.businessPhones[0],
    optionalText: "Available at 4:00pm",
    imageAlt: `${user.displayName} is busy`,
  };

  React.useEffect(() => {
    props.graphClient
      .api("/me")
      .get()
      .then((respone: MicrosoftGraph.User) => {
        console.log("Persona user:", respone);
        setUser(respone);
        examplePersona.text = respone.displayName;
        examplePersona.secondaryText = respone.jobTitle;
        examplePersona.tertiaryText = respone.businessPhones[0];
        examplePersona.imageAlt = `${respone.displayName} is busy!`;
      })
      .catch((error: GraphError) => {
        console.log(error);
      });

    /* eslint-disable @typescript-eslint/no-floating-promises */
    props.graphClient
      .api("/me/photo/$value")
      .responseType(ResponseType.BLOB)
      .get((error: GraphError, photoResponse: Blob) => {
        const blobUrl = window.URL.createObjectURL(photoResponse);
        console.log("Persona blob:", blobUrl);
        setImage(blobUrl);
        //examplePersona.imageUrl = image;
      });
    /* eslint-enable @typescript-eslint/no-floating-promises */
  }, []);

  if (user && user.displayName === "") {
    return null;
  } else {
    return (
      <Stack tokens={{ childrenGap: 10 }}>
        <div>Custom icon in secondary text</div>
        <Persona
          {...examplePersona}
          size={PersonaSize.size100}
          presence={PersonaPresence.dnd}
          onRenderSecondaryText={(props: IPersonaProps) =>
            _onRenderSecondaryText(props, user)
          }
          onRenderTertiaryText={_renderPhone}
          styles={personaStyles}
          /* imageAlt={`${user.displayName} is busy`} */
        />
      </Stack>
    );
  }
};

function _onRenderSecondaryText(
  props: IPersonaProps,
  user: MicrosoftGraph.User
): JSX.Element {
  return (
    <div>
      <Icon iconName="Suitcase" styles={iconStyles} />
      <Link href={`mailto:${user.mail}`}>{props.secondaryText}</Link>
    </div>
  );
}

function _renderPhone(props: IPersonaProps): JSX.Element {
  //debugger;
  try {
    console.log("inside Persona render", props);
    if (props.tertiaryText) {
      return (
        <Link href={`tel:${props.tertiaryText}`}>{props.tertiaryText}</Link>
      );
    } else {
      return <div />;
    }
  } catch (e) {
    return <div>empty</div>;
  }
}
export default PersonaCustomRenderExample;
