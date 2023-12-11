'use client';

import { createContext } from 'react';

import { FoldersDropdownListProps } from '@/components/sidebar/FoldersDropdownList';
import { WorkspaceDropdownProps } from '@/components/sidebar/WorkspaceDropdown';
import { File, Folder } from '@/lib/supabase/supabase.types';
import { AppFoldersType, CypressState } from './CypressProvider';

// https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys
export type SetMyWorkspacesProps = Pick<
  WorkspaceDropdownProps,
  'privateWorkspaces' | 'sharedWorkspaces' | 'collaboratingWorkspaces'
>;

export type AddFolderProps = {
  workspaceId: string;
  newFolder: Folder;
};

export type UpdateFolderProps = {
  folder: Partial<AppFoldersType>;
  folderId: string;
  workspaceId: string;
};

export type UpdateFileProps = {
  file: Partial<File>;
  folderId: string;
  workspaceId: string;
  fileId: string;
};

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

  setFolders: ({
    workspaceId,
    workspaceFolders,
  }: FoldersDropdownListProps) => void;
  addFolder: ({ workspaceId, newFolder }: AddFolderProps) => void;
  updateFolder: ({ folder, folderId, workspaceId }: UpdateFolderProps) => void;

  updateFile: ({
    file,
    fileId,
    folderId,
    workspaceId,
  }: UpdateFileProps) => void;
}

export const CypressContext = createContext({} as CypressContextProps);
