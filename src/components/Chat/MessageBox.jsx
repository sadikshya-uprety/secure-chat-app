import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  IconButton,
  Text,
  Image,
  useToast,
} from '@chakra-ui/react';
import { Send, AttachFile, Image as ImageIcon, Close } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { db, storage } from '../../services/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { encryptMessage } from '../../services/encryption';

const MessageBox = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const { currentUser } = useAuth();
  const { data } = useChat();
  const fileInputRef = useRef();
  const toast = useToast();
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;

    try {
      let fileUrl = '';
      if (file) {
        const fileRef = ref(storage, `files/${uuidv4()}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      const encryptedMessage = message ? encryptMessage(message, data.chatId) : '';

      await addDoc(collection(db, 'messages'), {
        chatId: data.chatId,
        senderId: currentUser.uid,
        text: encryptedMessage,
        fileUrl,
        fileType: file?.type || '',
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(db, 'chats', data.chatId), {
        lastMessage: {
          text: message || 'Sent an attachment',
          timestamp: new Date().toISOString(),
        },
      });

      setMessage('');
      setFile(null);
    } catch (error) {
      toast({
        title: 'Error sending message',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 10MB',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <Box p={4} bg="white">
      {file && (
        <Flex mb={2} align="center">
          {file.type.startsWith('image/') ? (
            <Image
              src={URL.createObjectURL(file)}
              alt="Selected file"
              boxSize="100px"
              objectFit="cover"
              borderRadius="md"
              mr={2}
            />
          ) : (
            <Box
              p={2}
              bg="gray.100"
              borderRadius="md"
              mr={2}
            >
              <Text fontSize="sm">{file.name}</Text>
            </Box>
          )}
          <IconButton
            icon={<Close />}
            size="sm"
            onClick={() => setFile(null)}
          />
        </Flex>
      )}
      <Flex gap={2}>
        <Input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx"
        />
        <IconButton
          icon={<AttachFile />}
          onClick={() => fileInputRef.current.click()}
        />
        <Input
          flex={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          _focus={{
            borderColor: 'primary',
            boxShadow: '0 0 0 1px var(--chakra-colors-primary)',
          }}
        />
        <IconButton
          colorScheme="primary"
          icon={<Send />}
          onClick={handleSendMessage}
          isDisabled={!message.trim() && !file}
        />
      </Flex>
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageBox;