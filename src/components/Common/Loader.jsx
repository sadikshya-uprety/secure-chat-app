import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      justify="center"
      align="center"
      bg="rgba(255, 255, 255, 0.8)"
      zIndex={9999}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="primary"
        size="xl"
      />
    </Flex>
  );
};

export default Loader;