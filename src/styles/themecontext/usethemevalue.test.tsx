// import userEvent from '@testing-library/user-event';
// import { ThemeProvider, useAppTheme } from '../../contexts/theme';
// import { cleanup, render, screen } from '../../test-utils';
import { getREM, useThemeValues } from './usethemevalue';

// const TestComponent: React.FC = () => {
// 	const [theme, setTheme] = useAppTheme();
// 	const props = useThemeValues(['--some-prop']);
// 	return (
// 		<>
// 			<div>{props?.['--some-prop']}</div>
// 			<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Switch Theme</button>
// 		</>
// 	);
// };

// describe('useThemeValue', () => {
// 	beforeEach(() => {});
// 	afterEach(cleanup);

// 	it('Grabs props from the css', async () => {
// 		const user = userEvent.setup();
// 		render(
// 			<ThemeProvider>
// 				<TestComponent />
// 			</ThemeProvider>
// 		);

// 		document.documentElement.style.setProperty('--some-prop', 'some value');
// 		await user.click(screen.getByText('Switch Theme'));

// 		expect(screen.getByText('some value')).toBeInTheDocument();

// 		document.documentElement.style.setProperty('--some-prop', 'some other value');
// 		await user.click(screen.getByText('Switch Theme'));
// 		expect(screen.getByText('some other value')).toBeInTheDocument();
// 	});
// });

// describe('getREM', () => {
// 	beforeEach(() => {});
// 	afterEach(cleanup);

// 	it('Gets the app rem value in pixels', async () => {
// 		document.documentElement.style.setProperty('font-size', '15px');
// 		expect(getREM(1)).toBe(15);
// 		expect(getREM()).toBe(15);

// 		document.documentElement.style.setProperty('font-size', '20px');
// 		expect(getREM(5)).toBe(100);
// 	});
// });
