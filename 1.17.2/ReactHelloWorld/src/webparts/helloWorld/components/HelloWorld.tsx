import * as React from "react";
import styles from "./HelloWorld.module.scss";
import { IHelloWorldProps } from "./IHelloWorldProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { PrimaryButton } from "office-ui-fabric-react";

export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {
  public render(): React.ReactElement<IHelloWorldProps> {
    const { description, userDisplayName } = this.props;

    return (
      <section className={`${styles.helloWorld}`}>
        <div>
          <span>Welcome to SharePoint! {userDisplayName}</span>
          <p>Customize SharePoint experiences using Web Parts.</p>
          <p>{escape(description)}</p>
          <PrimaryButton href="https://aka.ms/spfx">Learn more</PrimaryButton>
        </div>
      </section>
    );
  }
}
