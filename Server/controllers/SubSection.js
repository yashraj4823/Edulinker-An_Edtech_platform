const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

//create subsection
exports.createSubSection = async (req, res) => {
    try{
        //fetch data from req body
        const {sectionId, title, description} = req.body;

        //extract file/video
        const video = req.files.video;

        //validation
        if(!sectionId || !title || !description || !video){
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }
        console.log(video)

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        //create a subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        
        //update section with this subsection objectID
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:subSectionDetails._id,
            }
        },{new:true})
        .populate("subSection");

        //return response
        return res.status(200).json({
            success: true,
            message: "Subsection Created Successfully",
            data:updatedSection,
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

exports.updateSubSection = async (req, res) => {
    try{
        //data fetch
        const {title, description, subSectionId, sectionId} = req.body;


        //update data
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
              success: false,
              message: "SubSection not found",
            })
          }
      
          if (title !== undefined) {
            subSection.title = title
          }
      
          if (description !== undefined) {
            subSection.description = description
          }
          if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
              video,
              process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
          }
      
          await subSection.save()
      
          // find updated section and return it
          const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
          )
      
          console.log("updated section", updatedSection)

        //return response
        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            updatedSection,
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to update Sub Section, try again",
            error:error.message,
        });
    }
}

exports.deleteSubSection = async (req, res) => {
    try{
        //get ID - assuming that we are sedning ID in params
        const {subSectionId, sectionId} = req.body;

        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subSectionId,
              },
            }
          )

          const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

          if (!subSection) {
            return res
              .status(404)
              .json({ success: false, message: "SubSection not found" })
          }
      
          // find updated section and return it
          const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
          )

        //return
        return res.status(200).json({
            success: true,
            message: "Section Deleted successfully",
            updatedSection,
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to update section, try again",
            error:error.message,
        });
    }
}