import ws from 'ws';

const wss = new ws.Server({ port: 8080 }, () => {
  console.log('socket service started on port 8080');
});

const state = {
  HEART: 1,
  MESSAGE: 2,
};

wss.on('connection', (socket) => {
  console.log('client connected');
  socket.on('message', (e) => {
    // 广播消息
    wss.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          type: state.MESSAGE,
          message: '我是服务端发送给客户端的消息' + e.toString(),
        })
      );
    });
  });
  // socket长时间不使用，网络波动 弱网模式
  // 心跳检测 进行保活 保持连接
  let heartInterval: any = null;
  const heartCheck = () => {
    // 等于open 才会发送心跳
    if (socket.readyState === ws.OPEN) {
      socket.send(
        JSON.stringify({
          type: state.HEART,
          message: '心跳检测',
        })
      );
    } else {
      // 否则就是关闭状态
      clearInterval(heartInterval);
    }
  };
  heartInterval = setInterval(heartCheck, 5000);
});
