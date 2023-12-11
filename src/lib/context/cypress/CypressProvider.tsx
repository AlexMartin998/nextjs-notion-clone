'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useReducer } from 'react';

import { FoldersDropdownListProps } from '@/components/sidebar/FoldersDropdownList';
import { getFiles } from '@/lib/supabase/queries';
import { File, Folder, workspace } from '../../supabase/supabase.types';
import { CypressContext } from './CypressContext';
import { CypressActionType, cypressReducer } from './cypressReducer';
import {
  AddFileProps,
  AddFolderProps,
  SetMyWorkspacesProps,
  UpdateFileProps,
  UpdateFolderProps,
  UpdateWorkspaceProps,
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

  const fileId = useMemo(() => {
    const urlSegments = pathname?.split('/').filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 3) {
        return urlSegments[3];
      }
  }, [pathname]);

  ////* effects
  // fetch & set folder files to each folder
  useEffect(() => {
    if (!folderId || !workspaceId) return;

    const fetchFiles = async () => {
      const { error: filesError, data } = await getFiles(folderId);
      if (filesError) {
        console.log(filesError);
      }
      if (!data) return;
      dispatch({
        type: CypressActionType.setFiles,
        payload: { workspaceId, files: data, folderId },
      });
    };
    fetchFiles();
  }, [folderId, workspaceId]);

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

  const updateWorkspace = ({
    workspace,
    workspaceId,
  }: UpdateWorkspaceProps) => {
    dispatch({
      type: CypressActionType.updateWorkspaces,
      payload: { workspace, workspaceId },
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
        updateWorkspace,
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
