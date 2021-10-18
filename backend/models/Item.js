const mongoose = require("mongoose");
const Types = mongoose.Schema.Types;

const itemSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["cabinet", "document", "card"],
    },
    owner: { type: Types.ObjectId, ref: "User", required: true },
    path: {
      type: String,
    },
    content: { type: String },
    files: [
      {
        originalName: { type: String },
        fileName: { type: String }, // 1633269573153.png / {timestamp}.ext
      },
    ],
    tags: [{ type: String }],
    contributors: [{ type: Types.ObjectId, ref: "User" }],
    accessGroups: {
      read: [{ type: Types.ObjectId, ref: "Group" }],
      edit: [{ type: Types.ObjectId, ref: "Group" }],
    },
    history: [{ type: Types.ObjectId, ref: "Item" }],
    status: {
      type: String,
      enum: ["draft", "archived", "published", "deleted", "modified"],
      required: true,
    },
    inspection: {
      result: { type: String, enum: ["approve", "deny"] },
      by: { type: Types.ObjectId, ref: "User" },
      date: { type: Date },
    },
    comments: {
      type: [
        {
          content: { type: String, required: true },
          by: { type: Types.ObjectId, ref: "User", required: true },
          date: { type: Date },
          isEdited: { type: Boolean, default: false },
        },
      ],
    },
    created: { type: Date },
  },
  { versionKey: false }
);

function distinctObjectIdArray(arr) {
  /* Removing duplicate values */

  // ["61507eaab51b4983b5fb8f1a", "61507eaab51b4983b5fb8f1a"]
  let uniqueArr = arr.map((item) => item.toString());

  // ["61507eaab51b4983b5fb8f1a"]
  uniqueArr = [...new Set(uniqueArr)];

  // [ new ObjectId("61507eaab51b4983b5fb8f1a") ]
  uniqueArr = uniqueArr.map((item) => mongoose.Types.ObjectId(item));

  return uniqueArr;
}

itemSchema.pre("save", function (next) {
  let keys = ["contributors", "history"];
  for (let key of keys) {
    if (this[key]) this[key] = distinctObjectIdArray(this[key]);
  }

  this.tags = [...new Set(this.tags)];

  if (this.accessGroups?.read)
    this.accessGroups.read = distinctObjectIdArray(this.accessGroups.read);
  if (this.accessGroups?.edit)
    this.accessGroups.edit = distinctObjectIdArray(this.accessGroups.edit);

  // Path
  if (this.type === "cabinet") {
    this.path = `,${this._id},`;
  } else if (this.type === "document") {
    this.path = this.path + this._id + ",";
  } else if (this.type === "card") {
    this.path = this.path + this._id + ",";
  }

  next();
});

itemSchema.pre("findOneAndUpdate", function (next) {
  const data = this.getUpdate();

  let keys = ["contributors", "history"];
  for (let key of keys) {
    if (data[key]) data[key] = distinctObjectIdArray(data[key]);
  }

  data.tags = [...new Set(data.tags)];

  if (data.accessGroups?.read)
    data.accessGroups.read = distinctObjectIdArray(data.accessGroups.read);
  if (data.accessGroups?.edit)
    data.accessGroups.edit = distinctObjectIdArray(data.accessGroups.edit);

  this.update({}, data);

  next();
});

itemSchema.statics.create = async function (payload) {
  payload.created = new Date();
  const item = new this(payload);

  return item.save();
};

module.exports = mongoose.model("Item", itemSchema);
