'use client';

import clsx from 'clsx';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export type CustomDialogTriggerProps = {
  header?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  className?: string;
};

const CustomDialogTrigger: React.FC<CustomDialogTriggerProps> = ({
  children,
  className,
  content,
  description,
  header,
}) => {
  return (
    <Dialog>
      <DialogTrigger className={clsx('', className)}>{children}</DialogTrigger>
      <DialogContent className="h-screen block sm:h-[440px] w-full">
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialogTrigger;
