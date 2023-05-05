import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from './pages/SignUpPage'
import PrivatePage from "./pages/PrivatePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './sass/style.min.css'

function App() {
	return (
		<BrowserRouter>
			<Routes>				
 				<Route path='/sign-up' element={<SignUpPage/>}/>
				<Route path='/' element={<SignInPage/>} />
				<Route path='/content' element={<PrivatePage/>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
