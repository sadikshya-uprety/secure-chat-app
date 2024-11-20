import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Image,
  Button,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { db } from '../../services/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { decryptMessage } from '../../services/encryption';
import moment from 'moment';

const PublicChat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const { currentUser } = useAuth();
  const { data } = useChat();
  const toast = useToast();

  // Fetch messages
  useEffect(() => {
    if (data.chatId) {
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', data.chatId),
        where('isPrivate', '==', false),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageData = [];
        snapshot.forEach((doc) => {
          const message = { id: doc.id, ...doc.data() };
          if (message.text) {
            try {
              message.decryptedText = decryptMessage(message.text, data.chatId);
            } catch (error) {
              console.error('Decryption error:', error);
              message.decryptedText = 'Message cannot be decrypted';
            }
          }
          messageData.push(message);
        });
        setMessages(messageData);

        // Get unique user IDs from messages
        const userIds = [...new Set(messageData.map(m => m.senderId))];
        fetchUsers(userIds);
      });

      return () => unsubscribe();
    }
  }, [data.chatId]);

  // Fetch user details
  const fetchUsers = async (userIds) => {
    const usersData = {};
    for (const userId of userIds) {
      if (!users[userId]) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          usersData[userId] = userDoc.data();
        }
      }
    }
    setUsers(prev => ({ ...prev, ...usersData }));
  };

  const renderMessage = (message) => {
    const isSender = message.senderId === currentUser.uid;
    const user = users[message.senderId];

    return (
      <Flex
        key={message.id}
        justify={isSender ? 'flex-end' : 'flex-start'}
        mb={4}
      >
        {!isSender && (
          <Avatar
            size="sm"
            src={user?.photoURL}
            name={user?.username}
            mr={2}
          />
        )}
        <Box
          maxW="70%"
          bg={isSender ? 'primary' : 'gray.100'}
          color={isSender ? 'white' : 'black'}
          p={3}
          borderRadius="lg"
        >
          {!isSender && (
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              {user?.username}
            </Text>
          )}
          {message.fileUrl && (
            message.fileType.startsWith('image/') ? (
              <Image
                src={message.fileUrl}
                alt="Shared image"
                maxH="200px"
                borderRadius="md"
                mb={2}
              />
            ) : (
              <Text
                fontSize="sm"
                color="blue.500"
                textDecoration="underline"
                cursor="pointer"
                onClick={() => window.open(message.fileUrl)}
                mb={2}
              >
                Download attachment
              </Text>
            )
          )}
          <Text>{message.decryptedText}</Text>
          <Text
            fontSize="xs"
            color={isSender ? 'whiteAlpha.700' : 'gray.500'}
            textAlign="right"
            mt={1}
          >
            {moment(message.timestamp?.toDate()).format('HH:mm')}
          </Text>
        </Box>
      </Flex>
    );
  };

  return (
    <Box
      flex={1}
      overflowY="auto"
      px={4}
      py={2}
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray.300',
          borderRadius: '24px',
        },
      }}
    >
      {messages.map(renderMessage)}
    </Box>
  );
};

export default PublicChat;