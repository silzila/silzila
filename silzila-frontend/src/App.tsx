import "./App.css";
import './assets/Fonts/fonts.css'
import React, { useEffect } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import allReducers from "./redux";
import './assets/Fonts/fonts.css'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Home from "./Components/Home";

const middleware = [reduxThunk];
const store = createStore(allReducers, composeWithDevTools(applyMiddleware(...middleware)));

function App() {

	useEffect(() => {
		// Set the page title
		document.title = "Silzila";
	
		// Dynamically set the favicon
		const link = document.createElement('link');
		link.rel = 'icon';
		link.href = "/logo.png"
		link.type = 'image/png';
		document.head.appendChild(link);
		
		// Cleanup function (optional)
		return () => {
		  document.head.removeChild(link);
		};
	  }, []);
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
