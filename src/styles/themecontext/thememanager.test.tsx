// import userEvent from '@testing-library/user-event';
// import { cleanup, render, screen } from '../../test-utils';
import { themingFactory } from './thememanager';

// describe('ThemeManager', () => {
// 	let TestComponent: React.FC;
// 	const themes = ['dark', 'light'] as const;
// 	let ThemeProvider: React.FC<React.PropsWithChildren<{}>>;

// 	beforeEach(() => {
// 		const { ThemeProvider: prov, useAppTheme } = themingFactory(themes, 'dark');
// 		ThemeProvider = prov;
// 		TestComponent = () => {
// 			const [theme, setTheme] = useAppTheme();
// 			return (
// 				<div>
// 					<div>Current Theme: {theme}</div>
// 					{themes.map((t) => (
// 						<button key={t} onClick={() => setTheme(t)}>
// 							{t}
// 						</button>
// 					))}
// 				</div>
// 			);
// 		};
// 	});
// 	afterEach(cleanup);

// 	it('Renders with default theme', async () => {
// 		render(
// 			<ThemeProvider>
// 				<TestComponent />
// 			</ThemeProvider>
// 		);

// 		expect(await screen.findByText('Current Theme: dark')).toBeInTheDocument();
// 	});

// 	it('Loads the last theme from local storage', async () => {
// 		window.localStorage.setItem('app_theme', 'light');
// 		render(
// 			<ThemeProvider>
// 				<TestComponent />
// 			</ThemeProvider>
// 		);

// 		expect(await screen.findByText('Current Theme: light')).toBeInTheDocument();
// 	});

// 	it('Doesnt load a bad theme from storage', async () => {
// 		window.localStorage.setItem('app_theme', 'nope');
// 		render(
// 			<ThemeProvider>
// 				<TestComponent />
// 			</ThemeProvider>
// 		);

// 		expect(await screen.findByText('Current Theme: dark')).toBeInTheDocument();
// 	});

// 	it('Applies theme changes', async () => {
// 		const user = userEvent.setup();
// 		const fakeEl = document.createElement('html');
// 		fakeEl.classList.add('some_class');
// 		vi.spyOn(document, 'getElementsByTagName').mockImplementation((name) => (name === 'html' ? ([fakeEl] as any) : []));
// 		render(
// 			<ThemeProvider>
// 				<TestComponent />
// 			</ThemeProvider>
// 		);

// 		expect(await screen.findByText('Current Theme: dark')).toBeInTheDocument();
// 		expect(fakeEl).toHaveClass('theme__dark');
// 		expect(fakeEl).not.toHaveClass('theme__light');

// 		await user.click(screen.getByText('light'));
// 		expect(await screen.findByText('Current Theme: light')).toBeInTheDocument();
// 		expect(fakeEl).toHaveClass('theme__light');
// 		expect(fakeEl).not.toHaveClass('theme__dark');
// 		expect(fakeEl).toHaveClass('some_class');

// 		await user.click(screen.getByText('dark'));
// 		expect(await screen.findByText('Current Theme: dark')).toBeInTheDocument();
// 		expect(fakeEl).toHaveClass('theme__dark');
// 		expect(fakeEl).not.toHaveClass('theme__light');
// 		expect(fakeEl).toHaveClass('some_class');
// 	});
// });
