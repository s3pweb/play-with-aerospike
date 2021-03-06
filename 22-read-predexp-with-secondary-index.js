const Aerospike = require('aerospike')
const predexp = Aerospike.predexp

async function start() {
    
    console.log('connect...')
    let db = await Aerospike.connect({
        'hosts': '127.0.0.1:3000',
        'connTimeoutMs': 5000
    })
    console.log('connect : done')    

    // <!> Need to create secondary index first with 02-insert-with-secondary-index.js <!>

    var query = db.query('test', 'input')
    query.where(
        [
            predexp.stringBin('resourceId'), // string, integer, geojson depends of the bin type
            predexp.stringValue('5e98612a9a72a30010ec03f4'), // string, integer, geojson depends of the bin type
            predexp.stringEqual(),
            predexp.stringBin('entityId'),
            predexp.stringValue('5e9572de2b4aae0010433600'),
            predexp.stringEqual(),
            predexp.and(2)
        ]
    )

// https://www.aerospike.com/docs/client/nodejs/usage/query/query.html
// These are the currently available filter predicates:

// equal — String/integer equality. The predicate matches records with a bin that matches the specified string or integer value.
// range — Integer range filter. The filter matches records with a bin value in the given integer range.
// contains — Filter for list/map membership. The filter matches records with a bin that has a list or map value that contains the given string or integer.
// geoWithinGeoJSONRegion — Geospatial filter that matches points within a given GeoJSON region.
// geoWithinRadius — Geospatial filter that matches points within a radius from a given point.
// geoContainsGeoJSONPoint — Geospatial filter that matches GeoJSON regions that contain a given point.
// geoContainsPoint — Geospatial filter that matches regions that contain a given lng/lat coordinate.

    var stream = query.foreach()

    stream.on('data', function (record) {
        console.log(record.bins)
        console.log('-------------------')
    })
    stream.on('error', function (error) {
        //handle error
        console.error(error)
    })
    stream.on('end', function () {
        //signal the end of query result
        console.log('done')
        db.close()

    })

    
    
}

start()