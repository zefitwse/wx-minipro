// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (e, context) => {
  const _ = cloud.database().command
  // e里面有trainNum  date zhan    jideng
  await cloud.database().collection("trainList").where({
    // trainNum:e.trainNum,
    trainNum: "G2575",
    // date:e.date,
  }).update({
    data: {
      // bitzhan:与运算
      numzhan: _.bit({
        // and:e.zhan, and后面是数字类型
        and: parseInt(e.zhan)
      })
    }
  })


  // 如果是特等
  if(e.jideng=="特"){
  await cloud.database().collection("trainList").where({
      // trainNum: "G2575",
      trainNum:e.trainNum,
      date:e.date,
      numzhan: _.neq(10)
    })
    .update({
      data: {
        seat0: _.inc(+1)
      }
    })
//给与运算后的数据还原
 await cloud.database().collection("trainList").where({
        trainNum:e.trainNum,
        // trainNum: "G2575",
        date:e.date,
        // zhan: a.data[i].zhan
        zhan:"111"
       
      })
      .update({
        data:{
        numzhan: 111
      },
      })

      await cloud.database().collection("trainList").where({
        trainNum:e.trainNum,
        // trainNum: "G2575",
        date:e.date,
        // zhan: a.data[i].zhan
        zhan:"110"
       
      })
      .update({
        data:{
        numzhan: 110
      },
      }) 
      await cloud.database().collection("trainList").where({
        trainNum:e.trainNum,
        // trainNum: "G2575",
        date:e.date,
        // zhan: a.data[i].zhan
        zhan:"011"
       
      })
      .update({
        data:{
        numzhan: 11
      },
      })

  }

  if (e.jideng == "1") {
    await cloud.database().collection("trainList").where({
      trainNum:e.trainNum,
      date:e.date,
      numzhan: _.neq(10)
    }).update({
      data: {
        seat1: _.inc(+1)
      }
    })
    await cloud.database().collection("trainList").where({
      trainNum:e.trainNum,
      // trainNum: "G2575",
      date:e.date,
      // zhan: a.data[i].zhan
      zhan:"111"
     
    })
    .update({
      data:{
      numzhan: 111
    },
    })

    await cloud.database().collection("trainList").where({
      trainNum:e.trainNum,
      // trainNum: "G2575",
      date:e.date,
      // zhan: a.data[i].zhan
      zhan:"110"
     
    })
    .update({
      data:{
      numzhan: 110
    },
    }) 
    await cloud.database().collection("trainList").where({
      trainNum:e.trainNum,
      // trainNum: "G2575",
      date:e.date,
      // zhan: a.data[i].zhan
      zhan:"011"
     
    })
    .update({
      data:{
      numzhan: 11
    },
    })
  }
  if (e.jideng == "2") {
    await cloud.database().collection("trainList").where({
      trainNum:e.trainNum,
      date:e.date,
      numzhan: _.neq(10)
    }).update({
      data: {
        seat2: _.inc(+1)
      }
    })
    await cloud.database().collection("trainList").where({
      trainNum:e.trainNum,
      // trainNum: "G2575",
      date:e.date,
      // zhan: a.data[i].zhan
      zhan:"111"
     
    })
    .update({
      data:{
      numzhan: 111
    },
    })

    await cloud.database().collection("trainList").where({
      trainNum:e.trainNum,
      // trainNum: "G2575",
      date:e.date,
      // zhan: a.data[i].zhan
      zhan:"110"
     
    })
    .update({
      data:{
      numzhan: 110
    },
    }) 
    await cloud.database().collection("trainList").where({
      trainNum:e.trainNum,
      // trainNum: "G2575",
      date:e.date,
      // zhan: a.data[i].zhan
      zhan:"011"
     
    })
    .update({
      data:{
      numzhan: 11
    },
    })

  }
  return {
  }
}