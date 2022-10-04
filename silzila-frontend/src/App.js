import "./App.css";
import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import allReducers from "./redux";

const middleware = [reduxThunk];
const store = createStore(allReducers, composeWithDevTools(applyMiddleware(...middleware)));

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Silzila UI</h1>
      </div>
    </Provider>
  );
}

export default App;
