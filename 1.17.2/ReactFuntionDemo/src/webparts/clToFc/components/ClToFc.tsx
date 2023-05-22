import * as React from "react";
import styles from "./ClToFc.module.scss";
import { IClToFcProps } from "./IClToFcProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { IFC3Props } from "./IFC3Props";
import { useState, useEffect } from "react";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
//declaration - 3
const FC3: React.FC<IFC3Props> = (props) => {
  const { userDisplayName, spHttpClient, currentSiteUrl } = props;
  const [counter, setCounter] = useState<number>(1);
  const [evenOdd, setEvenOdd] = useState<string>("");
  const [lists, setLists] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const endPoint: string = `${currentSiteUrl}/_api/web/lists?$select=Title&$filter=Hidden eq false&$orderby=Title&$top=10`;
      const rawResponse: SPHttpClientResponse = await spHttpClient.get(
        endPoint,
        SPHttpClient.configurations.v1
      );
      console.log();
      setLists(
        (await rawResponse.json()).value.map((list: { Title: string }) => {
          return list.Title;
        })
      );
    })();
  }, []);

  useEffect(() => {
    setEvenOdd(counter % 2 === 0 ? "Even" : "Odd");
    console.log("render");
  }, [counter]);

  const onButtonClick = (): void => {
    setCounter(counter + 1);
  };
  return (
    <>
      <h2>
        <span>{`${escape(props.userDisplayName)} in function3`}</span>
      </h2>
      <div>
        Counter: <strong>{counter}</strong> is <strong>{evenOdd}</strong>
      </div>
      <button
        onClick={() => {
          onButtonClick();
        }}
      >
        +
      </button>
      <ul>
        {lists.map((list: string) => (
          <li>{list}</li>
        ))}
      </ul>
    </>
  );
};

//declaration - 2
const ClToFc2: React.FC = (props) => {
  return (
    <>
      <strong>
        <div>CLtoFC2 function component here</div>
      </strong>
    </>
  );
};

//declaration - 1
//const ClToFc = (props: IClToFcProps) - this also works
const ClToFc = (props: IClToFcProps): JSX.Element => {
  const {
    description,
    isDarkTheme,
    environmentMessage,
    hasTeamsContext,
    userDisplayName,
    spHttpClient,
    currentSiteUrl,
  } = props;

  return (
    <section
      className={`${styles.clToFc} ${hasTeamsContext ? styles.teams : ""}`}
    >
      <div className={styles.welcome}>
        <img
          alt=""
          src={
            isDarkTheme
              ? require("../assets/welcome-dark.png")
              : require("../assets/welcome-light.png")
          }
          className={styles.welcomeImage}
        />
        <h2>Well done, {escape(userDisplayName)}!</h2>
        <ClToFc2 />
        <div>{environmentMessage}</div>
        <div>
          Web part property value: <strong>{escape(description)}</strong>
        </div>
      </div>
      <div>
        <h3>Welcome to SharePoint Framework!</h3>
        <p>
          The SharePoint Framework (SPFx) is a extensibility model for Microsoft
          Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to
          extend Microsoft 365 with automatic Single Sign On, automatic hosting
          and industry standard tooling.
        </p>
        <h4>Learn more about SPFx development:</h4>
      </div>
      <FC3
        userDisplayName={userDisplayName}
        spHttpClient={spHttpClient}
        currentSiteUrl={currentSiteUrl}
      />
    </section>
  );
};

export default ClToFc;
//export { ClToFc2 };
