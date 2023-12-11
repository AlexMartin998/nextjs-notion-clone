'use client';

import {
  AppFoldersType,
  AppWorkspacesType,
  CypressState,
} from './CypressProvider';

export type CypressAction =
  | {
      type: CypressActionType.setWorkspaces;
      payload: { workspaces: AppWorkspacesType[] };
    }
  | {
      type: CypressActionType.setFolders;
      payload: { workspaceId: string; folders: [] | AppFoldersType[] };
    }
  | {
      type: CypressActionType.addFolder;
      payload: { workspaceId: string; folder: AppFoldersType };
    };

export enum CypressActionType {
  setWorkspaces = 'SET_WORKSPACES',
  setFolders = 'SET_FOLDERS',
  addFolder = 'ADD_FOLDER',
}

export const cypressReducer = (
  state: CypressState,
  action: CypressAction
): CypressState => {
  switch (action.type) {
    case CypressActionType.setWorkspaces:
      return { ...state, workspaces: action.payload.workspaces };

    case CypressActionType.setFolders:
      return {
        ...state,

        workspaces: state.workspaces.map(workspace => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,

              folders: action.payload.folders.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              ),
            };
          }

          return workspace;
        }),
      };

    case CypressActionType.addFolder:
      return {
        ...state,

        workspaces: state.workspaces.map(workspace => ({
          ...workspace,

          folders: [...workspace.folders, action.payload.folder].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        })),
      };
    default:
      return state;
  }
};
