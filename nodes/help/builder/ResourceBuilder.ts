import { INodePropertyOptions } from 'n8n-workflow';
import { IResource, ResourceOperations } from '../type/IResource';
import { INodeProperties } from 'n8n-workflow';

class ResourceBuilder {
	resources: IResource[] = [];

	addResource(resource: INodePropertyOptions) {
		this.resources.push({
			...resource,
			operations: [],
		});
	}

	addOperate(resourceName: string, operate: ResourceOperations) {
		const resource = this.resources.find((resource) => resource.value === resourceName);
		if (resource) {
			resource.operations.push(operate);
		}
	}

	build(): INodeProperties[] {
		// 构建 Operations
		let list: INodeProperties[] = [];

		list.push({
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: this.resources.map((item) => {
				return {
					name: item.name,
					value: item.value,
				};
			}),
			default: '',
		});

		for (const resource of this.resources) {
			if (resource.operations.length === 0) continue;
			list.push({
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [resource.value],
					},
				},
				options: resource.operations.map((item) => {
					return {
						name: item.name,
						value: item.value,
					};
				}),
				default: '',
			});

			for (const operation of resource.operations) {
				for (let option of operation.options) {
					// @ts-ignore
					list.push({
						...option,
						displayOptions: {
							...(option.displayOptions || {}),
							show: {
								...(option.displayOptions?.show || {}),
								resource: [resource.value],
								operation: [operation.value],
							},
						},
					});
				}
			}
		}

		// 添加全局Options配置
		list.push({
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add Option',
			default: {},
			options: [
				{
					displayName: 'Proxy',
					name: 'proxy',
					type: 'string',
					default: '',
					placeholder: 'http://username:password@proxy.example.com:8080',
					description: '代理服务器地址，格式：http://[username:password@]host:port',
				},
				{
					displayName: 'Timeout',
					name: 'timeout',
					type: 'number',
					default: 10,
					description: '请求超时时间（秒）',
				},
				{
					displayName: 'Ignore SSL Issues',
					name: 'allowUnauthorizedCerts',
					type: 'boolean',
					default: false,
					description: 'Whether to connect even if SSL certificate validation is not possible',
				},
				{
					displayName: 'Follow Redirect',
					name: 'followRedirect',
					type: 'boolean',
					default: true,
					description: '是否自动跟随重定向',
				},
				{
					displayName: 'Max Redirects',
					name: 'maxRedirects',
					type: 'number',
					default: 21,
					description: '最大重定向次数',
					displayOptions: {
						show: {
							followRedirect: [true],
						},
					},
				},
			],
		});

		return list;
	}

	getCall(resourceName: string, operateName: string): Function | null {
		const resource = this.resources.find((item) => item.value === resourceName);
		if (!resource) {
			// @ts-ignore
			return null;
		}
		const operate = resource.operations.find((item) => item.value === operateName);
		// @ts-ignore
		return operate?.call;
	}
}

export default ResourceBuilder;
