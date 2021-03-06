import { Box, Button } from '@chakra-ui/react'
import { signIn } from 'next-auth/client'
import * as React from 'react'

function LoginPage() {
  return (
    <Box p={4}>
      <Button
        onClick={() =>
          signIn('tru_client_credentials', {
            callbackUrl: window.location.origin,
          })
        }
      >
        Login with client_credentials
      </Button>
    </Box>
  )
}

export default LoginPage
