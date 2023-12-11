'use client';

import { File } from '@/lib/supabase/supabase.types';
import {
  AppFoldersType,
  AppWorkspacesType,
  CypressState,
} from './CypressProvider';
import { AddFileProps, UpdateFileProps, UpdateWorkspaceProps } from './types';

export type CypressAction =
  | {
      type: CypressActionType.setWorkspaces;
      payload: { workspaces: AppWorkspacesType[] };
    }
  | {
      type: CypressActionType.updateWorkspaces;
      payload: UpdateWorkspaceProps;
    }
  | {
      type: CypressActionType.setFolders;
      payload: { workspaceId: string; folders: [] | AppFoldersType[] };
    }
  | {
      type: CypressActionType.addFolder;
      payload: { workspaceId: string; folder: AppFoldersType };
    }
  | {
      type: CypressActionType.updateFolder;
      payload: {
        folder: Partial<AppFoldersType>;
        workspaceId: string;
        folderId: string;
      };
    }
  | {
      type: CypressActionType.updateFile;
      payload: UpdateFileProps;
    }
  | {
      type: CypressActionType.addFile;
      payload: AddFileProps;
    }
  | {
      type: CypressActionType.setFiles;
      payload: { workspaceId: string; files: File[]; folderId: string };
    };

export enum CypressActionType {
  setWorkspaces = 'SET_WORKSPACES',
  updateWorkspaces = 'UPDATE_WORKSPACE',

  setFolders = 'SET_FOLDERS',
  addFolder = 'ADD_FOLDER',
  updateFolder = 'UPDATE_FOLDER',

  setFiles = 'SET_FILES',
  addFile = 'ADD_FILE',
  updateFile = 'UPDATE_FILE',
}

export const cypressReducer = (
  state: CypressState,
  action: CypressAction
): CypressState => {
  switch (action.type) {
    //////* Workspaces
    case CypressActionType.setWorkspaces:
      return { ...state, workspaces: action.payload.workspaces };

    case CypressActionType.updateWorkspaces:
      return {
        ...state,

        workspaces: state.workspaces.map(workspace => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              ...action.payload.workspace,
            };
          }
          return workspace;
        }),
      };

    //////* Folders
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

    case CypressActionType.updateFolder:
      return {
        ...state,
        workspaces: state.workspaces.map(workspace => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map(folder => {
                if (folder.id === action.payload.folderId) {
                  return { ...folder, ...action.payload.folder };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };

    //////* Files
    case CypressActionType.setFiles:
      return {
        ...state,

        workspaces: state.workspaces.map(workspace => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map(folder => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: action.payload.files,
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };

    case CypressActionType.addFile:
      return {
        ...state,

        workspaces: state.workspaces.map(workspace => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map(folder => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: [...folder.files, action.payload.file].sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    ),
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };

    case CypressActionType.updateFile:
      return {
        ...state,

        workspaces: state.workspaces.map(workspace => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map(folder => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: folder.files.map(file => {
                      if (file.id === action.payload.fileId) {
                        return {
                          ...file,
                          ...action.payload.file,
                        };
                      }
                      return file;
                    }),
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };

    default:
      return state;
  }
};
