# 打卡小工具（check-in-web）

一个用于管理每日目标与打卡记录的前端应用。用户可以注册账号、创建按周或按天重复的目标，每天勾选目标完成情况，并通过日历回顾自己的打卡历史与完成率。

- 线上地址：<https://www.checkapp.asia>
- 后端服务：独立部署的 Java 服务（默认 `http://localhost:8080`），本仓库只包含前端。

## 功能

| 模块 | 路由 | 说明 |
| --- | --- | --- |
| 登录 | `/login` | 邮箱 + 密码登录，成功后保存 token 并进入主面板 |
| 注册 | `/register` | 邮箱验证码注册，需二次确认密码 |
| 找回密码 | `/update` | 通过邮箱验证码重置密码 |
| 主面板 | `/main` | 三个标签页：每日目标、目标管理、总结 |
| 编辑资料 | `/editProfile` | 查看并修改用户名（邮箱只读），入口在右上角头像菜单 |

主面板的三个标签页：

- **每日目标**：查询「今天」需要完成的目标，支持「标记完成 / 取消完成」，分页展示。
- **目标**：目标的新增与删除，字段包括标题、内容、提醒频率（周一至周日或每日），分页展示。
- **总结**：日历视图回顾打卡记录。日期格内展示当天目标（完成 / 未完成用颜色区分）；点击日期可在弹窗中查看当天详情；月视图显示当月未完成数量；可查看今年与去年的记录。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | React 18 |
| 构建 | Create React App（`react-scripts` 5） |
| 路由 | react-router-dom 6（`useRoutes` + `lazy` 懒加载） |
| UI 组件 | Ant Design 5、`@ant-design/icons` |
| HTTP | axios（统一封装拦截器） |
| 日期处理 | dayjs（与 antd 内置版本一致，启用 `zh-cn` locale） |
| 部署 | Docker 多阶段构建 + Nginx，GitHub Actions 自动发布 |

## 界面与设计

整体为「暖调极简」风格：米白画布 + 近黑主色 + 大量留白，视觉资产集中在两处文件里，改版时不必逐个组件翻样式。

- `src/theme.js`：Ant Design 主题令牌（主色、圆角、控件高度、表格 / 日历等组件级配置）。
- `src/styles/global.css`：CSS 变量（`--canvas`、`--ink`、`--line`、`--success` 等）、通用布局类（`.card`、`.summary`、`.check-row`、`.auth` 等）、动效与响应式断点。

设计要点：

- 登录 / 注册 / 找回密码共用 `AuthShell`：左侧图片视觉区 + 右侧表单卡片，窄屏自动收起图片区。
- 主面板为毛玻璃顶栏 + 胶囊式导航，内容区固定最大宽度 1160px，阅读更集中。
- 每日目标提供完成度进度条与「已完成 / 未完成」标签；勾选采用乐观更新，进度条和数字以 0.5s 缓动过渡（遵循系统的「减弱动态效果」设置），空列表有引导入口。
- 统一使用 `10 / 14 / 20` 的圆角阶梯与两级阴影，交互元素均带 hover / focus 反馈，并支持 `prefers-reduced-motion`。

## 快速开始

### 环境要求

- Node.js 16 及以上（CI 与镜像使用 Node 16）
- npm 8 及以上

### 安装与运行

```bash
npm install
npm start        # 开发服务器，默认 http://localhost:3000
```

### 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm start` | 启动开发服务器（热更新） |
| `npm run build` | 构建生产产物到 `build/` 目录 |
| `npm test` | 启动 CRA 测试运行器 |
| `npm run eject` | 弹出 CRA 配置（不可逆，一般不需要） |

### 环境变量

接口地址通过 `REACT_APP_BASE_URL` 注入，见 `src/util/HttpUtil.js`：

| 文件 | 值 | 用途 |
| --- | --- | --- |
| `.env.development` | `http://localhost:8080` | 本地调试，直连本机后端 |
| `.env.production` | `/api` | 生产环境，由 Nginx 反向代理到后端 |

> 新增环境变量时必须以 `REACT_APP_` 开头，否则不会注入到前端代码中；修改后需重启开发服务器。

## 目录结构

```
check_in_web/
├─ public/                  静态资源（含 public/static/images 下的页面配图）
├─ src/
│  ├─ index.js              入口：ConfigProvider + 主题 + 路由挂载
│  ├─ App.js                使用 useRoutes 渲染路由表
│  ├─ theme.js              Ant Design 主题令牌
│  ├─ styles/global.css     设计令牌、通用布局类、动效与响应式
│  ├─ router/index.js       路由定义与懒加载
│  ├─ page/                 页面级组件
│  │  ├─ Login/             登录
│  │  ├─ Register/          注册
│  │  ├─ Update/            找回密码
│  │  └─ Main/              主面板（顶栏 + 导航 + 内容区）
│  ├─ component/            业务与布局组件
│  │  ├─ AuthShell/         登录 / 注册 / 找回密码共用骨架
│  │  ├─ Brand/             品牌标识
│  │  ├─ AnimatedNumber/    数字滚动过渡
│  │  ├─ Target/            目标管理
│  │  ├─ TargetItemContainer/ 每日目标打卡
│  │  ├─ Conclusion/        总结（日历）
│  │  ├─ EditProfile/       编辑资料
│  │  ├─ ProfileMenu/       账户下拉菜单
│  │  └─ CustomFooter/      页脚
│  └─ util/
│     ├─ HttpUtil.js        axios 实例与请求封装
│     ├─ DateUtil.js        日期工具
│     └─ useCountdown.js    验证码倒计时 Hook
├─ Dockerfile               多阶段构建镜像
├─ nginx.conf.prod          生产环境 Nginx 配置
└─ .github/workflows/       CI/CD：构建镜像并部署
```

## 请求约定

所有接口统一走 `src/util/HttpUtil.js`，只暴露 `getRequest` / `postRequest` 两个方法。

- **鉴权**：登录接口返回的 token 存入 `localStorage.authorization`，请求拦截器自动写入 `Authorization` 请求头。
- **Content-Type**：请求体为 `FormData` 时不设置（交给浏览器），其余默认 `application/json`。
- **登录超时**：响应状态码为 `401` 时清除 token、提示「登录超时」并在 0.8 秒后跳转 `/login`。
- **响应结构**：约定为 `{ success, message, data, pagination }`，分页数据读取 `pagination.total`。

已对接的接口：

| 模块 | 接口 |
| --- | --- |
| 用户 | `POST /user/login`、`POST /user/register`、`GET /user/code`、`GET /user/updatePassword`、`GET /user/userInfo`、`POST /user/update` |
| 目标 | `GET /target/findTargets`、`POST /target/add`、`POST /target/delete` |
| 打卡项 | `GET /targetItem/showTargetItemVo`、`POST /targetItem/confirmSuccess`、`POST /targetItem/cancel` |
| 统计 | `GET /dash/getDashTargetItems` |

## 部署

### 构建镜像

```bash
docker build -t check-frontend .
docker run -d -p 80:80 -p 443:443 check-frontend
```

`Dockerfile` 分两阶段：先用 `node:16-alpine` 执行 `npm install && npm run build`，再把 `build/` 产物复制到 `nginx:1.27-alpine`，并覆盖为 `nginx.conf.prod`。

### Nginx

- 静态资源使用 `try_files $uri $uri/ /index.html`，保证前端路由刷新不 404。
- `/api/` 反向代理到后端容器 `http://check-backend:8080`（需与后端处于同一 Docker 网络）。
- 80 端口为 HTTP 服务，443 端口为 HTTPS（证书挂载在 `/usr/local/nginx/https`）。

### 自动化发布

`.github/workflows/frontend-ci.yml` 在推送到 `master` 时触发：

1. 登录腾讯云容器镜像服务（CCR）；
2. 构建并推送镜像 `ccr.ccs.tencentyun.com/mark-chen/check-frontend:latest`；
3. SSH 登录服务器，重启 `check-frontend` 容器。

所需 Secrets：`TENCENT_REGISTRY_USER`、`TENCENT_REGISTRY_PASSWORD`、`SERVER_IP`、`SERVER_SSH_KEY`。

## 开发约定

- 组件使用函数式写法 + Hooks；页面放在 `src/page`，可复用业务组件放在 `src/component`。
- 用户反馈统一通过 `App.useApp()` 获取 `message`，这样能继承主题；不要直接使用静态 `antd.message`，也不要用 `alert`。
- 新增接口调用请复用 `httpUtil`，避免直接使用 `axios`，以保证鉴权与错误处理一致。
- 日期处理统一使用 dayjs（入口已设置 `zh-cn` locale）；日期请求参数仍由 `DateUtil.getNowDate()` 生成，格式为当天零点的 ISO 字符串（如 `2026-10-20T00:00:00.000Z`）。
- 新增颜色、圆角、阴影请复用 `src/styles/global.css` 中的 CSS 变量与 `.card`、`.tag`、`.empty-block` 等基础类，避免继续堆积行内样式。
- 页面布局参考 `.app`（1160px 内容宽度）与 `.auth` 结构，响应式断点为 960 / 820 / 520。
- 项目当前没有测试用例。如需编写测试，请先安装 `@testing-library/react`、`@testing-library/jest-dom`、`@testing-library/user-event`。
