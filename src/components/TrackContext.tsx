import { createContext, useReducer, useContext, ReactNode, useRef, useEffect } from 'react';
import Genres from '../data/genres';

// Define action types
const SET_TRACK = 'SET_TRACK';
const START_PLAYING = 'START_PLAYING';
const PAUSE_PLAYING = 'PAUSE_PLAYING';

interface TrackState {
 trackIndex: number;
 currentTrack: typeof Genres[0]['songs'][0];
 isPlaying: boolean;
}

interface Action {
 type: string;
 payload?: {
  trackIndex: number;
  currentTrack: typeof Genres[0]['songs'][0];
 };
}

const initialState: TrackState = {
 trackIndex: 0,
 currentTrack: Genres[0].songs[0],
 isPlaying: false,
};

function reducer(state: TrackState, action: Action): TrackState {
 switch (action.type) {
  case SET_TRACK:
    return {
      ...state,
      trackIndex: action.payload!.trackIndex,
      currentTrack: action.payload!.currentTrack,
    };
  case START_PLAYING:
    return {
      ...state,
      isPlaying: true,
    };
  case PAUSE_PLAYING:
    return {
      ...state,
      isPlaying: false,
    };
  default:
    return state;
 }
}

interface TrackContextValue extends TrackState {
 setTrack: (trackIndex: number, currentTrack: typeof Genres[0]['songs'][0]) => void;
 playSong: () => void;
 pauseSong: () => void;
 audioRef: React.MutableRefObject<HTMLAudioElement>;
}

export const TrackContext = createContext<TrackContextValue | undefined>(undefined);

interface TrackProviderProps {
 children: ReactNode;
}

export const TrackProvider = ({ children }: TrackProviderProps) => {
 const [state, dispatch] = useReducer(reducer, initialState);
 const audioRef = useRef<HTMLAudioElement>(null) as React.MutableRefObject<HTMLAudioElement>;

 const setTrack = (trackIndex: number, currentTrack: typeof Genres[0]['songs'][0]) => {
  dispatch({ type: SET_TRACK, payload: { trackIndex, currentTrack } });
 };

 const playSong = () => {
  dispatch({ type: START_PLAYING });
 };

 useEffect

 const pauseSong = () => {
  dispatch({ type: PAUSE_PLAYING });
  audioRef.current.pause();
 };

 return (
  <TrackContext.Provider value={{ ...state, setTrack, playSong, pauseSong, audioRef }}>
    {children}
  </TrackContext.Provider>
 );
};

export const useTrackState = () => {
 const context = useContext(TrackContext);
 if (!context) throw new Error("useTrackState must be used within a TrackProvider");
 return context;
};
