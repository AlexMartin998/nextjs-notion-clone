'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useReducer } from 'react';

import { FoldersDropdownListProps } from '@/components/sidebar/FoldersDropdownList';
import { File, Folder, workspace } from '../../supabase/supabase.types';
import { CypressContext } from './CypressContext';
import { CypressActionType, cypressReducer } from './cypressReducer';
import {
  AddFileProps,
  AddFolderProps,
  SetMyWorkspacesProps,
  UpdateFileProps,
  UpdateFolderProps,
} from './types';

export type AppFoldersType = Folder & { files: File[] | [] };
export type AppWorkspacesType = workspace & {
  folders: AppFoldersType[] | [];
};

export interface CypressState {
  workspaces: AppWorkspacesType[] | [];
}

interface CypressProviderProps {
  children: React.ReactNode;
}

const CYPRESS_INIT_STATE: CypressState = { workspaces: [] };

export const CypressProvider = ({ children }: CypressProviderProps) => {
  const [state, dispatch] = useReducer(cypressReducer, CYPRESS_INIT_STATE);
  const pathname = usePathname();

  // keep workspaceId always updated
  const workspaceId = useMemo(() => {
    const urlSegments = pathname?.split('/').filter(Boolean);
    if (urlSegments)
      if (urlSegments.length > 1) {
        return urlSegments[1];
      }
  }, [pathname]);

  const folderId = useMemo(() => {
    const urlSegments = pathname?.split('/').filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 2) {
        return urlSegments[2];
      }
  }, [pathname]);

  /////* dispatchers
  const setMyWorkspaces = ({
    privateWorkspaces,
    sharedWorkspaces,
    collaboratingWorkspaces,
  }: SetMyWorkspacesProps) => {
    dispatch({
      type: CypressActionType.setWorkspaces,
      payload: {
        workspaces: [
          ...privateWorkspaces,
          ...sharedWorkspaces,
          ...collaboratingWorkspaces,
        ].map(workspace => ({ ...workspace, folders: [] })),
      },
    });
  };

  const setFolders = ({
    workspaceId,
    workspaceFolders,
  }: FoldersDropdownListProps) => {
    dispatch({
      type: CypressActionType.setFolders,
      payload: {
        workspaceId,
        folders: workspaceFolders.map(folder => ({
          ...folder,
          // add folder files
          files:
            state.workspaces
              .find(workspace => workspace.id === workspaceId)
              ?.folders.find(f => f.id === folder.id)?.files || [],
        })),
      },
    });
  };

  const addFolder = ({ workspaceId, newFolder }: AddFolderProps) => {
    dispatch({
      type: CypressActionType.addFolder,
      payload: { workspaceId, folder: { ...newFolder, files: [] } },
    });
  };

  const updateFolder = ({
    folder,
    folderId,
    workspaceId,
  }: UpdateFolderProps) => {
    dispatch({
      type: CypressActionType.updateFolder,
      payload: {
        folder,
        folderId,
        workspaceId,
      },
    });
  };

  const updateFile = (payload: UpdateFileProps) => {
    dispatch({
      type: CypressActionType.updateFile,
      payload,
    });
  };

  const addFile = (payload: AddFileProps) => {
    dispatch({
      type: CypressActionType.addFile,
      payload,
    });
  };

  return (
    <CypressContext.Provider
      value={{
        state,
        workspaceId,
        folderId,

        setMyWorkspaces,
        setFolders,
        addFolder,
        updateFolder,
        addFile,
        updateFile,
      }}
    >
      {children}
    </CypressContext.Provider>
  );
};
