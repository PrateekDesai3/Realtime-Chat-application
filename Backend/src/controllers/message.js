import User from "../models/model.js";
import Message from "../models/messagemodel.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
export const getUsersForSidebar=async (req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("error in login", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages=async (req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({
            $or:[
                {SenderId:myId,receiverId:userToChatId},
                {SenderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("error in login", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id: receiverId}=req.params;
        const SenderId=req.user._id;
        let imageUrl;
        
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage= new Message({
            SenderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();


        const receiverSocketId=getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("error in login", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}