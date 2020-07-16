const fs = require('fs')
const Aerospike = require('aerospike');

//const turf = require('@turf/turf')

// const areaToRetain = {
//     "type": "Polygon",
//     "coordinates": [
//         [
//             [-14.0625, 25.958045],
//             [48.515625, 25.958045],
//             [48.515625, 72.971189],
//             [-14.0625, 72.971189],
//             [-14.0625, 25.958045]
//         ]
//     ]
// }

var db

async function insert(keyName, bins, namespace, set) {

    const meta = { ttl: -1 }

    const policy = new Aerospike.WritePolicy({
        exists: Aerospike.policy.exists.IGNORE,
        key: Aerospike.policy.key.DIGEST // Send only the digest value of the key
    })

    let key = new Aerospike.Key(namespace, set, keyName)

    await db.put(key, bins, meta, policy)

    process.stdout.write('.')
}

async function start() {

    let file = 'countries.geojson'
    let countries = JSON.parse(fs.readFileSync(file)).features

    let i = 1

    let namespace = "test"
    let set = "countries"
    let bin = "region"
    let idx = "idx_" + namespace + "_" + set + "_" + bin


    try {
        console.log('connect...')
        db = await Aerospike.connect({
            'hosts': '127.0.0.1:3000',
            'connTimeoutMs': 5000
        })
        console.log('connect : done')

        try {
            var index = {
                ns: namespace,  // db
                set: set,       // table
                bin: bin,       // field
                index: idx,
                datatype: Aerospike.indexDataType.GEO2DSPHERE
            }
            let job = await db.createIndex(index)
            await job.waitUntilDone()

        } catch (error) { }

        for (let country of countries) {
            let regions = country.geometry.coordinates

            for (let region of regions) {

                let area = { type: 'Polygon', coordinates: region }
                let name = country.properties.ADMIN

                let contain = true //turf.booleanContains(areaToRetain,area)

                if(contain)
                {
                    console.log(name, contain)

                    let data = {
                        name: name,
                        subname: name + i,
                        // https://www.aerospike.com/apidocs/nodejs/geojson.js.html
                        region: new Aerospike.GeoJSON(area),
                    }
    
                    await insert(name + i, data, namespace, set)
                }              

                i++
            }
            i = 1
        }
    } catch (error) {
        console.error(error)
    }

    db.close()

}

start()



