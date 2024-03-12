import React from "react";
import { Admin } from "@webiny/app-serverless-cms";
import { Okta } from "@webiny/app-admin-okta";
import "./App.scss";
import { Brandfolder } from "./Brandfolder";

import { oktaFactory, rootAppClientId } from "./okta";

export const App = () => {
return (
  <Admin>
    <Okta factory={oktaFactory} rootAppClientId={rootAppClientId} />
    <Brandfolder />
  </Admin>
);
};
