// import userEvent from '@testing-library/user-event';
// import { cleanup, render, screen } from '../test-utils';
import { themes, ThemeProvider, useAppTheme } from './theme';

// const TestComponent = () => {
// 	const [theme, setTheme] = useAppTheme();
// 	return (
// 		<div>
// 			<div>Current Theme: {theme}</div>
// 			{starThemes.map((t) => (
// 				<button key={t} onClick={() => setTheme(t)}>
// 					{t}
// 				</button>
// 			))}
// 		</div>
// 	);
// };

// describe('ThemeContext', () => {
// 	beforeEach(() => {});
// 	afterEach(cleanup);

// 	it('Renders defaulting to dark theme', async () => {
// 		render(
// 			<ThemeProvider>
// 				<TestComponent />
// 			</ThemeProvider>
// 		);

// 		expect(await screen.findByText('Current Theme: dark')).toBeInTheDocument();
// 	});

// 	it('Switches Themes', async () => {
// 		const user = userEvent.setup();
// 		render(
// 			<ThemeProvider>
// 				<TestComponent />
// 			</ThemeProvider>
// 		);

// 		expect(await screen.findByText('Current Theme: dark')).toBeInTheDocument();

// 		for (let i = 0; i < starThemes.length * 2; i++) {
// 			const theme = starThemes[i % starThemes.length];
// 			await user.click(screen.getByText(theme));
// 			expect(await screen.findByText(`Current Theme: ${theme}`)).toBeInTheDocument();
// 		}
// 	});
// });
