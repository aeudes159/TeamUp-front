import React, { useState } from 'react';
import { GroupSelector } from './GroupSelector';
import type { Post, User, Location } from '@/types';

type ActivityProposalWrapperProps = {
  children: React.ReactNode;
  post: Post;
  author?: User;
  location?: Location;
};

export function ActivityProposalWrapper({ 
  children, 
  post, 
  author, 
  location 
}: ActivityProposalWrapperProps) {
  const [showGroupSelector, setShowGroupSelector] = useState(false);

  const handleProposeActivity = () => {
    setShowGroupSelector(true);
  };

  const handleCloseGroupSelector = () => {
    setShowGroupSelector(false);
  };

  const getAuthorName = () => {
    if (!author) return '';
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  };

  const getLocationName = () => {
    return location?.name || location?.address || '';
  };

  // Clone children and add the onProposeActivity prop
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onProposeActivity: handleProposeActivity,
      });
    }
    return child;
  });

  return (
    <>
      {childrenWithProps}
      <GroupSelector
        visible={showGroupSelector}
        post={post}
        onClose={handleCloseGroupSelector}
        authorName={getAuthorName()}
        locationName={getLocationName()}
      />
    </>
  );
}