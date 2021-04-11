const fetch = require("node-fetch")

const content = require("../models/contentModel");

exports.userContent = async (req, res) => {
  try {
    var kratooId = req.params.kratooId;
    var allContent = await content.findOne({ _id: kratooId}).exec();
    var titleGEO = encodeURI(allContent._source.title);
    const geoAPI = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${titleGEO}&key=AIzaSyBRf1raR6GSo52k1zY7DwJITCreRkvO_Wk`)
    const geoResult = await geoAPI.json();
  
    var descArray = "";
    var typeContent = "";

    if (allContent._source.desc_full) {
      descArray += "<br />\n" + allContent._source.desc_full;
    } else {
      descArray += "<br />\n" + allContent._source.desc;
    }
    allContent._source.comments.forEach((comment) => {
      if (comment.uid == allContent._source.uid) {
        descArray += "<br />\n" + comment.desc;
      }
    });
    // Check content type
    if (allContent._source.tags.filter(value => ["เที่ยวไทย", "สถานที่ท่องเที่ยวในประเทศ", "สถานที่ท่องเที่ยวกรุงเทพฯ", "ประเทศไทย"].includes(value)).length > 0){
      typeContent = "attraction"
    }
    else if (allContent._source.tags.filter(value => ["คาเฟ่ (Cafe)" , "ร้านกาแฟ", "ร้านอาหาร"].includes(value)).length > 0){
      typeContent = "cafe"
    }
    else if (allContent._source.tags.filter(value => ["ร้านอาหาร", "อาหาร", "อาหารคาว"].includes(value)).length > 0){
      typeContent = "restaurant"
    }
    
    var userContent = {
      kratooID: allContent._id,
      kratooTitle: allContent._source.title,
      kratooDesc: descArray,
      type: typeContent,
      position: geoResult.results[0].geometry.location,
      nickname: allContent._source.nickname,
      created_time: allContent._source.created_time,
    };
    return res.status(200).json(userContent);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};