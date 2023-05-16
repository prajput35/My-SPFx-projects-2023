import * as React from "react";
import styles from "./PersonCl.module.scss";
import { IPersonClProps } from "./IPersonClProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { IGraphPersonState } from "./IGraphPersonState";

export default class PersonCl extends React.Component<
  IPersonClProps,
  IGraphPersonState
> {
  constructor(props: IPersonClProps) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phone: "",
    };
  }

  public render(): React.ReactElement<IPersonClProps> {
    return (
      <div className={styles.welcome}>
        <h2>Well done, {escape(this.state.name)}!</h2>
        <h2>Email: {escape(this.state.email)}!</h2>
        <h2>Phone: {escape(this.state.phone)}!</h2>
      </div>
    );
  }

  public async componentDidMount(): Promise<void> {
    try {
      // Use await to make an asynchronous call to the Microsoft Graph API
      const user: MicrosoftGraph.User = await this.props.graphClient
        .api("me")
        .responseType(ResponseType.JSON)
        .get();

      this.setState({
        name: user.displayName,
        email: user.mail,
        phone: user.businessPhones[0],
      });
    } catch (error) {
      console.log("Error:", error);
    }

    /* this.props.graphClient
      .api("me")
      .responseType(ResponseType.JSON)
      .get((error: GraphError, user: MicrosoftGraph.User) => {
        this.setState({
          name: user.displayName,
          email: user.mail,
          phone: user.businessPhones[0],
        });
      })
      .catch((error: GraphError) => {
        console.log(error);
      }); */
  }
}
