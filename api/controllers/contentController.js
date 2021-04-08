const content = require("../models/contentModel");

exports.userContent = async (req,res) => {
    try {
        // kratooTitle: Title of kratoo
        // kratooDesc: Connected description from same user
        var allContent = await content.findOne({_id: req.query._id}).exec();
        var descArray = []
        if(allContent._source.desc_full){
            descArray.push(allContent._source.desc_full);
        }else{
            descArray.push(allContent._source.desc);
        }
        allContent._source.comments.forEach(comment => {
            if(comment.uid == allContent._source.uid){
                descArray.push(comment.desc)
            }
        });
        var userContent = {kratooTitle: allContent._source.title, kratooDesc: descArray}
        return res.status(200).json(userContent);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Bruh" });
    }
}