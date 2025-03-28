import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import MainStore from './reduxwork/MainStore.js'
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { AlertProvider } from './custom/CustomAlert.jsx';
import "./index.css"

const queryClient = new QueryClient();
let persistor = persistStore(MainStore);
const root = createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <BrowserRouter>
      <Provider store={MainStore}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <AlertProvider>
              <App />
            </AlertProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
