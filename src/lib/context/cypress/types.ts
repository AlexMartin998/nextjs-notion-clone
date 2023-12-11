import { WorkspaceDropdownProps } from '@/components/sidebar/WorkspaceDropdown';
import { File, Folder } from '@/lib/supabase/supabase.types';
import { AppFoldersType } from './CypressProvider';

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

export type AddFileProps = {
  workspaceId: string;
  file: File;
  folderId: string;
};

export type UpdateFileProps = {
  file: Partial<File>;
  folderId: string;
  workspaceId: string;
  fileId: string;
};
