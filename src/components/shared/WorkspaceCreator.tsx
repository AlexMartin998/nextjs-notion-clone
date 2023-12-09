'use client';

import { Lock, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAuthUser } from '@/lib/hooks/useAuthUser';
import { WorkspacesPermissions } from '@/lib/interfaces';
import { addCollaborators, createWorkspace } from '@/lib/supabase/queries';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { Input, Label } from '../ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useToast } from '../ui/use-toast';

export type WorkspaceCreatorProps = {};

const WorkspaceCreator: React.FC<WorkspaceCreatorProps> = () => {
  const { user } = useAuthUser();
  const router = useRouter();
  const { toast } = useToast();

  const [permissions, setPermissions] = useState(WorkspacesPermissions.private);
  const [title, setTitle] = useState('');
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  ///* collaborator handler
  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter(c => c.id !== user.id));
  };

  const createItem = async () => {
    setIsLoading(true);
    const uuid = uuidv4();

    if (user?.id) {
      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: '💼',
        id: uuid,
        inTrash: '',
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: '',
      };
      if (permissions === WorkspacesPermissions.private) {
        toast({ title: 'Success', description: 'Created the workspace' });
        await createWorkspace(newWorkspace);
        router.refresh();
      }
      if (permissions === WorkspacesPermissions.shared) {
        toast({ title: 'Success', description: 'Created the workspace' });
        await createWorkspace(newWorkspace);
        await addCollaborators(collaborators, uuid);
        router.refresh();
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </Label>

        <div className="flex justify-center items-center gap-2 pt-[3px]">
          <Input
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </div>
      </div>

      {/* ====== Permissions ====== */}
      <>
        <Label htmlFor="permissions" className="text-sm text-muted-foreground">
          Permission
        </Label>

        {/* --- Select workspace premission --- */}
        <Select
          onValueChange={val => {
            setPermissions(val as any);
          }}
          defaultValue={permissions}
        >
          <SelectTrigger className="w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {/* Private */}
              <SelectItem value="private">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>
                      Your workspace is private to you. You can choose to share
                      it later.
                    </p>
                  </article>
                </div>
              </SelectItem>

              {/* Shared */}
              <SelectItem value="shared">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Share></Share>
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <span>You can invite collaborators.</span>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </>

      {/* ====== Permissions ====== */}
      {permissions === 'shared' && <div></div>}
    </div>
  );
};

export default WorkspaceCreator;
