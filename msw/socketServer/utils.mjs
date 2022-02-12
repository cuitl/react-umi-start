/**
 * @file 用于socket数据mock的工具函数集合
 */

import Mock from 'mockjs';

// 转化 socket 消息 到 JSON|string
export const getJSONOrString = (data) => {
  let result;
  try {
    result = JSON.parse(data);
  } catch {
    result = data.toString();
  }
  return result;
};

// 使用 mockjs 模拟随机数据
export const getRandom = (type) => {
  let result = Mock.mock('@integer(1, 1000000)');
  switch (type) {
    case 'paragraph':
      result = Mock.mock('@cparagraph');
      break;
    case 'name':
      result = Mock.mock('@cname');
      break;
    default:
      break;
  }
  return result;
};

// 同步服务器时间任务
export const serverTimer = {
  t: null,
  run(cb) {
    this.stop();
    this.t = setInterval(() => {
      cb && cb();
    }, 1000);
  },
  stop() {
    if (this.t) {
      clearInterval(this.t);
    }
  },
};
