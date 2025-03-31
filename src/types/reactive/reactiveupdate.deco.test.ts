// import { cleanup } from '../../test-utils';
import { Reactive } from './reactive';
import { SmartUpdate, Update } from './reactiveupdate.deco';

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

	@(SmartUpdate as any)
	setStrSmart(s: string) {
		this.setStr('1');
		this.setStr('2');
		this.setStr('3');
		this.str = s;
	}

	@(Update as any)
	async setStrPromise(s: string) {
		this.str = s;
	}

	@(SmartUpdate as any)
	async setStrSmartPromise(s: string) {
		this.setStr('1');
		this.setStr('2');
		this.setStr('3');
		this.str = s;
	}
}

describe('ReactiveUpdate', () => {
	let test: TestReactive;
	let updateSpy: jest.SpyInstance;
	let createSpy: jest.SpyInstance;
	beforeEach(() => {
		test = new TestReactive();
		updateSpy = jest.spyOn(test, 'handleUpdate');
		createSpy = jest.spyOn(test, 'createState');
	});
	// afterEach(cleanup);

	it('Runs handleUpdate after the function has been called', async () => {
		test.setStr('newStr');
		expect(test.str).toBe('newStr');
		expect(updateSpy).toHaveBeenCalledTimes(1);
		expect(createSpy).toHaveBeenCalledTimes(1);
	});

	it('Tells update handler to wait for all updates', async () => {
		test.setStrSmart('newStr');
		expect(test.str).toBe('newStr');
		expect(updateSpy).toHaveBeenCalledTimes(4);
		expect(createSpy).toHaveBeenCalledTimes(1);
	});

	it('Runs handleUpdate after the function has been called with a promise', async () => {
		await test.setStrPromise('newStr');
		expect(test.str).toBe('newStr');
		expect(updateSpy).toHaveBeenCalledTimes(1);
		expect(createSpy).toHaveBeenCalledTimes(1);
	});

	it('Tells update handler to wait for all updates with a promise', async () => {
		await test.setStrSmart('newStr');
		expect(test.str).toBe('newStr');
		expect(updateSpy).toHaveBeenCalledTimes(4);
		expect(createSpy).toHaveBeenCalledTimes(1);
	});
});
