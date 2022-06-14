import { DirectCallEndResult, DirectCallUserRole, RoomState, RoomType } from '@sendbird/calls-react-native';

export interface Query {
  release(): void;
  next(): Promise<unknown>;
  hasNext: boolean;
  isLoading: boolean;
}

export type NativeQueryKey = string;

export type NativeQueryCreator<QueryParams> = {
  (params: QueryParams): Promise<NativeQueryKey>;
};

export type QueryParams = {
  DirectCallLog: {
    limit?: number;
    myRole?: DirectCallUserRole;
    endResults?: DirectCallEndResult[];
  };
  RoomList: {
    limit?: number;
    createdByUserIds?: string[];
    roomIds?: string[];
    state?: RoomState;
    type?: RoomType;
    createdAt?: Range;
    currentParticipantCount?: Range;
  };
};

type Range = { upperBound?: number; lowerBound?: number };

export enum NativeQueryType {
  DIRECT_CALL_LOG = 'DIRECT_CALL_LOG',
  ROOM_LIST = 'ROOM_LIST',
}

export type NativeQueryResult<T> = Promise<{ hasNext: boolean; result: T[] }>;
