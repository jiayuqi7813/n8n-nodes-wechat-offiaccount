import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeTypeAndVersion,
} from 'n8n-workflow';
import { INodeExecutionData } from 'n8n-workflow';
import WechatMsgSignUtils from '../help/utils/WechatMsgSignUtils';
import xmlConvert from 'xml-js';

export class WechatOfficialAccountResponseNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wechat Official Account Response',
		name: 'wechatOfficialAccountResponseNode',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:icon.png',
		description: 'Wechat Official Account Response',
		group: ['transform'],
		version: 1,
		defaults: {
			name: 'Wechat Official Account Response',
		},
		hints: [{
		message: '用于处理微信公众号的响应数据，请最后使用response节点进行响应',
		type: 'info' as const,
	}],
		// @ts-ignore
		inputs: ['main'],
		// @ts-ignore
		outputs: ['main'],
		properties: [
			{
				displayName: '响应数据格式',
				name: 'dataFormat',
				type: 'options',
				options: [
					{
						name: 'XML',
						value: 'xml',
					},
					{
						name: 'JSON',
						value: 'json',
					},
				],
				default: 'xml',
			},
			{
				displayName: '响应数据',
				name: 'content',
				type: 'string',
				default: '',
				typeOptions: { rows: 5 },
				required: true,
				displayOptions: {
					show: {
						dataFormat: ['xml'],
					},
				},
			},
			{
				displayName: '响应数据',
				name: 'content',
				type: 'string',
				default: '',
				typeOptions: { rows: 5 },
				displayOptions: {
					show: {
						dataFormat: ['json'],
					},
				},
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const parentNodes = this.getParentNodes(this.getNode().name);
		const trigger = parentNodes.find((node) =>
			node.type.includes('wechatOfficialAccountTrigger'),
		) as NodeTypeAndVersion;
		if (!trigger) {
			throw new NodeOperationError(
				this.getNode(),
				'No connected Wechat Official Account Trigger node found',
			);
		}

		const content = this.getNodeParameter('content', 0) as string;
		const dataFormat = this.getNodeParameter('dataFormat', 0, 'xml') as string;

		const workflowData = this.getWorkflowStaticData('global');
		if (!workflowData) {
			throw new NodeOperationError(this.getNode(), 'No workflow data found');
		}

		const signatureType = workflowData?.signatureType as string;
		let body: any;
		if (signatureType === 'aes') {
			const token = workflowData.token as string;
			const aesKey = workflowData.aesKey as string;
			const appId = workflowData.appId as string;
			body = WechatMsgSignUtils.encryptResponse(content, aesKey, token, appId);

			if (dataFormat === 'xml') {
				body = xmlConvert.js2xml(
					{
						xml: body,
					},
					{
						indentCdata: true,
						compact: true,
						ignoreComment: true,
						spaces: 4,
						textFn: (value: any, currentElementName: string, currentElementObj: any) => {
							if (typeof currentElementObj !== 'string') return value;
							return `<![CDATA[${value}]]>`;
						},
					},
				);
			}
		} else {
			// 明文
			body = content;
		}

		let headers = {} as any
		if (dataFormat === 'xml'){
			headers['Content-Type'] = 'application/xml'
		}

		this.sendResponse({
			headers: headers,
			statusCode: 200,
			body: body,
		})


		return [this.helpers.returnJsonArray({
			body: body
		})];
	}
}
