const Item = require("../models/Item.js");
const { RuntimeError } = require("./errors/RuntimeError.js");

const LIMIT = 20;

module.exports = {
  search: async (query = {}, limit = true) => {
    try {
      const projection = {
        title: true,
        path: true,
        type: true,
        owner: true,
        tags: true,
        history: true,
        status: true,
        inspection: true,
        created: true,
      };

      if (query.group) {
        query["accessGroups.read"] = { $eq: query.group };
        delete query.group;
      }

      if (query.tag) {
        query.tags = { $eq: query.tag };
        delete query.tag;
      }

      if (query.title) {
        query.title = new RegExp(`${query.title}`);
      }

      if (query.path) {
        query.path = new RegExp(`${query.path}`);
      }

      // Exclude deleted or modified items
      query.status = {
        $nin: ["deleted", "modified"],
      };

      let query_ = limit ? Item.find(query, projection) : Item.find(query);

      query_.sort("created");

      query_.populate({
        path: "owner",
        select: ["rank", "name"],
      });

      if (limit) query_.skip(query_.page * LIMIT).limit(LIMIT);

      return await query_.exec();
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },

  read: async (_id, options = { populate: true }) => {
    try {
      let query = Item.findOne({ _id });

      if (options.populate) {
        query.populate([
          {
            path: "accessGroups.read",
            select: ["name", "path"],
          },
          {
            path: "accessGroups.edit",
            select: ["name", "path"],
          },
          {
            path: "owner",
            select: ["rank", "name"],
          },
        ]);
      }

      return await query.exec();
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },

  create: async (payload) => {
    try {
      const result = await Item.create(payload);
      return result;
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },

  update: async (item, payload) => {
    try {
      // Create previous item
      previous_item = item.toObject();
      previous_item = Object.assign(previous_item, { status: "modified" });
      delete previous_item._id;
      previous_item = await Item.create(previous_item);

      // Append history
      payload.history = [...item.history, previous_item._id];

      // Clear inspection
      payload.inspection = {};

      delete payload._id;

      // Update item
      const result = await Item.findOneAndUpdate({ _id: item._id }, payload);
      return result;
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },

  delete: async (_id) => {
    try {
      return Item.findOneAndDelete({ _id });
    } catch (err) {
      throw new RuntimeError(err.message);
    }
  },
};
