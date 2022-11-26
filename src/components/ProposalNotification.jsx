import React from 'react';
import { Divider, Flex, Text, HStack } from '@chakra-ui/react';
import NotificationBadge from '../components/NotificationBadge';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

export default function ProposalNotification({
  title,
  className,
  status,
  onClose,
  to,
  ...props
}) {
  return (
    <>
      <Flex
        p={4}
        flexDir="column"
        position={'relative'}
        cursor="pointer"
        {...props}
      >
        <HStack position={'absolute'} top={'15%'} left={'80%'}>
          <RouterLink to={to}>
            <EditIcon fontSize={'sm'} mb={1} />
          </RouterLink>
          <CloseIcon fontSize={'x-small'} cursor="pointer" onClick={onClose} />
        </HStack>
        <Text maxW="17ch">{title}</Text>
        <Text fontSize={'13'} color="gray.500">
          {className}
        </Text>
        <NotificationBadge text={status} />
      </Flex>
      <Divider />
    </>
  );
}
