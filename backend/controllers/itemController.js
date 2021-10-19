const itemService = require("../services/itemService.js");
const userService = require("../services/userService.js");

const {
  BusinessError,
  NotFoundError,
  ForbiddenError,
} = require("../services/errors/BusinessError.js");

const algolia = require("../algolia/index");

module.exports = {
  // GET /item
  search: async (req, res) => {
    try {
      const keys = Object.keys(req.query);
      const valids = ["title", "path", "type", "owner", "group", "page", "tag"];

      // Only allowed fields are Searchable
      for (let key of keys) {
        if (!valids.includes(key))
          throw new BusinessError(
            `Query invalid: ${key}로는 검색할 수 없습니다!`
          );
      }

      const result = await itemService.search(req.query, false);

      res.status(200).send(result);
    } catch (err) {
      res.status(err.status || 500).send(err.message);
    }
  },

  // GET /item/algolia
  algoliaSearch: async (req, res) => {
    try {
      const query = req.params.query;

      const result = await algolia.search(query, {
        // filters: `NOT status:"modified" AND accessGroups.read:"${res.locals.group.toString()}"`
        filters: `NOT status:"modified"`
      });

      res.status(200).send(result.hits);
    } catch (err) {
      res.status(err.status || 500).send(err.message);
    }
  },

  // GET /item/:item_id
  read: async (req, res) => {
    try {
      const item_id = req.params.item_id;

      const item = await itemService.read({ _id: item_id });

      if (item === null)
        throw new NotFoundError(`Item not found: 존재하지 않는 항목입니다.`);

      // Check session's read authority
      const user = await userService.findOne({
        serviceNumber: res.locals.serviceNumber,
      });
      if (
        !item.accessGroups.read.some((i) => i.equals(user.group)) &&
        item.owner._id.toString() !== res.locals._id.toString()
      )
        throw new ForbiddenError(`Access denied: 열람 권한이 없습니다.`);

      res.status(200).send(item);
    } catch (err) {
      res.status(err.status || 500).send(err.message);
    }
  },

  // POST /item
  create: async (req, res) => {
    try {
      let body = req.body;
      body.owner = res.locals._id;

      console.log(body);

      // Add accessGroups if body.accessGroups is undefined
      if (!body.accessGroups) {
        body.accessGroups = {
          read: [res.locals.group],
          edit: [res.locals.group],
        };
      } else {
        if (!body.accessGroups.read || body.accessGroups.read.length < 1) {
          body.accessGroups.read = [res.locals.group];
        }
        if (!body.accessGroups.edit || body.accessGroups.edit.length < 1) {
          body.accessGroups.edit = [res.locals.group];
        }
      }

      const result = await itemService.create(body);

      // Add object to Algolia
      let object = result.toObject();
      object.objectID = object._id;
      delete object._id;

      algolia.saveObject(object);

      res.status(201).send(result);
    } catch (err) {
      console.log(err);
      res.status(err.status || 500).send(err.message);
    }
  },

  // PUT /item/:item_id
  update: async (req, res) => {
    try {
      const item_id = req.params.item_id;

      let item = await itemService.read({ _id: item_id }, { populate: false });

      if (item === null)
        throw new NotFoundError(`Item not Found: 존재하지 않는 항목입니다.`);

      // Check session's edit authority
      if (
        !item.accessGroups.edit.some((i) => i.equals(res.locals.group)) &&
        item.owner._id.toString() !== res.locals._id.toString()
      )
        throw new ForbiddenError(`Access denied: 수정 권한이 없습니다.`);

      // Append Contributor
      item = Object.assign(item, {
        contributors: [...item.contributors, res.locals._id],
      });

      const result = await itemService.update(item, req.body);

      // Update object to Algolia
      let object = result.toObject();
      object.objectID = object._id;
      delete object._id;

      res.status(201).send(result);
    } catch (err) {
      res.status(err.status || 500).send(err.message);
    }
  },

  // DELETE /item/:item_id
  delete: async (req, res) => {
    try {
      const item_id = req.params.item_id;

      let item = await itemService.read({ _id: item_id }, { populate: false });

      if (item === null)
        throw new NotFoundError(`Item not Found: 존재하지 않는 항목입니다.`);

      // Check session's delete authority
      if (item.owner._id !== res.locals._id)
        throw new ForbiddenError(`Access denied: 삭제 권한이 없습니다.`);

      // Algolia
      await algolia.deleteObject(item_id);

      // Delete item
      let promises = [itemService.delete(item_id)];

      // Removing all items
      for (let historyItem of item.history) {
        promises.push(itemService.delete(historyItem));
      }
      await Promise.all(promises);

      res.status(204).send();
    } catch (err) {
      res.status(err.status || 500).send(err.message);
    }
  },
};
