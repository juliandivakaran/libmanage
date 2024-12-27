import logo from './logo.svg';
import './App.css';
import { store } from './actions/store';
import {Provider} from "react-redux";
import DCanditates from './components/DCandidates';

function App() {
  return (
    <Provider store={store}>
      <DCanditates />

    </Provider>
    
  );
}

export default App;
