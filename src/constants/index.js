export const COUNTRIES = {
  brazil: { name: "Brazil", code: "01" },
  england: { name: "England", code: "02" },
  spain: { name: "Spain", code: "03" },
  japan: { name: "Japan", code: "04" },
  netherlands: { name: "Netherlands", code: "05" },
  portugal: { name: "Portugal", code: "06" },
  germany: { name: "Germany", code: "07" },
  italy: { name: "Italy", code: "08" },
};

export const CHARACTER_STATES = {
  falling_down: "Falling Down",
  idle: "Idle",
  jump: "Jump",
  kick: "Kick",
  move_backward: "Move Backward",
  move_forward: "Move Forward",
};

export const CHARACTER_STATE_FRAME_MAP = {
  [CHARACTER_STATES.falling_down]: 5,
  [CHARACTER_STATES.idle]: 18,
  [CHARACTER_STATES.jump]: 5,
  [CHARACTER_STATES.kick]: 9,
  [CHARACTER_STATES.move_backward]: 10,
  [CHARACTER_STATES.move_forward]: 10,
};

export const BACKGROUND_TYPES = {
  out_door: "background1",
  stadium: "background2",
};

export const BALL_TYPES = {
  general: "Ball 01",
  special: "Ball 02",
};

export const MOVEMENT_KEYS_CODE = ["KeyA", "KeyD"];
export const JUMP_KEYS = ["KeyW"];
export const KICK_KEYS = ["Space"];

export const MOVEMENT_DIRECTION_MAP = {
  KeyA: -1,
  KeyD: 1,
};

export const GAME_LEVEL = ["easy", "medium", "hard"];
export const GAME_DURATION = {
  easy: 30,
  medium: 20,
  hard: 15,
};
