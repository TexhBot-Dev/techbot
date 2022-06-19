import type { PieceContext } from '@sapphire/framework';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';

export class UserRoute extends Route {
	public constructor(context: PieceContext, options?: RouteOptions) {
		super(context, {
			...options,
			route: 'guilds'
		});
	}

	public [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const guilds = this.container.client.guilds.cache.map((guild) => {
			const { id, name, icon } = guild;
			return {
				id,
				name,
				icon
			};
		});
		response.json({ guilds });
	}
}
