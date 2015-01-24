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
  host: 'test.fubot.cn',

  // mongodb 配置
  db: 'mongodb://127.0.0.1/FIS_dev',
  db_name: 'FIS_dev',

  session_secret: 'secret', // 务必修改
  auth_cookie_name: 'cookie',

  // 程序运行的端口
  port: 3030,

  // admin
  admins: {
    piaoxu: true,
    ninjawei: true,
    zhyaic: true
  },
  // admin email
  admins_email: ['piaoxu@fubot.cn'],

  // 每页显示的发票数量
  page_limit: 7,

  // 数据库单次查询条数限制
  limit: 50000,

  //文件上传配置
  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  // 邮箱配置
  // debug 为 true 时不会发送
  mail_opts: {
    host: 'smtp.ym.163.com',
    port: 25,
    auth: {
      user: 'test@test.com',
      pass: '123456'
    }
  },

  department: ['部门一', '部门二', '部门三', '部门四', '部门五'],
  payMethod: ['现金','信用卡','借记卡','支付宝','其他'],
  invoiceType: ['普通发票', '增值税发票', '替票'],
  progress: ['未处理', '已接收', '处理中', '报销完成'],

  // 首页的通知 - ToDo
  informs: [{
    head: 'BUG反馈',
    text: '使用时若发现BUG，请及时联系管理员，piaoxu@fubot.cn'
  },
  {
    head: 'Fubot 发票系统开通',
    text: 'Fubot发票系统正式上线，使用前请先点击右上角的关于查看使用方法,有任何意见及建议请联系管理员'
  }]
};

module.exports = config;
