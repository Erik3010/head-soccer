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

/**
 * Check collided side
 * @param {*} target Target to check which side is collided
 * @param {*} obstacle Obstacle that hit the target
 */
export const collidedSide = (target, obstacle) => {
  const delta = {
    x: target.x + target.width / 2 - (obstacle.x + obstacle.width / 2),
    y: target.y + target.height / 2 - (obstacle.y + obstacle.height / 2),
  };

  const minDistance = {
    x: target.width / 2 + obstacle.width / 2,
    y: target.height / 2 + obstacle.height / 2,
  };

  const depth = {
    x: delta.x > 0 ? minDistance.x - delta.x : -minDistance.x - delta.x,
    y: delta.y > 0 ? minDistance.y - delta.y : -minDistance.y - delta.y,
  };

  if (depth.x || depth.y) {
    if (Math.abs(depth.x) < Math.abs(depth.y)) {
      return delta.x > 0 ? "left" : "right";
    } else {
      return delta.y > 0 ? "top" : "bottom";
    }
  }
};

export const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const easeAnimation = (distance, currentFrame, step) => {
  currentFrame /= step / 2;

  if (currentFrame < 1) {
    return (distance / 2) * Math.pow(currentFrame, 3);
  }
  currentFrame -= 2;
  return (distance / 2) * (Math.pow(currentFrame, 3) + 2);
};

export const getSelectedRadioValue = (name) =>
  document.querySelector(`[name='${name}']:checked`)?.value ?? null;
