const Aerospike = require('aerospike')

async function start() {

    try {
        console.log('connect...')
        let db = await Aerospike.connect({
            'hosts': 'localhost:3000',
            'connTimeoutMs': 5000
        })
        console.log('connect : done')

        const meta = { ttl: -1 }

        // https://www.aerospike.com/apidocs/nodejs/module-aerospike_policy.html
        // Aerospike.policy.exists.xxxx
        // IGNORE : Write the record, regardless of existence. (I.e. create or update.)
        // CREATE : Create a record, ONLY if it doesn't exist.
        // UPDATE : Update a record, ONLY if it exists.
        // REPLACE : Completely replace a record, ONLY if it exists.
        // CREATE_OR_REPLACE : Completely replace a record if it exists, otherwise create it.

        const policy = new Aerospike.WritePolicy({
            exists: Aerospike.policy.exists.IGNORE,
            key: Aerospike.policy.key.SEND //If you want keys to be returned when scanning or querying, the keys must be stored on the server
        })

        let now = new Date()

        let bins = {           
            resourceId: '5e98612a9a72a30010ec03f4', // could be a secondary index
            entityId: '5e9572de2b4aae0010433600', // could be a secondary index

            description: 'BLABLABLA',
            speed: { ts: now.getTime(), value: 25 },
            course: { ts: now.getTime(), value: 200 },
            sensor: [1001, 1002, 1003],
            img: Buffer.from([0xa, 0xb, 0xc])
        }

        let key = new Aerospike.Key('test', 'input', '5e986128435ad3fafbeb88dc')

        console.log('put...')
        await db.put(key, bins, meta, policy)
        console.log('put : done')

        db.close()

    } catch (error) {
        console.error(error)
    }

}

start()