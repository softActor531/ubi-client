import ShareDb from 'sharedb';

const share = new ShareDb({
  db: new ShareDb.MemoryDB(),
});

share.use('receive', function(req, next){
  var data = req.data || {};
  switch(data.a){
    case 'heartbeat': break;
    default: next(); break;
 }
});

const connection = share.connect();

export const createDoc = (roomName: string, callback?) => {
  // const connection = share.connect();
  const doc = connection.get(roomName, 'textarea');
  doc.on('create', (src) => {
    console.log(`New doc created for room: ${roomName}`)
  });

  doc.fetch((err) => {
    if (err) {
      console.log('Something went wrong!')
      throw err;
    }
    if (doc.type === null) {
      // doc.create({content: ''}, callback);
      doc.create('', callback);
      return;
    }
    if (callback){
      callback();
    }
  });
}

export { connection }

export default share;
