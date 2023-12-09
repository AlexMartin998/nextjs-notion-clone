'use client';

import { useEffect, useState } from 'react';

import { useCypress } from '@/lib/hooks/useCypress';
import { workspace } from '@/lib/supabase/supabase.types';

export type WorkspaceDropdownProps = {
  privateWorkspaces: workspace[];
  sharedWorkspaces: workspace[];
  collaboratingWorkspaces: workspace[];
  defaultValue: workspace | undefined;
};

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
  privateWorkspaces,
  collaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue,
}) => {
  const { state, setMyWorkspaces } = useCypress();

  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  // set my workspaces to ContextProvider
  useEffect(() => {
    if (!state.workspaces.length) {
      setMyWorkspaces({
        privateWorkspaces,
        collaboratingWorkspaces,
        sharedWorkspaces,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    collaboratingWorkspaces,
    privateWorkspaces,
    sharedWorkspaces,
    state.workspaces.length,
  ]);

  ///*
  const handleSelect = (option: workspace) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  ///*

  return (
    <div className="relative inline-block text-left">
      {/* ====== Workspace selector ====== */}
      <div>
        <span onClick={() => setIsOpen(!isOpen)}></span>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
