import * as React from "react";

export interface IComponentProps {
  fname: string;
  lname: string;
}

export function Greeting(props: React.PropsWithChildren<IComponentProps>) {
  const { fname, lname } = props;
  return (
    <>
      <h1>
        Hi, spfx, Greetings!!! {fname} {lname}
      </h1>
    </>
  );
}

export interface IComponentProps {}

export function Component(props: React.PropsWithChildren<IComponentProps>) {
  return <></>;
}
