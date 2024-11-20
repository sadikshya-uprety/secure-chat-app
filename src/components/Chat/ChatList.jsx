import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Avatar,
  Input,
  IconButton,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { Search, Add } from '@mui/icons-material';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');
  const { currentUser } = useAuth();
  const { dispatch } = useChat();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = [];
      snapshot.forEach((doc) => {
        chatData.push({ id: doc.id, ...doc.data() });
      });
      setChats(chatData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectChat = (chat) => {
    dispatch({
      type: 'CHANGE_USER',
      payload: {
        chatId: chat.id,
        user: chat.participants.find((p) => p !== currentUser.uid),
      },
    });
  };

  return (
    <Box bg="white" h="100%" borderRight="1px" borderColor="gray.200">
      <VStack p={4} spacing={4}>
        <Flex w="100%" gap={2}>
          <Input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton icon={<Add />} onClick={onOpen} />
        </Flex>

        {filteredChats.map((chat) => (
          <Flex
            key={chat.id}
            w="100%"
            p={3}
            alignItems="center"
            cursor="pointer"
            _hover={{ bg: 'gray.50' }}
            onClick={() => handleSelectChat(chat)}
          >
            <Avatar
              size="md"
              src={chat.photoURL}
              name={chat.name}
              mr={3}
            />
            <Box flex={1}>
              <Text fontWeight="bold">{chat.name}</Text>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                {chat.lastMessage?.text || 'No messages yet'}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default ChatList;