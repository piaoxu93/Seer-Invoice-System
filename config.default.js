/**
 * config
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: 'Fubot invoice system', // 社区名字
  description: 'Fubot 发票系统', // 社区的描述
  keywords: 'FIS',

  site_logo: '/public/images/FUBOT.png', // default is `name`
  site_icon: '/public/images/FUBOT_icon_32.png', // 默认没有 favicon, 这里填写网址
  // 右上角的导航区
  site_navs: [
    // 格式 [ path, title, [target=''] ]
    [ '/about', '关于' ]
  ],

  site_static_host: '', // 静态文件存储域名
  // 网站的域名
  host: 'invoice.fubot.cn',

  // mongodb 配置
  db: 'mongodb://127.0.0.1/FIS_dev',
  db_name: 'FIS_dev',

  session_secret: 'FIS_secret', // 务必修改
  auth_cookie_name: 'FIS_cookie',

  // 程序运行的端口
  port: 3030,

  // admin
  admins: {
    piaoxu: true,
    ninjawei: true,
    zhyaic: false
  },

  // 数据库单次查询条数限制
  limit: 50000,

  //文件上传配置
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  department: ['部门一', '部门二', '部门三', '部门四', '部门五'],
  payMethod: ['现金','信用卡','借记卡','支付宝','其他'],
  invoiceType: ['普通发票', '增值税发票', '替票'],
  progress: ['未处理', '已接收', '处理中', '报销完成'],

  // 首页的通知 - ToDo
  inform: [{}, {}]
};

module.exports = config;
