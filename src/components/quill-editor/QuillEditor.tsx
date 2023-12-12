'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

// quill styles - theme
import 'quill/dist/quill.snow.css';

import { useAuthUser } from '@/lib/hooks/useAuthUser';
import { useCypress } from '@/lib/hooks/useCypress';
import { Folder, workspace } from '@/lib/supabase/supabase.types';

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

  /// realtime with sockets
  // const { socket, isConnected } = useSocket();

  /// debouncer
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  //////* s
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

  return (
    <>
      <div id="container" className="max-w-[800px]" ref={wrapperRef}></div>
    </>
  );
};

export default QuillEditor;
