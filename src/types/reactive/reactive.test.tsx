// import { cleanup } from '../../test-utils';
import { Reactive } from './reactive';
import { ExcludeMethods } from './type';

class TestReactive extends Reactive<TestReactive> {
	str: string = 'abc';
	num: number = 123;

	createState() {
		return { ...this, somethingExtra: true };
	}

	someFunct() {}
	waitForUpdates() {
		this.holdUpdates = true;
	}
	willUpdate() {
		this.shouldUpdate = true;
	}
}

describe('Reactive', () => {
	let reactive: TestReactive;
	const onUpdate = jest.fn();
	beforeEach(() => {
		reactive = new TestReactive();
		reactive.setOnUpdate(onUpdate);
	});
	// afterEach(cleanup);

	it('Updates based on createState', async () => {
		reactive.handleUpdate();
		expect(onUpdate).toHaveBeenCalledTimes(1);
		// const [state, instance] = onUpdate.mock.lastCall[0];
		// expect(state.somethingExtra).toBe(true);
		// expect(instance).toBe(reactive);
	});

	it('Waits until all updates have been made before updating', async () => {
		reactive.waitForUpdates();
		reactive.handleUpdate();
		reactive.handleUpdate();
		reactive.willUpdate();
		reactive.handleUpdate();
		reactive.handleUpdate();
		expect(onUpdate).not.toHaveBeenCalled();
		reactive.handleUpdate(true);
		expect(onUpdate).toHaveBeenCalledTimes(1);
	});

	it('Doesnt update without updates', async () => {
		reactive.waitForUpdates();
		reactive.handleUpdate(true);

		expect(onUpdate).not.toHaveBeenCalled();
	});
});
