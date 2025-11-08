# WebSocket 连接

🤔 你是否还在苦恼 WebSocket 连接不断线的问题？  
🍛 这里有一份详细的解决方案，帮助你解决 WebSocket 连接不断线的问题。

## 1. 安装插件

```bash
yarn add reconnect-websocket@latest     #安装最新版
```

## 2. 使用插件

```js
import ReconnectingWebsocket from "reconnecting-websocket";
const websocket = new ReconnectingWebsocket("ws://localhost:8080");
// 连接时触发
websocket.onopen = () => {
  console.log("连接成功");
  websocket.send("hello"); //发送消息
};
// 收到消息时触发
websocket.onmessage = (msg) => {console.log("收到消息", msg);};
// 连接关闭时触发
websocket.onclose = () => {console.log("连接关闭");};
// 连接错误时触发
websocket.onerror = (err) => {console.log("连接错误", err);};
// 强制断开连接
// websocket.close()
```
🍯 小友这样就不用担心断线了