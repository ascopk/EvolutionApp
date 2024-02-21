import { OktaFactory } from "@webiny/app-admin-okta";
// @ts-ignore
import OktaSignIn from "@okta/okta-signin-widget";
import { OktaAuth } from "@okta/okta-auth-js";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";

const redirectUri = window.location.origin + "/";

// These scopes are required to populate all the necessary user data on the API side.
const scopes = ["openid", "email", "profile"];

const oktaDomain = "https://myasco.okta.com"; // Example: https://dev-123456.oktapreview.com

export const rootAppClientId = "0oal4fkp0fsjR9I57297";

export const oktaFactory: OktaFactory = ({ clientId }) => {
  const oktaSignIn = new OktaSignIn({
    // Additional documentation on config options can be found at https://github.com/okta/okta-signin-widget#basic-config-options
    baseUrl: oktaDomain,
    clientId,
    redirectUri,
    logo: "https://raw.githubusercontent.com/webiny/webiny-js/next/docs/static/webiny-logo.svg",
    authParams: {
      scopes
    }
  });

  const oktaAuth = new OktaAuth({
    issuer: `${oktaDomain}/oauth2/default`,
    clientId,
    redirectUri,
    scopes,
    pkce: true,
    devMode: false
  });

  return { oktaSignIn, oktaAuth };
};