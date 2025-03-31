// import userEvent from '@testing-library/user-event';
// import { act, cleanup, fireEvent, appRender, screen } from '../../../../test/test-utils';
import { UploadTarget } from './upload';

// function getFile(mimeType: string, fileName: string): File {
// 	return new File([], fileName, { type: mimeType });
// }

// const setupUserEvent = () =>
// 	userEvent.setup({
// 		advanceTimers: vi.advanceTimersByTime.bind(vi),
// 	});

// describe('<UploadTArget />', () => {
// 	const csvFile = getFile('application/octet-stream', 'test.csv');
// 	const handleUpload = vi.fn().mockImplementation(() => new Promise((res) => setTimeout(res)));
// 	beforeEach(() => {
// 		vi.useFakeTimers();
// 		(globalThis as any).jest = {
// 			advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
// 		};
// 	});
// 	afterEach(cleanup);

// 	it('Renders', async () => {
// 		appRender(<UploadTarget handleUpload={handleUpload} />);

// 		expect(screen.getByTestId('uploadFile')).toBeInTheDocument();
// 		expect(screen.getByText('Drag and Drop a file')).toBeInTheDocument();
// 		expect(screen.getByText('Click to open a file browser')).toBeInTheDocument();
// 	});

// 	it('Renders with a custom description', async () => {
// 		appRender(<UploadTarget handleUpload={handleUpload} description='Do Upload' />);

// 		expect(screen.getByText('Do Upload')).toBeInTheDocument();
// 		expect(screen.getByTestId('uploadFile')).toBeInTheDocument();
// 	});

// 	it('Uploads a file based on the input change', async () => {
// 		const user = setupUserEvent();
// 		appRender(<UploadTarget handleUpload={handleUpload} />);

// 		const input = screen.getByTestId('uploadFile');
// 		await user.upload(input, [csvFile]);

// 		expect(handleUpload).toHaveBeenCalledTimes(1);

// 		expect(screen.getByText('test.csv')).toBeInTheDocument();
// 		expect(await screen.findByText('Upload Started')).toBeInTheDocument();

// 		vi.runAllTimers(); // complete the "upload"

// 		expect(screen.getByText('test.csv')).toBeInTheDocument();
// 		expect(await screen.findByText('Upload Complete')).toBeInTheDocument();
// 	});

// 	it('Uploads a file on drop', async () => {
// 		appRender(<UploadTarget handleUpload={handleUpload} />);

// 		const input = screen.getByTestId('uploadFile');
// 		fireEvent.drop(input, { dataTransfer: { files: { item: () => csvFile, length: 1 } } });

// 		expect(handleUpload).toHaveBeenCalledTimes(1);

// 		expect(screen.getByText('test.csv')).toBeInTheDocument();
// 		expect(await screen.findByText('Upload Started')).toBeInTheDocument();

// 		vi.runAllTimers(); // complete the "upload"

// 		expect(screen.getByText('test.csv')).toBeInTheDocument();
// 		expect(await screen.findByText('Upload Complete')).toBeInTheDocument();
// 	});

// 	it('Changes style based on mouse interactions', async () => {
// 		appRender(<UploadTarget handleUpload={handleUpload} />);

// 		const label = screen.getByTestId('upload-drop-target');
// 		expect(label).not.toHaveClass('dragging');

// 		fireEvent.dragEnter(label);
// 		expect(label).toHaveClass('dragging');

// 		fireEvent.dragLeave(label);
// 		expect(label).not.toHaveClass('dragging');

// 		fireEvent.dragOver(label);
// 		expect(label).toHaveClass('dragging');

// 		fireEvent.dragLeave(label);
// 		expect(label).not.toHaveClass('dragging');
// 	});

// 	it('Warns when a file type is unsupported', async () => {
// 		appRender(<UploadTarget handleUpload={handleUpload} accept='doc' />);

// 		const input = screen.getByTestId('uploadFile');
// 		fireEvent.drop(input, { dataTransfer: { files: { item: () => csvFile, length: 1 } } });

// 		expect(await screen.findByText('test.csv')).toBeInTheDocument();
// 		expect(await screen.findByText('Unsupported file type.')).toBeInTheDocument();

// 		expect(handleUpload).not.toHaveBeenCalled();
// 	});

// 	it('Displays an upload error', async () => {
// 		handleUpload.mockRejectedValue(new Error('oops'));
// 		appRender(<UploadTarget handleUpload={handleUpload} />);

// 		const input = screen.getByTestId('uploadFile');
// 		fireEvent.drop(input, { dataTransfer: { files: { item: () => csvFile, length: 1 } } });
// 		expect(handleUpload).toHaveBeenCalled();
// 		expect(await screen.findByText('test.csv')).toBeInTheDocument();
// 		expect(await screen.findByText('oops')).toBeInTheDocument();
// 	});

// 	it('Bails out if there are no files', async () => {
// 		appRender(<UploadTarget handleUpload={handleUpload} />);
// 		const input = screen.getByTestId('uploadFile');
// 		fireEvent.drop(input, { dataTransfer: { files: null } });
// 		expect(handleUpload).not.toHaveBeenCalled();
// 	});

// 	it('Clears the status list', async () => {
// 		const user = setupUserEvent();
// 		appRender(<UploadTarget handleUpload={handleUpload} />);

// 		const input = screen.getByTestId('uploadFile');
// 		fireEvent.drop(input, { dataTransfer: { files: { item: () => csvFile, length: 1 } } });

// 		expect(handleUpload).toHaveBeenCalledTimes(1);

// 		vi.runAllTimers(); // complete the "upload"

// 		expect(screen.getByText('test.csv')).toBeInTheDocument();
// 		expect(await screen.findByText('Upload Complete')).toBeInTheDocument();

// 		await user.click(screen.getByText('Clear'));

// 		expect(screen.queryByText('test.csv')).not.toBeInTheDocument();
// 		expect(screen.queryByText('Upload Complete')).not.toBeInTheDocument();
// 	});

// 	it('Queues multiple files in batches', async () => {
// 		const user = setupUserEvent();
// 		const uploads: PromiseWithResolvers<unknown>[] = [];
// 		const handleUpload = vi.fn().mockImplementation(() => {
// 			const p = Promise.withResolvers();
// 			uploads.push(p);
// 			return p.promise;
// 		});

// 		appRender(<UploadTarget handleUpload={handleUpload} concurrent={3} />);
// 		const csvs = new Array(10).fill(null).map((n, i) => getFile('application/octet-stream', `test${i}.csv`));

// 		const input = screen.getByTestId('uploadFile');
// 		await user.upload(input, csvs);

// 		expect(await screen.findAllByText('Upload Started')).toHaveLength(1);
// 		expect(await screen.findAllByText('Queued')).toHaveLength(9);

// 		await act(async () => vi.runAllTimers());

// 		expect(await screen.findAllByText('Upload Started')).toHaveLength(3);
// 		expect(await screen.findAllByText('Queued')).toHaveLength(7);

// 		await act(async () => vi.runAllTimers());
// 		expect(await screen.findAllByText('Upload Started')).toHaveLength(3);
// 		expect(await screen.findAllByText('Queued')).toHaveLength(7);

// 		await act(async () => {
// 			uploads[0].resolve(true);
// 			uploads[1].resolve(true);
// 		});

// 		expect(await screen.findAllByText('Upload Started')).toHaveLength(3);
// 		expect(await screen.findAllByText('Queued')).toHaveLength(5);
// 		expect(await screen.findAllByText('Upload Complete')).toHaveLength(2);

// 		await act(async () => {
// 			uploads[2].resolve(true);
// 			uploads[3].resolve(true);
// 		});

// 		expect(await screen.findAllByText('Upload Started')).toHaveLength(3);
// 		expect(await screen.findAllByText('Queued')).toHaveLength(3);
// 		expect(await screen.findAllByText('Upload Complete')).toHaveLength(4);

// 		await act(async () => {
// 			uploads[4].reject(new Error('oops'));
// 			uploads[5].resolve(true);
// 		});

// 		expect(await screen.findAllByText('Upload Started')).toHaveLength(3);
// 		expect(await screen.findAllByText('Queued')).toHaveLength(1);
// 		expect(await screen.findAllByText('Upload Complete')).toHaveLength(5);
// 		expect(await screen.findAllByText('oops')).toHaveLength(1);

// 		await act(async () => {
// 			uploads[6].reject(new Error('oops'));
// 			uploads[7].resolve(true);
// 			uploads[8].resolve(true);
// 		});

// 		expect(await screen.findAllByText('Upload Started')).toHaveLength(1);
// 		expect(screen.queryAllByText('Queued')).toHaveLength(0);
// 		expect(await screen.findAllByText('Upload Complete')).toHaveLength(7);
// 		expect(await screen.findAllByText('oops')).toHaveLength(2);

// 		await act(async () => {
// 			uploads[9].resolve(true);
// 		});
// 		expect(screen.queryAllByText('Upload Started')).toHaveLength(0);
// 		expect(screen.queryAllByText('Queued')).toHaveLength(0);
// 		expect(await screen.findAllByText('Upload Complete')).toHaveLength(8);
// 		expect(await screen.findAllByText('oops')).toHaveLength(2);
// 	});
// });
