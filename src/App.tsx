
import './styles/index.scss';
import { TimelinePage } from './pages/timeline/timeline.page';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from './styles/themecontext/theme';
import { LoginPage } from './pages/login/login.page';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return <BrowserRouter>
		<ThemeProvider className='branding'>
			{children}
		</ThemeProvider>
	</BrowserRouter>
}

function App() {
	return (

		<Providers>
			<Routes>
				<Route path="login" element={<LoginPage />} />
				<Route path="timeline" element={<TimelinePage />} />

				{/* defaults for testing */}
				<Route index element={<Navigate to='login' />} />
				{/* <Route index element={<Navigate to='timeline' />} /> */}
			</Routes>
		</Providers>

	);
}

export default App;
