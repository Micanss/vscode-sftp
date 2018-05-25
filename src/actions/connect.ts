import * as vscode from 'vscode';
import { getAllConfigs } from '../modules/config';
import logger from '../logger';
import { showWarningMessage, getWorkspaceFolders } from '../host';
import HTTPClient from '../core/Client/HTTPClient';
import { upload } from '../actions/index';

export function connect() {
  const config = getAllConfigs();
  config.map(cfg => {
    if (cfg.sylName === '' || cfg.sylPwd === '') {
      showWarningMessage('请设置登录实验楼的用户名和密码');
    } else {
      // logger.info('ss', cfg.context);
      login(cfg);
    }
  });
}

function login(config) {
  const { sylName, sylPwd } = config;
  const http = new HTTPClient({ sylName, sylPwd });
  vscode.window.showInformationMessage(`正在登录中: 用户名 ${sylName}, 密码 ${sylPwd}`);
  vscode.window.setStatusBarMessage('login to shiyalou ....');
  http.connect().then(res => {
    logger.info('login success:');
    logger.info('ss', getWorkspaceFolders());
    const [{ uri }] = getWorkspaceFolders();
    upload(uri.path, config);
  }).catch(handleError);
}

// 处理异常响应
function handleError(error) {
  if (!error || !(error instanceof Object)) {
      logger.info(`操作失败: ${error || '请重试'}`);
      return false;
  }
  const response = error.response;
  if (!response) {
      logger.info(
          `操作失败: 未知的错误！${JSON.stringify(error)}`
      );
  }
  if (response.data && response.data.message) {
      logger.info(
          `操作失败: ${response.data.message}`
      );
  } else {
      logger.info(
          `操作失败: 状态码 ${response.status}, ${response.statusText}`
      );
  }
}
