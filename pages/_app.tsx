import { ChakraProvider } from "@chakra-ui/react";
import { DefaultCredentialsProvider, theme } from "console-components-test-1";
import { Provider as AuthProvider, useSession } from "next-auth/client";
import type { AppProps } from "next/app";
import { ReactElement } from "react";

interface AppWithCredentialsProps {
  children: ReactElement;
}

function AppWithCredentials({ children }: AppWithCredentialsProps) {
  const [session] = useSession();
  if (session) {
    const { clientId, clientSecret, dataResidency } = session;
    return (
      <DefaultCredentialsProvider
        defaultClientId={clientId}
        defaultClientSecret={clientSecret}
        defaultDataResidency={dataResidency}
      >
        {children}
      </DefaultCredentialsProvider>
    );
  }
  return <DefaultCredentialsProvider>{children}</DefaultCredentialsProvider>;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider session={pageProps.session}>
        <AppWithCredentials>
          <Component {...pageProps} />
        </AppWithCredentials>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
