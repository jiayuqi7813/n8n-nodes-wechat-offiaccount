import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const UserBlacklistOperate  : ResourceOperations = {
	name: '获取黑名单列表',
	value: 'user:getBlacklist',
	description: '获取账号的黑名单列表',
	options: [],
	async call(this: IExecuteFunctions, index: number, proxy?: string): Promise<IDataObject> {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/tags/members/getblacklist`,
			body: {},
		}, index);
	}
};

export default UserBlacklistOperate;
