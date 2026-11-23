"use strict";
const crypto = require("node:crypto");
const engine = require("../../web/assets/observer-engine.v2.js");
const scene = require("./scene.json");
const core = require("./flow.js")(engine, scene);
function blobSha(text) {
  const bytes = Buffer.from(text, "utf8");
  return crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
}
function start({ metaText, storyText, raw = engine.BASELINE, log = [] }) {
  if (blobSha(metaText) !== scene.source.meta_blob_sha || blobSha(storyText) !== scene.source.story_tr_blob_sha)
    throw new Error("source_drift");
  return core.start(JSON.parse(metaText), raw, log);
}
module.exports = { ...core, start, blobSha };
