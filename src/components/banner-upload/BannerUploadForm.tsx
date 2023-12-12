'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SubmitHandler, useForm } from 'react-hook-form';

import { UploadBannerFormSchema } from '@/lib/helpers';
import { useCypress } from '@/lib/hooks/useCypress';
import { WPDirType } from '@/lib/interfaces';
import {
  updateFile,
  updateFolder,
  updateWorkspace,
} from '@/lib/supabase/queries';
import { Input, Label } from '../ui';

export type BannerUploadFormProps = {
  dirType: WPDirType;
  id: string;
};

type FormData = {
  banner: string;
};

const BannerUploadForm: React.FC<BannerUploadFormProps> = ({ dirType, id }) => {
  const supabase = createClientComponentClient();
  const {
    state,
    workspaceId,
    folderId,
    updateFile: updateFileContext,
    updateFolder: updateFolderContext,
    updateWorkspace: updateWorkspaceContext,
  } = useCypress();

  ///*  Form
  const form = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(UploadBannerFormSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FormData> = async formData => {
    const file = formData.banner?.[0];
    if (!file || !id) return;

    try {
      let filePath = null;

      const uploadBanner = async () => {
        const { data, error } = await supabase.storage
          .from('file-banners')
          .upload(`banner-${id}`, file, { cacheControl: '5', upsert: true });
        if (error) throw new Error();
        filePath = data.path;
      };

      if (dirType === WPDirType.file) {
        if (!workspaceId || !folderId) return;
        await uploadBanner();
        updateFileContext({
          file: { bannerUrl: filePath },
          fileId: id,
          folderId,
          workspaceId,
        });
        await updateFile({ bannerUrl: filePath }, id);
      }

      if (dirType === WPDirType.folder) {
        if (!workspaceId || !folderId) return;
        await uploadBanner();
        updateFolderContext({
          folderId: id,
          folder: { bannerUrl: filePath },
          workspaceId,
        });
        await updateFolder({ bannerUrl: filePath }, id);
      }

      if (dirType === 'workspace') {
        if (!workspaceId) return;
        await uploadBanner();
        updateWorkspaceContext({
          workspace: { bannerUrl: filePath },
          workspaceId,
        });
        await updateWorkspace({ bannerUrl: filePath }, id);
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {/* ------ Upload image ------ */}
      <Label className="text-sm text-muted-foreground" htmlFor="bannerImage">
        Banner Image
      </Label>
      <Input
        id="bannerImage"
        type="file"
        accept="image/*"
        disabled={isSubmitting}
        {...register('banner', { required: 'Banner Image is required' })}
      />

      {/* ------ s ------ */}
    </form>
  );
};

export default BannerUploadForm;
