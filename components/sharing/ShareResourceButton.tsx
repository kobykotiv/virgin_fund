import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ShareResourceModal from './ShareResourceModal';

type ShareResourceButtonProps = {
  resourceType: 'backtest' | 'portfolio' | 'bot' | 'strategy';
  resourceId: string;
  resourceName: string;
  description?: string;
  userId: string;
  variant?: 'icon' | 'button';
  buttonText?: string;
  buttonProps?: any;
  iconButtonProps?: any;
};

const ShareResourceButton: React.FC<ShareResourceButtonProps> = ({
  resourceType,
  resourceId,
  resourceName,
  description,
  userId,
  variant = 'button',
  buttonText = 'Share',
  buttonProps = {},
  iconButtonProps = {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {variant === 'icon' ? (
        <Tooltip title={`Share this ${resourceType}`}>
          <IconButton onClick={handleOpenModal} {...iconButtonProps}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          startIcon={<ShareIcon />}
          onClick={handleOpenModal}
          variant="outlined"
          {...buttonProps}
        >
          {buttonText}
        </Button>
      )}

      <ShareResourceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        resourceType={resourceType}
        resourceId={resourceId}
        resourceName={resourceName}
        description={description}
        userId={userId}
      />
    </>
  );
};

export default ShareResourceButton;
