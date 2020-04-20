const Aerospike = require('aerospike')

var db

async function insert(keyName, bins) {

    const meta = { ttl: -1 }

        const policy = new Aerospike.WritePolicy({
            exists: Aerospike.policy.exists.IGNORE,
            key: Aerospike.policy.key.DIGEST // Send only the digest value of the key
        })

    let key = new Aerospike.Key('test', 'input', keyName)  
    
    await db.put(key, bins, meta, policy)       
}

async function start() {

    try {
        console.log('connect...')
        db = await Aerospike.connect({
            'hosts': 'localhost:3000',
            'connTimeoutMs': 5000
        })
        console.log('connect : done')

        try {
            var index1 = {
                ns: 'test',
                set: 'input',
                bin: 'resourceId',
                index: 'idx_osm_input_resourceId',
                datatype: Aerospike.indexDataType.STRING
            }
            let job1 = await db.createIndex(index1)
            await job1.waitUntilDone()
    
    
            var index2 = {
                ns: 'test',
                set: 'input',
                bin: 'entityId',
                index: 'idx_osm_input_entityId',
                datatype: Aerospike.indexDataType.STRING
            }
            let job2 = await db.createIndex(index2)
            await job2.waitUntilDone()            
        } catch (error) {
            
        }

        let now = new Date()

        await insert('5e98612a9a72a30010ec0000',
            {           
                id: '5e98612a9a72a30010ec0000',
                resourceId: '5e98612a9a72a30010ec03f4', // could be a secondary index
                entityId: '5e9572de2b4aae0010433600', // could be a secondary index
    
                speed: { ts: now.getTime(), value: Math.floor(Math.random() * Math.floor(100)) },
                course: { ts: now.getTime(), value: Math.floor(Math.random() * Math.floor(100)) }               
            }
        )

        now = new Date()

        await insert('5e98612a9a72a30010ec0001',
            {           
                id: '5e98612a9a72a30010ec0001',
                resourceId: '5e98612a9a72a30010ec03f4', // could be a secondary index
                entityId: '5e9572de2b4aae0010433600', // could be a secondary index
    
                speed: { ts: now.getTime(), value: Math.floor(Math.random() * Math.floor(100)) },
                course: { ts: now.getTime(), value: Math.floor(Math.random() * Math.floor(100)) }               
            }
        )

        now = new Date()

        await insert('5e98612a9a72a30010ec0003',
            {           
                id: '5e98612a9a72a30010ec0003',
                resourceId: '5e98612a9a72a30010ec03bb', // could be a secondary index
                entityId: '5e9572de2b4aae0010433600', // could be a secondary index
    
                speed: { ts: now.getTime(), value: Math.floor(Math.random() * Math.floor(100)) },
                course: { ts: now.getTime(), value: Math.floor(Math.random() * Math.floor(100)) }               
            }
        )

        await insert('5e98612a9a72a30010ec0004',
            {           
                id: '5e98612a9a72a30010ec0004',
                resourceId: '5e98612a9a72a30010ec03bb', // could be a secondary index
                entityId: '5e9572de2b4aae0010433600', // could be a secondary index
    
                speed: { ts: now.getTime(), value: Math.floor(Math.random() * Math.floor(100)) },
                course: { ts: now.getTime(), value: Math.floor(Math.random() * Math.floor(100)) }               
            }
        )

        db.close()

    } catch (error) {
        console.error(error)
    }

}

start()