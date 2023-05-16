import * as React from "react";
import { GraphError, ResponseType } from "@microsoft/microsoft-graph-client";
import { IPersonProps } from "./IPersonProps";
import { escape } from "@microsoft/sp-lodash-subset";
import styles from "./Person.module.scss";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import {
  IPersonaProps,
  Persona,
  PersonaPresence,
  PersonaSize,
} from "office-ui-fabric-react/lib/components/Persona";
import { Link } from "office-ui-fabric-react/lib/components/Link";
import { Icon, IIconStyles } from "office-ui-fabric-react";
import PersonaCustomRenderExample from "./Persona";

const iconStyles: Partial<IIconStyles> = { root: { marginRight: 5 } };
//const [user, setUser] = React.useState<MicrosoftGraph.User>({});
//const [image, setImage] = React.useState<string>("");
export default function Person(props: IPersonProps): JSX.Element {
  const { graphClient } = props;
  const [user, setUser] = React.useState<MicrosoftGraph.User>(null);
  const [image, setImage] = React.useState<string>(null);
  const userRef = React.useRef(null);

  React.useEffect(() => {
    graphClient
      .api("/me")
      .get()
      .then((respone: MicrosoftGraph.User) => {
        console.log("User:", respone);
        setUser(respone);
        userRef.current = respone;
      })
      .catch((error: GraphError) => {
        console.log(error);
      });
    //commented code also works
    /* eslint-disable @typescript-eslint/no-floating-promises */

    graphClient
      .api("/me")
      .get((error: GraphError, user: MicrosoftGraph.User) => {
        console.log("name: ", user.displayName);
        console.log("email: ", user.mail);
        console.log("phone: ", user.businessPhones[0]);
        //return user;
        //setUser(user);
        userRef.current = user;
        //phoneRef.current = user.businessPhones[0];
      });

    graphClient
      .api("/me/photo/$value")
      .responseType(ResponseType.BLOB)
      .get((error: GraphError, photoResponse: Blob) => {
        const blobUrl = window.URL.createObjectURL(photoResponse);
        console.log("Blob:", blobUrl);
        setImage(blobUrl);
      });
    /* eslint-enable @typescript-eslint/no-floating-promises */
  }, []);

  /* function _renderMail(u: MicrosoftGraph.User): JSX.Element {
    if (u.mail) {
      return <Link href={`mailto:${u.mail}`}>{u.mail}</Link>;
    } else {
      return <div />;
    }
  } */

  if (!user) {
    return null;
  } else {
    return (
      <>
        <div className={`${styles.welcome}`} />
        <h2>Well done, {escape(user.displayName)}!</h2>
        <h2>Email: {escape(user.mail)}!</h2>
        <h2>Principal, {escape(user.userPrincipalName)}!</h2>
        <h2>Phone, {escape(user.businessPhones[0])}!</h2>

        <Persona
          text={user.displayName}
          secondaryText={user.jobTitle}
          presence={PersonaPresence.online}
          onRenderSecondaryText={(props: IPersonaProps) => {
            if (props.secondaryText) {
              return (
                <>
                  <div>
                    <Icon iconName="Suitcase" styles={iconStyles} />
                    <Link href={`mailto:${user.mail}`}>
                      {props.secondaryText}
                    </Link>
                  </div>
                </>
              );
            } else {
              return <div />;
            }
          }}
          tertiaryText={user.businessPhones[0]}
          onRenderTertiaryText={_renderPhone}
          imageUrl={image}
          size={PersonaSize.size100}
        />
        <PersonaCustomRenderExample graphClient={graphClient} />
      </>
    );
  }
}

function _renderPhone(props: IPersonaProps): JSX.Element {
  //debugger;
  try {
    console.log("Inside render", props);
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
