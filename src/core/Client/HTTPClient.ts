import * as Client from 'axios';
import RemoteClient, { IClientOption } from './RemoteClient';
import logger from '../../logger';

export default class HTTPClient extends RemoteClient {
  private connected: boolean = false;

  constructor(option?: any) {
    super(option);
  }

  initClient() {
    return Client;
  }

  connect(): Promise<void> {
    const { sylName, sylPwd } = this.getOption();
    logger.info('account: ', [sylName, sylPwd]);
    return this.client({
      method: 'get',
      url: 'https://www.shiyanlou.com/login',
      data: null,
    });
  }

  end() {
    return false;
  }

  getFsClient() {
    return this.client;
  }
}
