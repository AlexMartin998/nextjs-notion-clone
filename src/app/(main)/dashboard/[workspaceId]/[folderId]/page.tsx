export const dynamic = 'force-dynamic';

import { getFolderDetails } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

export type FolderProps = {
  params: { folderId: string };
};

const Folder: React.FC<FolderProps> = async ({ params }) => {
  const { data, error } = await getFolderDetails(params.folderId);
  if (error || !data.length) redirect('/dashboard');

  return (
    <div className="relative ">
      Folder Page - QuillEditor
      {/* <QuillEditor
        dirType="folder"
        fileId={params.folderId}
        dirDetails={data[0] || {}}
      /> */}
    </div>
  );
};

export default Folder;
