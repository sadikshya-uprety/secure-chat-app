import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/chat');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate('/chat');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box
      bgImage="url('/assets/background.jpg')"
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
    >
      <Container maxW="container.sm" pt={20}>
        <VStack
          spacing={8}
          p={8}
          bg="rgba(255, 255, 255, 0.9)"
          borderRadius="xl"
          boxShadow="xl"
        >
          <Text fontSize="4xl" fontWeight="bold" color="blue.600">
            Secure Chat App
          </Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} width="100%">
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={loading}
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                Login
              </Button>
            </VStack>
          </form>
          <Button
            leftIcon={<FaGoogle />}
            onClick={handleGoogleSignIn}
            width="100%"
            colorScheme="red"
            variant="outline"
            _hover={{ transform: 'scale(1.02)' }}
            transition="all 0.2s"
          >
            Sign in with Google
          </Button>
          <Flex gap={2}>
            <Text>Don't have an account?</Text>
            <Link to="/signup">
              <Text color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Sign Up
              </Text>
            </Link>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;