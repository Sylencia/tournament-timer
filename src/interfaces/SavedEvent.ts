export interface ISavedEvent {
  showTimer: boolean;
  eventName: string;
  rounds: number;
  roundTime: number;
  hasDraft: boolean;
  draftTime: number;
  currentRound: number;
  timerLength: number;
  endTime: number;
  isRunning: boolean;
  timeRemaining: number;
}

export const defaultSavedEvent: ISavedEvent = {
  showTimer: false,
  eventName: "",
  rounds: 0,
  roundTime: 0,
  hasDraft: false,
  draftTime: 0,
  currentRound: 0,
  timerLength: 0,
  endTime: 0,
  isRunning: false,
  timeRemaining: 0,
};
