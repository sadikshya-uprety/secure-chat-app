import React, { createContext, useContext, useReducer } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_USER':
      return {
        ...state,
        chatId: action.payload.chatId,
        user: action.payload.user,
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const initialState = {
    chatId: null,
    user: null,
    messages: [],
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};