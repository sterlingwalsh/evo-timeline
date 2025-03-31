type PotentialClass = string | false | undefined | null;

export const clsx = (...args: PotentialClass[]) => {
	let className = '';
	for (let i = 0; i < args.length; i++) {
		if (args[i]) {
			if (className) className += ' ';
			className += args[i];
		}
	}
	return className;
};
