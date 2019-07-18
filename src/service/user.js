import mongoose, { Schema } from "mongoose"

const schema = new Schema({
    login: String,
    ghid: Number,
    node_id: String,
    avatar_url: String,
    type: String
});

export default mongoose.model("users", schema);