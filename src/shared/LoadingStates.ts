export type NotYetLoaded = "NotYetLoaded";
export const NotYetLoaded: NotYetLoaded = "NotYetLoaded";

export type StillLoading = "StillLoading";
export const StillLoading: StillLoading = "StillLoading";

export type LoadingError = "LoadingError";
export const LoadingError: LoadingError = "LoadingError";

export type FinishedLoading = "FinishedLoading";
export const FinishedLoading: FinishedLoading = "FinishedLoading";

export type LoadingState =
  | NotYetLoaded
  | StillLoading
  | LoadingError
  | FinishedLoading;

export const LoadingStates: { [key in LoadingState]: LoadingState } = {
  StillLoading,
  LoadingError,
  NotYetLoaded,
  FinishedLoading,
};
