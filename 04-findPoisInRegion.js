const Aerospike = require('aerospike')

async function start() {

    console.log('connect...')
    let db = await Aerospike.connect({
        'hosts': 'localhost:3000',
        'connTimeoutMs': 5000
    })
    console.log('connect : done')

    var scan = db.scan('test', 'poi')
    scan.concurrent = true
    scan.nobins = false

    // https://geoman.io/geojson-editor
    var region = {
        "type": "Polygon",
        "coordinates": [
            [
                [-4.725467, 48.3348],
                [-4.71135, 48.335855],
                [-4.703541, 48.337453],
                [-4.701868, 48.341789],
                [-4.704013, 48.344385],
                [-4.705815, 48.347037],
                [-4.700881, 48.350574],
                [-4.717315, 48.350916],
                [-4.725467, 48.3348]
            ]
        ]
    }

    var query = db.query('test', 'poi')
    query.where(
        Aerospike.filter.geoWithinGeoJSONRegion('position', region)
    )

    var stream = query.foreach()

    stream.on('data', function (record) {
        console.log(record)
    })
    stream.on('error', function (error) {
        console.error('Error while scanning: %s [%d]', error.message, error.code)
    })
    stream.on('end', function () {
        
        db.close()
    })

    

}

start()