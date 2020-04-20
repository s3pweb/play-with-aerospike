const Aerospike = require('aerospike')

async function start() {
 
    console.log('connect...')
    let db = await Aerospike.connect({
        'hosts': 'localhost:3000',
        'connTimeoutMs': 5000,
        modlua: {
            systemPath: '/opt/aerospike/udf/sys/',
            userPath: './udf'
          }
    })
    console.log('connect : done')    

   await db.udfRegister('udf/count.lua')
   await db.udfRegister('udf/max-speed.lua')
   await db.udfRegister('udf/min-course.lua')

    db.close()
    
}

start()