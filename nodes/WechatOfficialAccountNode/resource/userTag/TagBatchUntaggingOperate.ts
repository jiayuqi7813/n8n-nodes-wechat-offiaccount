import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import NodeUtils from "../../../help/utils/NodeUtils";
import {ResourceOperations} from "../../../help/type/IResource";

const TagBatchUntaggingOperate: ResourceOperations = {
	name: '批量为用户取消标签',
	value: 'tag:batchUntagging',
	options: [
		{
			displayName: 'OpenID列表',
			name: 'openid_list',
			required: true,
			description: '粉丝列表，多个OpenID用逗号分隔',
			type: 'fixedCollection',
			default: [],
			typeOptions: {
				multipleValues: true,
			},
			options: [
				{
					name: 'values',
					displayName: '列表',
					values: [
						{
							displayName: 'Openid',
							name: 'id',
							type: 'string',
							default: '',
							required: true,
						},
					],
				},
			],
		},
		{
			displayName: '标签ID',
			name: 'tagid',
			type: 'number',
			required: true,
			default: null,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const openid_list = NodeUtils.getNodeFixedCollectionList(this.getNodeParameter('openid_list', index) as IDataObject, 'values', 'id');
		const tagid = this.getNodeParameter('tagid', index) as number;

		const body: IDataObject = {
			openid_list,
			tagid,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/tags/members/batchuntagging`,
			body,
		}, index);
	}
};

export default TagBatchUntaggingOperate;
