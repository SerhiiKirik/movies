import ReactDOM from 'react-dom';
import { AppContextProvider } from './context/appContext/appContext';
import { App } from './App';

ReactDOM.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
  document.getElementById('root'),
);
