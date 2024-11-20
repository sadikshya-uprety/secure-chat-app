import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Image,
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
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { decryptMessage } from '../../services/encryption';
import moment from 'moment';

const PrivateChat = () => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const { data } = useChat();
  const toast = useToast();

  useEffect(() => {
    if (data.chatId) {
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', data.chatId),
        where('isPrivate', '==', true),
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
      });

      return () => unsubscribe();
    }
  }, [data.chatId]);

  // Auto-delete seen messages
  useEffect(() => {
    const deleteSeenMessages = async () => {
      for (const message of messages) {
        if (message.senderId !== currentUser.uid && !message.seen) {
          // Mark message as seen
          await updateDoc(doc(db, 'messages', message.id), {
            seen: true,
            seenAt: serverTimestamp(),
          });

          // Delete message after 5 seconds
          setTimeout(async () => {
            try {
              await deleteDoc(doc(db, 'messages', message.id));
            } catch (error) {
              console.error('Error deleting message:', error);
            }
          }, 5000);
        }
      }
    };

    deleteSeenMessages();
  }, [messages, currentUser.uid]);

  const renderMessage = (message) => {
    const isSender = message.senderId === currentUser.uid;

    return (
      <Flex
        key={message.id}
        justify={isSender ? 'flex-end' : 'flex-start'}
        mb={4}
      >
        <Box
          maxW="70%"
          bg={isSender ? 'primary' : 'gray.100'}
          color={isSender ? 'white' : 'black'}
          p={3}
          borderRadius="lg"
          position="relative"
        >
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
            position="absolute"
            right={2}
            bottom={1}
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

export default PrivateChat;