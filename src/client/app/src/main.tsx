import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// React router
import { BrowserRouter } from 'react-router-dom'

// Thirdweb
import { ThirdwebProvider, metamaskWallet,coinbaseWallet, walletConnect, rainbowWallet, trustWallet} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

// Chakra
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "",
      },
    }),
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* CHANGE THIS IF LOCAL TESTNET OR MAINNET */}
      <ThirdwebProvider 
        supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect(), rainbowWallet(), trustWallet()]}
        activeChain={Sepolia}
        clientId="f040e4ca2a016065c0cb8c64b651338a"> 
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThirdwebProvider>
    </ChakraProvider>
  </React.StrictMode>,
)


