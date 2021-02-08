import { useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../reducer';
import { readNotification } from '../../reducer/slices/notifications';

export default function Notifications() {
  const toast = useToast();
  const dispatch = useDispatch();
  const notifications = useSelector(state =>
    state.notifications.filter(({ read, hidden }) => !read && !hidden)
  );

  useEffect(() => {
    for (let notification of notifications) {
      toast({
        title: notification.title,
        description: notification.description,
        status: notification.status,
        duration: 10000,
        isClosable: true,
        onCloseComplete() {
          dispatch(readNotification(notification.requestId));
        }
      });
    }
  }, [notifications]);

  return <></>;
}
