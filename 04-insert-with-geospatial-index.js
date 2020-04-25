const Aerospike = require('aerospike')

var db

async function insert(keyName, bins) {

    const meta = { ttl: -1 }

        const policy = new Aerospike.WritePolicy({
            exists: Aerospike.policy.exists.IGNORE,
            key: Aerospike.policy.key.DIGEST // Send only the digest value of the key
        })

    let key = new Aerospike.Key('test', 'poi', keyName)  
    
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
                set: 'poi',
                bin: 'position',
                index: 'idx_test_poi_position',
                datatype: Aerospike.indexDataType.GEO2DSPHERE
            }
            let job1 = await db.createIndex(index1)
            await job1.waitUntilDone()
              
        } catch (error) {
            
        }

        await insert('5e98612a9a72a30010aa0000',
            {           
                id: '5e98612a9a72a30010aa0000',
                position: new Aerospike.GeoJSON.Point(-3.712423, 47.1),
                comment: 'poi 1'                
            }
        )
        await insert('5e98612a9a72a30010aa0001',
            {           
                id: '5e98612a9a72a30010aa0001',
                position: new Aerospike.GeoJSON.Point(-4.712423, 48.342388),
                comment: 'poi 2'                
            }
        )

        

        db.close()

    } catch (error) {
        console.error(error)
    }

}

start()