'use client';

import { Dispatch, createContext } from 'react';

import { CypressAction, CypressState } from '.';

interface CypressContextProps {
  state: CypressState;
  // workspaceId: string | undefined;
  // folderId: string | undefined;
  // fileId: string | undefined;

  // dispatch: Dispatch<CypressAction>;
}

export const CypressContext = createContext({} as CypressContextProps);
