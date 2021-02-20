import { get, set } from "../storage/idb";
const KEY = "__emoji___cache";

/** @returns {Promise<Array<{
    emoji: string;
    description: string;
    category: string;
    tags: string[];
    }>> */
export function loadEmojis() {
  return get(KEY).then((data) => {
    if (data != null) {
      return data;
    }
    return import("../data/emoji.json").then(({ default: emojis }) => {
      set(KEY, emojis);
      return emojis;
    });
  });
}

const cvs = document.createElement("canvas");
const ctx = cvs.getContext("2d");
const backingStoreRatio =
  ctx.webkitBackingStorePixelRatio ||
  ctx.mozBackingStorePixelRatio ||
  ctx.msBackingStorePixelRatio ||
  ctx.oBackingStorePixelRatio ||
  ctx.backingStorePixelRatio ||
  1;
const offset = 12 * backingStoreRatio;
ctx.fillStyle = "#f00";
ctx.textBaseline = "top";
ctx.font = "32px Arial";
const w = cvs.width;
const h = cvs.height;
export function supportsEmoji(e) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillText(e, 0, 0);
  return ctx.getImageData(offset, offset, 1, 1).data[0] !== 0;
}
