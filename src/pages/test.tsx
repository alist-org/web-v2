import { Center, Heading } from '@chakra-ui/layout'
import React from 'react'
import { useLocation } from 'react-router-dom'

const TestPage = ()=>{
  const location = useLocation()
  return <Center h="full">
    <Heading>{location.pathname}</Heading>
  </Center>
}

export default TestPage;