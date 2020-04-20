const Aerospike = require('aerospike')

async function start() {
    
    console.log('connect...')
    let db = await Aerospike.connect({
        'hosts': 'localhost:3000',
        'connTimeoutMs': 5000
    })
    console.log('connect : done')    

    let key = new Aerospike.Key('test', 'input', '5e986128435ad3fafbeb88dc')

    console.log('delete...')
    
    await db.remove(key)
    console.log('delete : done')

    db.close()
    
}

start()