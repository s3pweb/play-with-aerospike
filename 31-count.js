const Aerospike = require('aerospike')
const predexp = Aerospike.predexp

async function start() {
    
    console.log('connect...')
    let db = await Aerospike.connect({
        'hosts': '127.0.0.1:3000',
        'connTimeoutMs': 5000,
        modlua: {
            systemPath: '/opt/aerospike/usr/udf/lua',
            userPath: './udf'
          }
    })
    console.log('connect : done')    

    // <!> Need to create secondary index first with 02-insert-with-secondary-index.js <!>

    var query = db.query('test', 'input')
    query.where(
        Aerospike.filter.equal('resourceId', '5e98612a9a72a30010ec03f4')
    )

   let count = await query.apply('count','count') 

   console.log('count ='+count)   
   
   db.close()
    
}

start()