import "./App.css";
import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import allReducers from "./redux";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Home from "./Components/Home";

const middleware = [reduxThunk];
const store = createStore(allReducers, composeWithDevTools(applyMiddleware(...middleware)));

function App() {
	return (
		<Provider store={store}>
			<DndProvider backend={HTML5Backend}>
				<div className="App">
					<Home />
				</div>
			</DndProvider>
		</Provider>
	);
}

export default App;
