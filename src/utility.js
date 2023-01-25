import { JUMP_KEYS, KICK_KEYS, MOVEMENT_KEYS_CODE } from "./constants";

export const loadImage = async (url) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = url;
    image.addEventListener("load", () => resolve(image));
  });
};

export const padZero = (value, padCount = 3) =>
  value.toString().padStart(padCount, "0");

export const isMovementKey = (code) => MOVEMENT_KEYS_CODE.includes(code);

export const isJumpKey = (code) => JUMP_KEYS.includes(code);

export const isKickKey = (code) => KICK_KEYS.includes(code);

export const isAllowedKey = (code) =>
  isMovementKey(code) || isJumpKey(code) || isKickKey(code);

export const mapValue = (value, originalMin, originalMax, newMin, newMax) => {
  const originalRange = originalMax - originalMin;
  const newRange = newMax - newMin;
  return ((value - originalMin) / originalRange) * newRange + newMin;
};

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const isCollide = (objectA, objectB) =>
  objectA.x + objectA.width >= objectB.x &&
  objectA.x <= objectB.x + objectB.width &&
  objectA.y + objectA.height >= objectB.y &&
  objectA.y <= objectB.y + objectB.height;

export const collidedSide = (objectA, objectB) => {
  const delta = {
    x: objectA.x + objectA.width / 2 - (objectB.x + objectB.width / 2),
    y: objectA.y + objectA.height / 2 - (objectB.y + objectB.height / 2),
  };

  const minDistance = {
    x: objectA.width / 2 + objectB.width / 2,
    y: objectA.height / 2 + objectB.height / 2,
  };

  // const depth = {
  //   x: Math.abs(delta.x) - Math.abs(minDistance.x),
  //   y: Math.abs(delta.y) - Math.abs(minDistance.y),
  // };

  const depth = {
    x: delta.x > 0 ? minDistance.x - delta.x : -minDistance.x - delta.x,
    y: delta.y > 0 ? minDistance.y - delta.y : -minDistance.y - delta.y,
  };

  if (depth.x || depth.y) {
    // if (Math.abs(depth.x) > Math.abs(depth.y)) {
    if (Math.abs(depth.x) < Math.abs(depth.y)) {
      return delta.x > 0 ? "left" : "right";
    } else {
      return delta.y > 0 ? "top" : "bottom";
    }
  }
};
