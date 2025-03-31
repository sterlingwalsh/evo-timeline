
import './styles/index.scss';
import { TimelinePage } from './pages/timeline/timeline.page';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from './styles/themecontext/theme';
import { LoginPage } from './pages/login/login.page';
import { AuthProvider } from './context/auth/auth.context';
import { LibraryUpload } from './pages/library/upload/libraryupload.page';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDatefnsV3';


const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return <BrowserRouter>
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<ThemeProvider className='branding root'>
				<AuthProvider>
					{children}
				</AuthProvider>
			</ThemeProvider></LocalizationProvider>
	</BrowserRouter>
}

function App() {


	return (

		<Providers>
			<Routes>
				<Route path="login" element={<LoginPage />} />
				<Route path="timeline" element={<TimelinePage />} />
				<Route path='library' >
					<Route path='upload' element={<LibraryUpload />} />
					<Route index element={<Navigate to='upload' replace />} />
				</Route>
				{/* defaults for testing */}
				<Route index element={<Navigate to='login' />} />
				{/* <Route index element={<Navigate to='timeline' />} /> */}
			</Routes>
		</Providers>

	);
}

export default App;
