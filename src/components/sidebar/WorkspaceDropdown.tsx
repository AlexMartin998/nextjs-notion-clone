'use client';

import { useEffect, useState } from 'react';

import { useCypress } from '@/lib/hooks/useCypress';
import { workspace } from '@/lib/supabase/supabase.types';
import SelectedWorkspace from './SelectedWorkspace';

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

  // set my workspaces to ContextProvider. This action must be done in UseClient FC
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

  ///* handlers
  const handleSelect = (option: workspace) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  ///*

  return (
    <div className="relative inline-block text-left">
      {/* ====== Workspace selector ====== */}
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? (
            <SelectedWorkspace workspace={selectedOption} />
          ) : (
            'Select a workspace'
          )}
        </span>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
