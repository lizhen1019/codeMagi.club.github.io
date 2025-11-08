# PeerJS连接

📠 PeerJS 简单的 WebRTC 库，用于点对点连接。在 <font style="color: red;">**浏览器**</font> 之间建立实时、点对点的连接，而无需服务器中继。


## 1. 安装与启动

📦 全局安装

```bash
yarn add peerjs -g 
```

🚀 启动服务：注意证书的位置信息
```bash
peerjs --port 9000 --path /peerjs --ssl-key ./key.pem --ssl-cert ./cert.pem --max-concurrent-connections 100
```

## 2. 连接

📝 代码示例

```vue
<template>
    <div class="peer-container">
      <h3>本地 Peer ID: {{ localPeerId }}</h3>
      
      <div class="connection-controls">
        <input
          v-model="newRemotePeerId"
          type="text"
          placeholder="输入对方的 Peer ID"
        />
        <button 
          @click="connectToPeer" 
          :disabled="!newRemotePeerId || newRemotePeerId === localPeerId || isConnected(newRemotePeerId)"
        >
          建立连接
        </button>
      </div>
  
      <!-- 已连接的 peers 列表 -->
      <div v-if="connections.size > 0" class="connected-peers">
        <h4>已连接的用户 ({{ connections.size }})</h4>
        <div class="peer-tags">
          <span v-for="peerId in connections.keys()" :key="peerId" class="peer-tag">
            {{ peerId }}
            <button @click="closeConnection(peerId)" class="close-btn">×</button>
          </span>
        </div>
      </div>
  
      <div class="message-area">
        <div class="message-list">
          <div v-for="(msg, index) in messages" :key="index" class="message-item">
            <!-- 文本消息 -->
            <p v-if="msg.type === 'text'" class="text-message">
              <span :class="msg.isSelf ? 'self' : 'remote'">
                {{ msg.isSelf ? '自己' : msg.from }}: {{ msg.content }}
              </span>
            </p>
            
            <!-- 文件消息 -->
            <div v-if="msg.type === 'file'" class="file-message">
              <span :class="msg.isSelf ? 'self' : 'remote'">
                {{ msg.isSelf ? '自己' : msg.from }} 发送了文件:
                <a 
                  v-if="msg.url" 
                  :href="msg.url" 
                  :download="msg.name"
                  class="file-link"
                >
                  {{ msg.name }} ({{ formatFileSize(msg.size) }})
                </a>
                <span v-else-if="msg.progress !== undefined">
                  {{ msg.name }} - 传输中: {{ msg.progress }}%
                </span>
              </span>
            </div>
  
            <!-- 系统消息 -->
            <p v-if="msg.type === 'system'" class="system-message">
              {{ msg.content }}
            </p>
          </div>
        </div>
        
        <div class="input-area">
          <input
            v-model="message"
            type="text"
            placeholder="输入消息..."
            @keydown.enter="sendMessage"
            :disabled="connections.size === 0"
          />
          <button @click="sendMessage" :disabled="!message || connections.size === 0">发送消息</button>
          
          <!-- 文件选择按钮 -->
          <div class="file-upload">
            <label class="file-label">
              选择文件
              <input type="file" @change="handleFileSelect" :disabled="connections.size === 0" />
            </label>
          </div>
        </div>
      </div>
  
      <div v-if="error" class="error-message">
        ❌ {{ error }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import Peer from 'peerjs';
  
  // 状态管理
  const localPeerId = ref('');
  const newRemotePeerId = ref(''); // 用于输入新的连接ID
  const connections = ref(new Map()); // 存储所有连接: Map<peerId, connection>
  const message = ref('');
  const messages = ref([]);
  const error = ref('');
  const peer = ref(null);
  const currentFileTransfers = ref(new Map()); // 跟踪当前文件传输: Map<fileId, transfer>
  
  // 检查是否已连接到指定peer
  const isConnected = (peerId) => {
    return connections.value.has(peerId);
  };
  
  // 初始化 Peer 连接
  onMounted(() => {
    peer.value = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/peerjs',
      debug: 2
    });
  
    peer.value.on('open', (id) => {
      localPeerId.value = id;
      error.value = '';
      messages.value.push({
        content: `本地ID: ${id} 已就绪`,
        type: 'system'
      });
    });
  
    // 监听来自其他 Peer 的连接请求
    peer.value.on('connection', (conn) => {
      const peerId = conn.peer;
      
      // 如果已有连接，拒绝新连接
      if (connections.value.has(peerId)) {
        conn.close();
        error.value = `已与 ${peerId} 建立连接`;
        return;
      }
  
      // 添加新连接
      connections.value.set(peerId, conn);
      setupConnectionEvents(conn);
      
      messages.value.push({
        content: `${peerId} 已加入聊天`,
        type: 'system'
      });
    });
  
    peer.value.on('error', (err) => {
      error.value = `Peer 错误: ${err.message}`;
      console.error('Peer 错误:', err);
    });
  
    // 监听其他peer断开连接
    peer.value.on('disconnected', () => {
      messages.value.push({
        content: '与服务器断开连接，尝试重连...',
        type: 'system'
      });
      // 尝试重连
      setTimeout(() => peer.value.reconnect(), 2000);
    });
  });
  
  // 配置连接事件
  const setupConnectionEvents = (conn) => {
    const peerId = conn.peer;
  
    conn.on('open', () => {
      error.value = '';
    });
  
    // 接收数据 - 区分文本和文件
    conn.on('data', (data) => {
      // 处理文件元数据
      if (data.type === 'file-meta') {
        handleFileMetaReceived(data, peerId);
      }
      // 处理文件数据块
      else if (data.type === 'file-chunk') {
        handleFileChunkReceived(data);
      }
      // 处理文本消息
      else {
        messages.value.push({
          content: data,
          from: peerId,
          isSelf: false,
          type: 'text'
        });
        scrollToBottom();
      }
    });
  
    conn.on('close', () => {
      connections.value.delete(peerId);
      messages.value.push({
        content: `${peerId} 已离开聊天`,
        type: 'system'
      });
    });
  
    conn.on('error', (err) => {
      error.value = `与 ${peerId} 的连接错误: ${err.message}`;
      console.error(`与 ${peerId} 的连接错误:`, err);
      connections.value.delete(peerId);
    });
  };
  
  // 处理接收到的文件元数据
  const handleFileMetaReceived = (meta, fromPeerId) => {
    const fileTransfer = {
      id: meta.id,
      name: meta.name,
      size: meta.size,
      type: meta.fileType,
      chunks: [],
      totalChunks: meta.totalChunks,
      receivedChunks: 0,
      from: fromPeerId
    };
  
    // 添加文件消息到列表
    const fileMessageIndex = messages.value.push({
      id: meta.id,
      name: meta.name,
      size: meta.size,
      from: fromPeerId,
      isSelf: false,
      type: 'file',
      progress: 0
    }) - 1;
  
    fileTransfer.messageIndex = fileMessageIndex;
    currentFileTransfers.value.set(meta.id, fileTransfer);
  };
  
  // 处理接收到的文件数据块
  const handleFileChunkReceived = (chunkData) => {
    const fileTransfer = currentFileTransfers.value.get(chunkData.id);
    
    if (!fileTransfer) {
      error.value = '收到未知文件的数据块';
      return;
    }
  
    // 存储数据块
    fileTransfer.chunks[chunkData.chunkIndex] = chunkData.data;
    fileTransfer.receivedChunks++;
  
    // 更新进度
    const progress = Math.round((fileTransfer.receivedChunks / fileTransfer.totalChunks) * 100);
    messages.value[fileTransfer.messageIndex].progress = progress;
  
    // 所有数据块接收完成，合并文件
    if (fileTransfer.receivedChunks === fileTransfer.totalChunks) {
      const fileBlob = new Blob(fileTransfer.chunks, { type: fileTransfer.type });
      const fileUrl = URL.createObjectURL(fileBlob);
      
      // 更新消息显示可下载链接
      messages.value[fileTransfer.messageIndex].url = fileUrl;
      messages.value[fileTransfer.messageIndex].progress = undefined;
      
      currentFileTransfers.value.delete(fileTransfer.id);
    }
  
    scrollToBottom();
  };
  
  // 选择文件处理
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file || connections.value.size === 0) return;
  
    // 重置文件输入
    event.target.value = '';
  
    // 定义 chunk 大小 (100KB)
    const CHUNK_SIZE = 1024 * 100;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = Date.now().toString(); // 生成唯一文件 ID
  
    // 添加文件消息到列表
    const fileMessageIndex = messages.value.push({
      id: fileId,
      name: file.name,
      size: file.size,
      isSelf: true,
      type: 'file',
      progress: 0
    }) - 1;
  
    // 向所有连接的peer发送文件元数据
    connections.value.forEach(conn => {
      conn.send({
        type: 'file-meta',
        id: fileId,
        name: file.name,
        size: file.size,
        fileType: file.type,
        totalChunks: totalChunks
      });
    });
  
    // 分块读取并发送文件
    const fileReader = new FileReader();
    let currentChunk = 0;
  
    const readNextChunk = () => {
      const start = currentChunk * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
  
      fileReader.readAsArrayBuffer(chunk);
    };
  
    fileReader.onload = (e) => {
      // 向所有连接的peer发送数据块
      connections.value.forEach(conn => {
        conn.send({
          type: 'file-chunk',
          id: fileId,
          chunkIndex: currentChunk,
          data: e.target.result
        });
      });
  
      // 更新进度
      currentChunk++;
      const progress = Math.round((currentChunk / totalChunks) * 100);
      messages.value[fileMessageIndex].progress = progress;
  
      // 所有块发送完成
      if (currentChunk < totalChunks) {
        readNextChunk();
      } else {
        messages.value[fileMessageIndex].progress = undefined;
        // 创建本地预览 URL
        const fileUrl = URL.createObjectURL(file);
        messages.value[fileMessageIndex].url = fileUrl;
      }
  
      scrollToBottom();
    };
  
    fileReader.onerror = (err) => {
      error.value = `文件读取错误: ${err.message}`;
      console.error('文件读取错误:', err);
    };
  
    // 开始读取第一个块
    readNextChunk();
  };
  
  // 主动连接到远程 Peer
  const connectToPeer = () => {
    const peerId = newRemotePeerId.value.trim();
    
    if (!peerId || peerId === localPeerId.value || connections.value.has(peerId)) {
      error.value = '请输入有效的远程 Peer ID';
      return;
    }
  
    const conn = peer.value.connect(peerId, {
      serialization: 'binary' // 启用二进制传输
    });
    
    // 连接建立前先添加到连接列表（标记为连接中）
    connections.value.set(peerId, conn);
    
    setupConnectionEvents(conn);
  
    conn.on('open', () => {
      messages.value.push({
        content: `已成功连接到 ${peerId}`,
        type: 'system'
      });
      newRemotePeerId.value = ''; // 清空输入框
    });
  
    conn.on('error', (err) => {
      error.value = `连接 ${peerId} 失败: ${err.message}`;
      connections.value.delete(peerId);
    });
  };
  
  // 发送文本消息（广播给所有连接）
  const sendMessage = () => {
    if (!message.value.trim() || connections.value.size === 0) return;
  
    const content = message.value.trim();
    
    // 向所有连接的peer发送消息
    connections.value.forEach(conn => {
      conn.send(content);
    });
    
    // 添加到本地消息列表
    messages.value.push({
      content,
      isSelf: true,
      type: 'text'
    });
    
    message.value = '';
    scrollToBottom();
  };
  
  // 断开与指定peer的连接
  const closeConnection = (peerId) => {
    const conn = connections.value.get(peerId);
    if (conn) {
      conn.close();
      connections.value.delete(peerId);
      messages.value.push({
        content: `已断开与 ${peerId} 的连接`,
        type: 'system'
      });
    }
  };
  
  // 工具函数：格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // 滚动到最新消息
  const scrollToBottom = () => {
    const messageList = document.querySelector('.message-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  };
  
  // 组件卸载时清理资源
  onUnmounted(() => {
    // 关闭所有连接
    connections.value.forEach(conn => {
      conn.close();
    });
    
    if (peer.value) {
      peer.value.destroy();
    }
    
    // 释放所有 blob URL
    messages.value.forEach(item => {
      if (item.type === 'file' && item.url) {
        URL.revokeObjectURL(item.url);
      }
    });
  });
  </script>
  
  <style scoped>
  .peer-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
  }
  
  .connection-controls {
    margin: 15px 0;
    display: flex;
    gap: 10px;
  }
  
  .connection-controls input {
    flex: 1;
    padding: 8px;
  }
  
  button {
    padding: 8px 16px;
    cursor: pointer;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
  }
  
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .connected-peers {
    margin: 15px 0;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 4px;
  }
  
  .peer-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
  
  .peer-tag {
    background: #e3f2fd;
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9em;
  }
  
  .close-btn {
    padding: 0 4px;
    background: transparent;
    color: #777;
    font-size: 12px;
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .close-btn:hover {
    background: #ffeeee;
    color: #dc3545;
  }
  
  .message-area {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  
  .message-list {
    height: 400px;
    overflow-y: auto;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #f5f5f5;
    border-radius: 4px;
  }
  
  .message-item {
    margin: 8px 0;
    padding: 6px 10px;
    border-radius: 4px;
    max-width: 80%;
  }
  
  .text-message {
    margin: 0;
  }
  
  .file-message {
    padding: 8px 10px;
  }
  
  .file-link {
    color: #2196f3;
    text-decoration: none;
    word-break: break-all;
  }
  
  .file-link:hover {
    text-decoration: underline;
  }
  
  .system-message {
    margin: 0;
    color: #666;
    font-style: italic;
    text-align: center;
    font-size: 0.9em;
  }
  
  .self {
    background: #e3f2fd;
    color: #0d47a1;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .remote {
    background: #f1f8e9;
    color: #388e3c;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .input-area {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    align-items: center;
  }
  
  .input-area input {
    flex: 1;
    padding: 8px;
  }
  
  .file-upload {
    margin-left: auto;
  }
  
  .file-label {
    display: inline-block;
    padding: 8px 16px;
    background: #2196f3;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
  }
  
  .file-label:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .file-label input {
    display: none;
  }
  
  .error-message {
    color: #dc3545;
    margin: 10px 0;
    padding: 8px;
    background: #f8d7da;
    border-radius: 4px;
  }
  </style>
```