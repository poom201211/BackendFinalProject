require("dotenv").config();
const fetch = require("node-fetch");
const content = require("../models/contentModel");
const pin = require("../models/pinModel");
var key = process.env.KEY;

exports.userContent = async (req, res) => {
  try {
    var kratooId = req.params.kratooId;
    var allContent = await content.findOne({ _id: kratooId }).exec();
    var titleGEO = encodeURI(allContent._source.title);
    const geoAPI = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${titleGEO}&key=${key}`
    );
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
    if (
      allContent._source.tags.filter((value) =>
        ["ร้านอาหาร", "อาหาร", "อาหารคาว"].includes(value)
      ).length > 0
    ) {
      typeContent = "restaurant";
    } else if (
      allContent._source.tags.filter((value) =>
        ["คาเฟ่ (Cafe)", "ร้านกาแฟ"].includes(value)
      ).length > 0
    ) {
      typeContent = "cafe";
    } else if (
      allContent._source.tags.filter((value) =>
        [
          "เที่ยวไทย",
          "สถานที่ท่องเที่ยวในประเทศ",
          "สถานที่ท่องเที่ยวกรุงเทพฯ",
          "ประเทศไทย",
        ].includes(value)
      ).length > 0
    ) {
      typeContent = "attraction";
    }

    var userContent = {
      kratooID: Number(allContent._id),
      kratooTitle: allContent._source.title,
      kratooDesc: descArray,
      type: typeContent,
      postion: geoResult.results[0].geometry.location,
      nickname: allContent._source.nickname,
      created_time: allContent._source.created_time,
      emotion: allContent._source.emotion,
    };
    return res.status(200).json(userContent);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};

exports.convertContentToPin = async (req, res) => {
  try {
    var count = 0;
    var allContent = await content.find();
    var resultPin = [];
    for (const content of allContent) {
      var titleGEO = encodeURI(content._source.title);
      const geoAPI = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${titleGEO}&key=${key}`
      );
      const geoResult = await geoAPI.json();
      var descArray = "";
      var typeContent = "";

      if (content._source.desc_full) {
        descArray += "<br />\n" + content._source.desc_full;
      } else {
        descArray += "<br />\n" + content._source.desc;
      }
      content._source.comments.forEach((comment) => {
        if (comment.uid == content._source.uid) {
          descArray += "<br />\n" + comment.desc;
        }
      });
      // Check content type
      if (
        content._source.tags.filter((value) =>
          ["ร้านอาหาร", "อาหาร", "อาหารคาว"].includes(value)
        ).length > 0
      ) {
        typeContent = "restaurant";
      } else if (
        content._source.tags.filter((value) =>
          ["คาเฟ่ (Cafe)", "ร้านกาแฟ"].includes(value)
        ).length > 0
      ) {
        typeContent = "cafe";
      } else if (
        content._source.tags.filter((value) =>
          [
            "เที่ยวไทย",
            "สถานที่ท่องเที่ยวในประเทศ",
            "สถานที่ท่องเที่ยวกรุงเทพฯ",
            "ประเทศไทย",
          ].includes(value)
        ).length > 0
      ) {
        typeContent = "attraction";
      }

      var pinContent = {
        kratooID: Number(content._id),
        kratooTitle: content._source.title,
        kratooDesc: descArray,
        type: typeContent,
        postions:
          geoResult.status == "OK"
            ? geoResult.results[0].geometry.location
            : null,
        nickname: content._source.nickname,
        created_time: content._source.created_time,
        emotion: content._source.emotion,
      };
      var storePin = {
        updateOne: {
          filter: { kratooID: pinContent.kratooID },
          update: pinContent,
          upsert: true,
        },
      };
      resultPin.push(storePin);
      count+=1
      console.log(count);
    }
    console.log(resultPin);
    pin.bulkWrite(resultPin);

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};
