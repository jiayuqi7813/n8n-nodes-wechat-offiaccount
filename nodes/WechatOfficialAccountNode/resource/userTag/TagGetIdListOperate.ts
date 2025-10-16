import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const TagGetIdListOperate  : ResourceOperations = {
	name: '获取用户身上的标签列表',
	value: 'tag:getIdList',
	options: [
		{
			displayName: 'OpenID',
			name: 'openid',
			type: 'string',
			required: true,
			default: '',
			description: '用户的OpenID',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const openid = this.getNodeParameter('openid', index) as string;

		const body: IDataObject = {
			openid,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/tags/getidlist`,
			body,
		}, index);
	}
};

export default TagGetIdListOperate;
