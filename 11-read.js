const Aerospike = require('aerospike')

async function start() {
    
    console.log('connect...')
    let db = await Aerospike.connect({
        'hosts': '127.0.0.1:3000',
        'connTimeoutMs': 5000
    })
    console.log('connect : done')    

    let key = new Aerospike.Key('hybrid', 'input', '5e986128435ad3fafbeb88dc')

    console.log('connect...')
    
    let bins = await db.get(key)
    console.log('get',bins)

    db.close()
    
}

start()