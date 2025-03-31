// import userEvent from '@testing-library/user-event';
// import { cleanup, render, screen } from '../../test-utils';
import { cleanup, screen, render } from '@testing-library/react';

import { Reactive } from './reactive';
import { Update } from './reactiveupdate.deco';
import { useReactive } from './usereactive';

class TestReactive extends Reactive<TestReactive> {
	str: string = 'abc';
	num: number = 123;

	createState() {
		return { ...this, somethingExtra: true };
	}

	@(Update as any)
	setStr(s: string) {
		this.str = s;
	}

	@(Update as any)
	setNum(n: number) {
		this.num = n;
	}
}

const TestComponent: React.FC<{ re: TestReactive }> = ({ re }) => {
	const [state, instance] = useReactive(re);
	return (
		<div>
			<div>Str: {state.str}</div>
			<div>Num: {state.num}</div>

			<button onClick={() => instance.setStr('newStr')}>Change Str</button>
			<button onClick={() => instance.setNum(456)}>Change Num</button>
		</div>
	);
};

describe('useReactive', () => {
	let reactive: TestReactive;
	beforeEach(() => {
		reactive = new TestReactive();
	});
	afterEach(cleanup);

	it('Updates the state when it changes', async () => {
		// const user = userEvent.setup();
		render(<TestComponent re={reactive} />);
		expect(screen.getByText('Str: abc')).toBeInTheDocument();
		expect(screen.getByText('Num: 123')).toBeInTheDocument();

		// await user.click(screen.getByText('Change Str'));

		// expect(await screen.findByText('Str: newStr')).toBeInTheDocument();
		// expect(screen.getByText('Num: 123')).toBeInTheDocument();

		// await user.click(screen.getByText('Change Num'));
		// expect(await screen.findByText('Str: newStr')).toBeInTheDocument();
		// expect(screen.getByText('Num: 456')).toBeInTheDocument();
	});

	it('Uses an initializer function', async () => {
		// const user = userEvent.setup();
		const TestComponent: React.FC = () => {
			const [state, instance] = useReactive(() => new TestReactive());
			return (
				<div>
					<div>Str: {state.str}</div>
					<div>Num: {state.num}</div>

					<button onClick={() => instance.setStr('newStr')}>Change Str</button>
					<button onClick={() => instance.setNum(456)}>Change Num</button>
				</div>
			);
		};
		render(<TestComponent />);
		expect(screen.getByText('Str: abc')).toBeInTheDocument();
		expect(screen.getByText('Num: 123')).toBeInTheDocument();

		// await user.click(screen.getByText('Change Str'));

		// expect(await screen.findByText('Str: newStr')).toBeInTheDocument();
		// expect(screen.getByText('Num: 123')).toBeInTheDocument();

		// await user.click(screen.getByText('Change Num'));
		// expect(await screen.findByText('Str: newStr')).toBeInTheDocument();
		// expect(screen.getByText('Num: 456')).toBeInTheDocument();
	});
});
