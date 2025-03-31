import { Reactive } from '../../types/reactive/reactive';
import { ExcludeMethods } from '../../types/reactive/type';
import { Api } from './api/Api';
import { DevApi } from './api/Api.dev';

export class Auth extends Reactive<Auth> {
	api = import.meta.env.DEV ? new DevApi() : new Api();
	createState(): ExcludeMethods<Auth> {
		return { ...this };
	}
}
