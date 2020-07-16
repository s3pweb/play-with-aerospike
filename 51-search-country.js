const Aerospike = require('aerospike')

async function start() {

    let namespace = "test"
    let set = "countries"
    let bin = "region"

    try {
        console.log('connect...')
        let db = await Aerospike.connect({
            'hosts': '127.0.0.1:3000',
            'connTimeoutMs': 5000
        })
        console.log('connect : done')

        console.log('scan...')

        let point = new Aerospike.GeoJSON({
            type: 'Point', coordinates: [
                9.9755859375,
                48.16608541901253
            ]
        })

        var query = db.query(namespace, set)

        query.where(
            Aerospike.filter.geoContainsGeoJSONPoint(bin, point)
        )

        query.select('name')

        var stream = query.foreach()

        stream.on('error', (error) => { throw error })
        stream.on('end', () => db.close())
        stream.on('data', (record) => {
            console.log(record)
        })

    } catch (error) {
        console.error(error)
    }

}

start()