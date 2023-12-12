'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

// quill styles - theme
import 'quill/dist/quill.snow.css';

import { useAuthUser } from '@/lib/hooks/useAuthUser';
import { useCypress } from '@/lib/hooks/useCypress';
import { WPListType } from '@/lib/interfaces';
import { File, Folder, workspace } from '@/lib/supabase/supabase.types';
import { Button } from '../ui';

export type QuillEditorProps = {
  dirDetails: File | Folder | workspace;
  fileId: string; // id of fetched data
  dirType: 'workspace' | 'folder' | 'file';
};

/////* Toolbar Opts - custom module in QuillEditor
var TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

const QuillEditor: React.FC<QuillEditorProps> = ({
  fileId,
  dirType,
  dirDetails,
}) => {
  const supabase = createClientComponentClient();
  const { state, workspaceId, folderId } = useCypress();
  const { user } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  const [quill, setQuill] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<
    { id: string; email: string; avatarUrl: string }[]
  >([]);
  const [deletingBanner, setDeletingBanner] = useState(false);

  // saving state like Google Docs
  const [saving, setSaving] = useState(false);

  // real tiem cursors like Google Docs
  const [localCursors, setLocalCursors] = useState<any>([]);

  ///* realtime with sockets
  // const { socket, isConnected } = useSocket();

  ///* debouncer
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  //////* Display Quill Editor
  const wrapperRef = useCallback(async (wrapper: any) => {
    // quill need window object
    if (typeof window !== 'undefined') {
      if (wrapper === null) return;
      wrapper.innerHTML = ''; // clear wrapper to avoid creating new editors each time

      const editor = document.createElement('div');
      wrapper.append(editor);

      const Quill = (await import('quill')).default;
      // const QuillCursors = (await import('quill-cursors')).default;
      // Quill.register('modules/cursors', QuillCursors);

      const q = new Quill(editor, {
        theme: 'snow',
        // we can create custom component in Quill
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          // cursors: {
          //   transformOnTextChange: true,
          // },
        },
      });
      setQuill(q);
    }
  }, []);

  //////* Fix caching probles (server & client)
  const details = useMemo(() => {
    // keep tracking to dir in contextprovider, if it does not exist, use server dir
    let selectedDir;
    if (dirType === WPListType.file) {
      selectedDir = state.workspaces
        .find(workspace => workspace.id === workspaceId)
        ?.folders.find(folder => folder.id === folderId)
        ?.files.find(file => file.id === fileId);
    }
    if (dirType === WPListType.folder) {
      selectedDir = state.workspaces
        .find(workspace => workspace.id === workspaceId)
        ?.folders.find(folder => folder.id === fileId);
    }
    if (dirType === WPListType.workspace) {
      selectedDir = state.workspaces.find(workspace => workspace.id === fileId);
    }

    if (selectedDir) return selectedDir;

    return {
      title: dirDetails.title,
      iconId: dirDetails.iconId,
      createdAt: dirDetails.createdAt,
      data: dirDetails.data,
      inTrash: dirDetails.inTrash,
      bannerUrl: dirDetails.bannerUrl,
    } as workspace | Folder | File;
  }, [dirType, dirDetails, state.workspaces, workspaceId, folderId, fileId]);

  //////* Handlers
  const restoreFileHandler = async () => {};

  const deleteFileHandler = async () => {};

  return (
    <>
      <div className="relative">
        {details.inTrash && (
          <article className="py-2 z-40 bg-[#EB5757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap">
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <span className="text-white">
                This {dirType} is in the trash.
              </span>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={restoreFileHandler}
              >
                Restore
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={deleteFileHandler}
              >
                Delete
              </Button>
            </div>
          </article>
        )}
      </div>

      <div className="flex justify-center items-center flex-col mt-2 relative">
        <div id="container" className="max-w-[800px]" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default QuillEditor;
