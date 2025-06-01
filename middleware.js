const jsonServer = require("json-server");

module.exports = (req, res, next) => {
  if (req.method === "POST" && req.path.match(/^\/chunk\d+\/games$/)) {
    const db = req.app.db;
    const chunkId = req.path.split("/")[1];
    const chunk = db.get(chunkId).value();

    if (!chunk || !Array.isArray(chunk.games)) {
      return res.status(404).jsonp({ error: "Chunk or games array not found" });
    }

    const newEntry = req.body;
    newEntry.id = Date.now().toString();
    chunk.games.push(newEntry);

    db.set(chunkId, chunk).write();

    return res.status(201).jsonp(newEntry);
  }
  next();
};
