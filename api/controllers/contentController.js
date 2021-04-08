const content = require("../models/contentModel");

exports.userContent = async (req,res) => {
    try {
        // kratooTitle: Title of kratoo
        // kratooDesc: Connected description from same user
        var allContent = await content.findOne({_id: req.query._id}).exec();
        var descArray = ""
        if(allContent._source.desc_full){
            descArray += "<br />\n<br />" + (allContent._source.desc_full);
        }else{
            descArray += "<br />\n<br />" +  (allContent._source.desc);
        }
        allContent._source.comments.forEach(comment => {
            if(comment.uid == allContent._source.uid){
                descArray += "<br />\n<br />" + (comment.desc)
            }
        });
        var userContent = {kratooID: allContent._id,kratooTitle: allContent._source.title, kratooDesc: descArray, owner: allContent._source.nickname, created_time: allContent._source.created_time}
        return res.status(200).json(userContent);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error });
    }
}