'use client';

import { Search } from 'lucide-react';
import { useRef, useState } from 'react';

import { useAuthUser } from '@/lib/hooks/useAuthUser';
import { User } from '@/lib/supabase/supabase.types';
import { Input } from '../ui';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

export type CollaboratorSearchProps = {
  existingCollaborators: User[] | [];
  getCollaborator: (collaborator: User) => void;
  children: React.ReactNode;
};

const CollaboratorSearch: React.FC<CollaboratorSearchProps> = ({
  children,
  existingCollaborators,
  getCollaborator,
}) => {
  const { user } = useAuthUser();
  const [searchResults, setSearchResults] = useState<User[] | []>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  ////* handlers
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef) clearTimeout(timerRef.current);
    // timerRef.current = setTimeout(async () => {
    //   const res = await getUsersFromSearch(e.target.value);
    //   setSearchResults(res);
    // }, 450);
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>

      {/* ========= Content ========= */}
      <SheetContent className="w-[400px] sm:w-[540px]">
        {/* --- Search header --- */}
        <SheetHeader className="pb-3">
          <SheetTitle>Search Collaborator</SheetTitle>

          <SheetDescription>
            <p className="text-sm text-muted-foreground">
              You can also remove collaborators after adding them from the
              settings tab.
            </p>
          </SheetDescription>
        </SheetHeader>

        {/* --- Search bar --- */}
        <div className="flex justify-center items-center gap-2">
          <Search />
          <Input
            name="name"
            className="dark:bg-background"
            placeholder="Email"
            onChange={onChangeHandler}
          />
        </div>

        {/* ====== Content ====== */}
      </SheetContent>
    </Sheet>
  );
};

export default CollaboratorSearch;
