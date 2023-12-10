import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from '@/lib/supabase/queries';
import { twMerge } from 'tailwind-merge';
import { PlanUsage } from '.';
import WorkspaceDropdown from './WorkspaceDropdown';

export type SidebarProps = {
  params: { workspaceId: string };
  className?: string;
};

////* Server Components can be Async
const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });

  ///* user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  ///* subscription
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  ///* folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  );

  ///* error
  if (subscriptionError || foldersError) redirect('/dashboard');

  ///* get all the != workspaces: private, collaborating & shared
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  return (
    <aside
      className={twMerge(
        'hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between',
        className
      )}
    >
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          // selectedOption
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find(workspace => workspace.id === params.workspaceId)}
        />

        <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
