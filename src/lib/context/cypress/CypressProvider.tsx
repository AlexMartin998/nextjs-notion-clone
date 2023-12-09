'use client';

import { useReducer } from 'react';

import { Folder, workspace } from '../../supabase/supabase.types';
import { CypressContext, SetMyWorkspacesProps } from './CypressContext';
import { CypressActionType, cypressReducer } from './cypressReducer';

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

  return (
    <CypressContext.Provider value={{ state, setMyWorkspaces }}>
      {children}
    </CypressContext.Provider>
  );
};
