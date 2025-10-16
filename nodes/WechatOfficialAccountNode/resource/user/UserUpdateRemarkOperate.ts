import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const UserUpdateRemarkOperate  : ResourceOperations = {
	name: '设置用户备注名',
	value: 'user:updateRemark',
	options: [
		{
			displayName: 'OpenID',
			name: 'openid',
			type: 'string',
			required: true,
			default: '',
			description: '用户标识',
		},
		{
			displayName: '备注名',
			name: 'remark',
			type: 'string',
			required: true,
			default: '',
			description: '新的备注名，长度必须小于30字节',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const openid = this.getNodeParameter('openid', index) as string;
		const remark = this.getNodeParameter('remark', index) as string;

		const body: IDataObject = {
			openid,
			remark,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/user/info/updateremark`,
			body,
		}, index);
	}
};

export default UserUpdateRemarkOperate;
