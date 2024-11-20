import React from 'react';
import { Box, Flex, IconButton, Avatar, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Logout } from '@mui/icons-material';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Flex
      bg="white"
      p={4}
      justify="space-between"
      align="center"
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Box fontSize="xl" fontWeight="bold" color="primary">
        Secure Chat
      </Box>
      <Flex align="center" gap={4}>
        <IconButton
          icon={<Settings />}
          variant="ghost"
          onClick={() => navigate('/settings')}
        />
        <Menu>
          <MenuButton>
            <Avatar
              size="sm"
              src={currentUser?.photoURL}
              name={currentUser?.username}
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
            <MenuItem onClick={handleLogout} icon={<Logout />}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
