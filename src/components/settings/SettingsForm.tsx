'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Briefcase, Lock, Plus, Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAuthUser } from '@/lib/hooks/useAuthUser';
import { useCypress } from '@/lib/hooks/useCypress';
import {
  SubscriptionStatusEnum,
  WorkspacesPermissions,
} from '@/lib/interfaces';
import { useUiStore } from '@/lib/store/ui/ui';
import {
  addCollaborators,
  removeCollaborators,
  updateWorkspace,
} from '@/lib/supabase/queries';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { CollaboratorSearch } from '../shared';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Label,
} from '../ui';
import { ScrollArea } from '../ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';

export type SettingsFormProps = {};

const SettingsForm: React.FC<SettingsFormProps> = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const {
    state,
    workspaceId,
    updateWorkspace: updateWorkspaceContext,
  } = useCypress();
  const setOpen = useUiStore(s => s.setSubscriptionModalOpen);
  const { user, subscription } = useAuthUser();
  const { toast } = useToast();

  // const { open, setOpen } = useSubscriptionModal();
  const [permissions, setPermissions] = useState(WorkspacesPermissions.private);
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState(false); // confirm changes modal
  const [workspaceDetails, setWorkspaceDetails] = useState<workspace>();

  // loading states
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  // debouncer to perists changes automatically
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const isSubscriptionActive =
    subscription?.status === SubscriptionStatusEnum.active;

  //////* Collaborators handler
  /// get all collaborators

  /// add collaborators
  const addCollaborator = async (profile: User) => {
    if (!workspaceId) return;
    if (subscription?.status !== 'active' && collaborators.length >= 2)
      return setOpen(true); // 2 collabs as limit for free plans

    await addCollaborators([profile], workspaceId);
    setCollaborators([...collaborators, profile]);
  };

  /// remove collaborators
  const removeCollaborator = async (user: User) => {
    if (!workspaceId) return;
    if (collaborators.length === 1) {
      setPermissions(WorkspacesPermissions.private);
    }
    await removeCollaborators([user], workspaceId);

    setCollaborators(
      collaborators.filter(collaborator => collaborator.id !== user.id)
    );
    router.refresh();
  };

  /////* Workspace handler
  /// onChange workspace title
  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;

    updateWorkspaceContext({
      workspace: { title: e.target.value },
      workspaceId,
    });

    // debounce
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async () => {
      await updateWorkspace({ title: e.target.value }, workspaceId);
    }, 610);
  };

  /// onChange logo
  const onChangeWorkspaceLogo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!workspaceId || !isSubscriptionActive) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const { data, error } = await supabase.storage
      .from('workspace-logos')
      .upload(`workspaceLogo.${uuidv4}`, file, {
        cacheControl: '3600',
        upsert: true,
      });
    if (error) return;

    updateWorkspaceContext({ workspace: { logo: data.path }, workspaceId });

    await updateWorkspace({ logo: data.path }, workspaceId);
    setUploadingLogo(false);
  };

  /// onChange permissions
  const onPermissionsChange = (val: WorkspacesPermissions) => {
    if (val === WorkspacesPermissions.private) return setOpenAlertMessage(true);

    setPermissions(val);
  };

  /////* payments

  return (
    <div className="flex gap-4 flex-col">
      {/* ========= Header ========= */}
      <p className="flex items-center gap-2 mt-6">
        <Briefcase size={20} />
        Workspace
      </p>
      <Separator />

      {/* ========= Form ========= */}
      <div className="flex flex-col gap-[13px] pt-1">
        {/* ---- workspace name ---- */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="workspaceName"
            className="text-sm text-muted-foreground"
          >
            Name
          </Label>
          <Input
            name="workspaceName"
            value={workspaceDetails ? workspaceDetails.title : ''}
            placeholder="Workspace Name"
            onChange={workspaceNameChange}
          />
        </div>

        {/* ---- logo ---- */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="workspaceLogo"
            className="text-sm text-muted-foreground"
          >
            Workspace Logo
          </Label>
          <Input
            name="workspaceLogo"
            type="file"
            accept="image/*"
            placeholder="Workspace Logo"
            onChange={onChangeWorkspaceLogo}
            disabled={uploadingLogo || !isSubscriptionActive}
          />
        </div>

        {!isSubscriptionActive && (
          <small className="text-muted-foreground">
            To customize your workspace, you need to be on a{' '}
            <span className="font-bold">Pro Plan</span>
          </small>
        )}
      </div>

      {/* ========= Permissions ========= */}
      <>
        {/* --- Select workspace premission --- */}
        <Label htmlFor="permissions" className="pt-2 pb-1">
          Permissions
        </Label>

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

        {/* ====== permission ====== */}
        {permissions === 'shared' && (
          <div>
            {/* --- Searcher --- */}
            <CollaboratorSearch
              existingCollaborators={collaborators}
              getCollaborator={user => {
                addCollaborator(user);
              }}
            >
              <Button type="button" className="text-sm mt-4">
                <Plus />
                Add Collaborators
              </Button>
            </CollaboratorSearch>

            {/* --- Collaborators added --- */}
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Collaborators: {collaborators.length || ''}
              </span>

              <ScrollArea className="h-[120px] overflow-y-auto w-full rounded-md border border-muted-foreground/20 custom-scrollbar">
                {collaborators.length ? (
                  collaborators.map(collaborator => (
                    <div
                      className="p-4 flex justify-between items-center custom-scrollbar"
                      key={collaborator.id}
                    >
                      <div className="flex gap-4 items-center">
                        <Avatar>
                          <AvatarImage src="/avatars/7.png" />
                          <AvatarFallback>PJ</AvatarFallback>
                        </Avatar>
                        <div className="text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[210px] w-[140px]">
                          {collaborator.email}
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        onClick={() => removeCollaborator(collaborator)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center">
                    <span className="text-muted-foreground text-sm">
                      You have no collaborators
                    </span>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SettingsForm;
