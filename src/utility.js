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
