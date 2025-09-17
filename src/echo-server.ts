import * as net from "net";
//빈 TCP서버 하나 만들기 -> 아작 포트를 정하지 않음
let server = net.createServer();

//socket(선) net.Soket은 선이고 void는 return값 없음
function newConn(socket: net.Socket): void {
  console.log('new connection', socket.remoteAddress, socket.remotePort);

  socket.on('end', () => {
    console.log('EOF.');
  });

  socket.on('data', (data: Buffer) => {
    console.log('data:', data.toString()); // 사람이 읽을 수 있게 변환

    // actively close the connection if the data contains 'q'
    if (data.includes('q')) {
      console.log('closing.');
      socket.end();   // FIN 패킷을 보내고 연결 종료
      return;
    }

    // echo back
    socket.write(data);
  });
}
//새 연결이 생길 때마다 newConn을 부름(지금 호출하는게 아님)
//on은 매번 실행됨(한 번만 받고 싶으면 once)
server.on('connection', newConn);
server.on('error', (err: Error) => { throw err; });
//포트번호 정하기
server.listen({ host: '127.0.0.1', port: 12345 }, () => {
  //서버가 성공적으로 열렸을 때 실행되는 코드
  console.log('Server is listening on port 12345');
});