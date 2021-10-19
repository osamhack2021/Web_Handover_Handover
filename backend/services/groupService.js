const Group = require("../models/Group.js");
const { RuntimeError } = require("./errors/RuntimeError.js");

module.exports = {
  search: async (query = {}) => {
    const projection = { name: true, path: true };

    if (query.admin) {
      query.admins = { $eq: query.admin };
      delete query.admin;
    }

    // Partial Search with Name.
    if (query.name) {
      query.name = new RegExp(`${query.name}`);
    }

    // Partial Search with Path
    if (query.path) {
      query.path = new RegExp(`${query.path}`);
    }

    return await Group.find(query, projection);
  },

  read: async (query, projection = {}) => {
    try {
      let group = await Group.findOne(query, projection).populate([
        {
          path: "admins",
          select: ["rank", "name"],
        },
        {
          path: "inspectors",
          select: ["rank", "name"],
        },
      ]);

      let parentName = null;
      let pathGroups = [];

      for (const groupId of group.path.split(",").filter((e) => e !== "")) {
        // add following object to pathGroups property
        // {
        //   ...group,
        //   fullName: "parentName > currentName",
        // }
        let parentGroup = await Group.findOne({ _id: groupId });
        parentName =
          parentName != null
            ? parentName + " > " + parentGroup.name
            : parentGroup.name;

        pathGroups.push({ ...parentGroup._doc, fullName: parentName });
      }

      return { ...group._doc, pathGroups: pathGroups, fullName: parentName };
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },

  create: async (payload) => {
    try {
      return await Group.create(payload);
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },

  update: async (_id, payload) => {
    try {
      return await Group.findOneAndUpdate({ _id }, payload);
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },

  delete: async (_id) => {
    try {
      return await Group.findOneAndDelete({ _id });
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },
};
