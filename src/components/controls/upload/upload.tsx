import { ReactNode, useCallback, useRef, useState } from 'react';
import { killEvt } from '../../../helpers/killevt';
import { ButtonBase } from '@mui/material';
import { clsx } from '../../../helpers/clsx';
import classes from './upload.module.scss'



export interface UploadStatus {
	// not just string but these are the possible values (need to expand to realistict representation)
	// "completed" | "partial" | "error" |
	status: 'waiting' | 'started' | 'completed' | 'error' | (string & {});
	message: string;
}

export type SetUploadStatus = (name: string, sts: UploadStatus) => void;
type UploadOnChange = (evt: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement>, files: FileList | null) => Promise<void>

interface UploadTargetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	name?: string;
	description?: ReactNode;
	accept?: string;
	concurrent?: number;
	multiple?: boolean;
	handleUpload?: (file: File, setStatus: SetUploadStatus) => Promise<void>;
	onChange?: UploadOnChange
	value?: File | null;
	required?: boolean;
}

export const UploadTarget: React.FC<UploadTargetProps> = ({ name, required, description, accept, concurrent = 3, multiple = true, handleUpload, onChange, value, ...divProps }) => {

	const [dragging, setDragging] = useState<boolean>(false);
	const [status, setStatus] = useState<Map<string, UploadStatus>>(() => new Map());
	const queue = useRef(new Map<string, File>());
	const working = useRef(new Set<string>());
	const lastStarted = useRef<string>();

	const updateStatus = useCallback((name: string, sts: UploadStatus) => {
		setStatus((status) => {
			status.set(name, sts);
			return new Map(status);
		});
	}, []);

	const runQueue = () => {
		if (working.current.size < concurrent && queue.current.size > 0) {
			const f = queue.current.values().next().value;
			if (f) handleFile(f);
			setTimeout(() => {
				runQueue();
			}, 100);
		}
	};

	const handleFile = async (file: File) => {
		queue.current.delete(file.name);
		working.current.add(file.name);
		const name = file.name;
		lastStarted.current = name;
		if (
			accept &&
			!file?.name?.match(
				new RegExp(
					`.(${accept
						?.split(',')
						.map((type) => type.replace(/^./, ''))
						.join('|')
						.replaceAll(' ', '')})$`,
				),
			)
		) {
			updateStatus(name, { status: 'error', message: 'Unsupported file type.' });
		} else {
			try {
				updateStatus(name, { status: 'started', message: 'Upload Started' });
				await handleUpload?.(file, updateStatus);
				updateStatus(name, { status: 'completed', message: 'Upload Complete' });
			} catch (exc) {
				updateStatus(name, { status: 'error', message: (exc as Error)?.message });
			}
		}
		working.current.delete(file.name);
		runQueue();
	};

	const handleFiles = (files?: FileList | null) => {
		if (!files) return;
		const fileCount = files.length;

		for (let i = 0; i < fileCount; i++) {
			const f = files?.item(i);
			if (f) {
				queue.current.set(f.name, f);
				status.set(f.name, { status: 'waiting', message: 'Queued' });
			}
		}
		runQueue();
		setStatus((s) => new Map(s));
	};

	const active: React.DragEventHandler<HTMLLabelElement> = (evt) => {
		killEvt(evt);
		setDragging(true);
	};

	const inactive: React.DragEventHandler<HTMLLabelElement> = (evt) => {
		killEvt(evt);
		setDragging(false);
	};

	const handleChange: UploadOnChange = async (evt, files) => {
		if (onChange) {
			onChange(evt, files)
		} else {
			handleFiles(files);
		}
	}

	const onDrop: React.DragEventHandler<HTMLLabelElement> = (evt) => {
		killEvt(evt);
		setDragging(false);
		handleChange(evt, evt.dataTransfer.files);
	};

	const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
		handleChange(evt, evt.target.files);
	};

	// const tableRef = useRef<HTMLDivElement>(null);

	return (
		<div {...divProps}>
			<ButtonBase<'label'>
				data-testid='upload-drop-target'
				component='label'
				onDragEnter={active}
				onDragOver={active}
				onDragLeave={inactive}
				onDrop={onDrop}
				className={clsx(classes.container, dragging && classes.dragging)}
			>
				<div className={clsx(classes.root)}>
					{/* {status?.status === 'partial' && (
						<div className='flex-center'>
							<CircularProgress />
							<div>{t('Processing')}...</div>
						</div>
					)} */}

					{description ?? (
						<div className={classes.desc}>
							<div>Drag and Drop a file{required ? ' *' : ''}</div>
							<div>OR</div>
							<div>Click to open a file browser</div>
						</div>
					)}

					<input
						type='file'
						multiple={multiple}
						className={classes.input}
						id='fileElem'
						data-testid='uploadFile'
						onChange={handleInputChange}
						name={name}
					/>

					{!multiple && value ? <div className={classes.desc}>
						<hr style={{ width: '100%' }} />
						<div>Selected:</div>
						<div>{value.name}</div>
					</div> : null}
				</div>
			</ButtonBase>
			{/* {multiple && status.size ? (
				<div className={classes.status_bar}>
					<div className={classes.status}>
						<span>{`Uploaded: ${status.size - queue.current.size - working.current.size}/${status.size}`}</span>
					</div>
					<div className={classes.status_buttons}>
						<Button onClick={() => (queue.current = new Map())}>Cancel</Button>
						<Button
							onClick={() => {
								queue.current = new Map();
								setStatus(new Map());
							}}
						>
							Clear
						</Button>
					</div>
				</div>
			) : null} */}
			{/* {multiple && <div className={classes.status_table} ref={tableRef}>
				{iterMap(status, ({ message }, name) => (
					<div
						key={name}
						ref={(r) => {
							if (r && name === lastStarted.current) {
								tableRef.current?.scrollTo({ top: (r?.offsetTop ?? 0) + (r?.offsetHeight ?? 0) - tableRef.current.offsetHeight + 8 });
							}
						}}
						className={classes.status_row}
					>
						<div>{name}</div>
						<div>{message}</div>
					</div>
				))}
			</div>} */}
		</div>
	);
};
