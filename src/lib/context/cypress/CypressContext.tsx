'use client';

import { createContext } from 'react';

import { FoldersDropdownListProps } from '@/components/sidebar/FoldersDropdownList';
import { CypressState } from './CypressProvider';
import {
  AddFileProps,
  AddFolderProps,
  DeleteFileProps,
  SetMyWorkspacesProps,
  UpdateFileProps,
  UpdateFolderProps,
  UpdateWorkspaceProps,
} from './types';

////* Context
interface CypressContextProps {
  state: CypressState;
  workspaceId: string | undefined;
  folderId: string | undefined;
  // fileId: string | undefined;

  setMyWorkspaces: ({
    privateWorkspaces,
    sharedWorkspaces,
    collaboratingWorkspaces,
  }: SetMyWorkspacesProps) => void;
  updateWorkspace: (props: UpdateWorkspaceProps) => void;
  deleteWorkspace: (workspaceId: string) => void;

  setFolders: ({
    workspaceId,
    workspaceFolders,
  }: FoldersDropdownListProps) => void;
  addFolder: ({ workspaceId, newFolder }: AddFolderProps) => void;
  updateFolder: ({ folder, folderId, workspaceId }: UpdateFolderProps) => void;

  addFile: (props: AddFileProps) => void;
  updateFile: ({
    file,
    fileId,
    folderId,
    workspaceId,
  }: UpdateFileProps) => void;
  deleteFile: (props: DeleteFileProps) => void;
}

export const CypressContext = createContext({} as CypressContextProps);
