import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import ChatList from './ChatList';
import MessageBox from './MessageBox';
import { VideoCall, Call, Mic } from '@mui/icons-material';
import { db } from '../../services/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

const ChatWindow = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (selectedChat) {
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', selectedChat.id),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = [];
        snapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() });
        });
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [selectedChat]);

  return (
    <Grid
      templateColumns="300px 1fr"
      h="100vh"
      bg="gray.50"
    >
      <ChatList
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <Flex direction="column" h="100%" borderLeft="1px" borderColor="gray.200">
        {selectedChat ? (
          <>
            <Flex
              p={4}
              bg="white"
              alignItems="center"
              justifyContent="space-between"
              borderBottom="1px"
              borderColor="gray.200"
            >
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  {selectedChat.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {selectedChat.isOnline ? 'Online' : 'Offline'}
                </Text>
              </Box>
              <Flex gap={2}>
                <IconButton
                  icon={<Call />}
                  aria-label="Voice call"
                  variant="ghost"
                  onClick={onOpen}
                />
                <IconButton
                  icon={<VideoCall />}
                  aria-label="Video call"
                  variant="ghost"
                  onClick={onOpen}
                />
                <IconButton
                  icon={<Mic />}
                  aria-label="Voice message"
                  variant="ghost"
                />
              </Flex>
            </Flex>
            <MessageBox
              messages={messages}
              selectedChat={selectedChat}
              currentUser={currentUser}
            />
          </>
        ) : (
          <Flex
            justify="center"
            align="center"
            h="100%"
            bg="gray.50"
            color="gray.500"
          >
            Select a chat to start messaging
          </Flex>
        )}
      </Flex>
    </Grid>
  );
};

export default ChatWindow;