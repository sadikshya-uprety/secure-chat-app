import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import PrivateRoute from './components/Common/PrivateRoute';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ChatWindow from './components/Chat/ChatWindow';
import Settings from './components/Settings/Settings';
import Profile from './components/Profile/Profile';


import './styles/index.scss';

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatWindow />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
