import { Box, Button, Flex } from '@chakra-ui/react'
import {
  Balance,
  DefaultCredentials,
  useWorkspace,
} from '@tru_id/console-components'
import { signOut } from 'next-auth/client'
import * as React from 'react'
import withAuthenticationRequired from '../src/withAuthenticationRequired'

function Console() {
  const { loading, workspace, error } = useWorkspace()
  if (loading) {
    return <Box p={6}>Loading workspace</Box>
  }
  if (error) {
    return <Box p={6}>Error fetching workspace</Box>
  }
  return (
    <Box>
      <Flex p={4} bg="blue.800" justifyContent="flex-end">
        <Button size="sm" onClick={() => signOut({ callbackUrl: '/login' })}>
          Logout
        </Button>
      </Flex>
      <Flex py={6} px={4} mb={4}>
        <Box width="30%">
          <Balance workspace={workspace} />
        </Box>
        <Box flex={1}>
          <DefaultCredentials canResetCredentials={false} />
        </Box>
      </Flex>
    </Box>
  )
}

export default withAuthenticationRequired(Console)
