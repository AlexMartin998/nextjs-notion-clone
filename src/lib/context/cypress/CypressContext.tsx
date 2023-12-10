'use client';

import { createContext } from 'react';

import { FoldersDropdownListProps } from '@/components/sidebar/FoldersDropdownList';
import { WorkspaceDropdownProps } from '@/components/sidebar/WorkspaceDropdown';
import { CypressState } from './CypressProvider';

// https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys
export type SetMyWorkspacesProps = Pick<
  WorkspaceDropdownProps,
  'privateWorkspaces' | 'sharedWorkspaces' | 'collaboratingWorkspaces'
>;

interface CypressContextProps {
  state: CypressState;
  workspaceId: string | undefined;
  // folderId: string | undefined;
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
}

export const CypressContext = createContext({} as CypressContextProps);
